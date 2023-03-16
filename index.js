'use strict';

const fs = require('fs');
var https = require('follow-redirects').https;
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const data_path = './data/';
const source_base_uri = 'https://www.europarl.europa.eu/meps/en/';
const combined_source = 'members_by_country.json';
let argv = require('minimist')(process.argv.slice(2));

const download = !argv.hasOwnProperty('no-download');
const combine = !argv.hasOwnProperty('no-combine');

// How long to wait in miliseconds beween downloads.
const wait = argv.hasOwnProperty('combine') ? argv.hasOwnProperty('combine') : 300;

var alphasources = [];

// for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
//     alphasources.push(['odp/detailed-list-xml/' + String.fromCharCode(i), String.fromCharCode(i) + '.xml']);
// }

alphasources.push(['full-list/xml', 'full-list.xml']);

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Grab the remote data source and save a local copy.
function download_data_file(remote, local) {
    return new Promise((resolve, reject) => {
        var dest = fs.createWriteStream(data_path + local);
        https.get(source_base_uri + remote, function (response) {
            response.pipe(dest);
            response.on('end', async function () {
                if (!dest.writableFinished) {
                    await new Promise(fulfill => dest.on("finish", () => {
                        dest.close();
                        fulfill();
                        resolve(true);
                    }));
                } else {
                    dest.close();
                    resolve(true);
                }
            });
        }).on('error', (e) => {
            dest.close();
            console.log(e.message);
            reject(e);
        });
    });
}

async function download_data_files() {
    return new Promise(async (resolve, reject) => {
        let completed = 0;
        for (let source of alphasources) {
            console.log('Saving source ' + source[0] + ' to: ' + data_path + source[1])
            await download_data_file(source[0], source[1]);
            await sleep(wait);
            completed++;
        }
        if (completed == alphasources.length) {
            resolve(true);
        } else {
            reject(false);
        }
    });
}

function get_mep_contact_data(mep_id) {
    // get the MEP's contact data from the web
    // these are stored in a DIV with the class "erpl_social-share-horizontal"
    // and can contain the following elements (they also have other classes):
    // a.link_email : email address
    // a.link_twitt : twitter handle
    // a.link_fb : facebook page
    // a.link_instagram : instagram handle
    // a.link_website : website
    // a.link_youtube : youtube channel
    // we also want (if available)
    // time.sln-birth-date[datetime] : birth date
    // span.sln-birth-place : birth place
    console.log('Getting contact data for MEP ' + mep_id);
    return new Promise((resolve, reject) => {
        https.get(source_base_uri + mep_id, function (response) {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', async function () {
                console.log(response.statusCode)
                // parse the HTML
                let contact_data = {};
                let $ = cheerio.load(data);
                let social_links = $('.erpl_social-share-horizontal');
                social_links.find('a').each(function (i, elem) {
                    let link = $(this);
                    let link_class = link.attr('class');
                    let link_href = link.attr('href');
                    if (link_class) {
                        
                        if (link_class.indexOf('link_email') > -1) {
                            contact_data.email = link_href.replace('mailto:', '');
                        }
                        if (link_class.indexOf('link_twitt') > -1) {
                            contact_data.twitter = link_href;
                        }
                        if (link_class.indexOf('link_fb') > -1) {
                            contact_data.facebook = link_href;
                        }
                        if (link_class.indexOf('link_instagram') > -1) {
                            contact_data.instagram = link_href;
                        }
                        if (link_class.indexOf('link_website') > -1) {
                            contact_data.website = link_href;
                        }
                        if (link_class.indexOf('link_youtube') > -1) {
                            contact_data.youtube = link_href;
                        }
                        if (link_class.indexOf('link_blog') > -1) {
                            contact_data.blog = link_href;
                        }
                        if (link_class.indexOf('link_linkedin') > -1) {
                            contact_data.linkedin = link_href;
                        }

                    }
                });
                let birth_date = $('time.sln-birth-date');
                if (birth_date && birth_date != '' && birth_date.attr('datetime')) {
                    contact_data.birth_date = birth_date.attr('datetime');
                }
                let birth_place = $('span.sln-birth-place');
                if (birth_place && birth_place != '') {
                    contact_data.birth_place = birth_place.text();
                }
                console.log('Got contact data for MEP %d : %s', mep_id, contact_data);
                resolve(contact_data);
            });
        }).on('error', (e) => {
            console.log(e.message);
            reject(e);
        });
    });
}

// Combine alphabetic contact lists into single JSON object.
async function combine_data_files() {
    console.log('Combining data sources');
    var members_by_country = {};
    var num_meps = 0;
    var major_error = false;
    var error_count = 0;
    alphasources.forEach(function (source) {
        let xml_string = fs.readFileSync(data_path + source[1], "utf8");
        parser.parseString(xml_string, function (error, result) {
            if (error === null) {
                if (result.meps.mep) {
                    
                    result.meps.mep.forEach(function (member) {
                        let country = member.country[0];
                        if (!members_by_country[country]) {
                            members_by_country[country] = [];
                        }
                        // here we need to scrape the contact data from the web
                        // because now the XML only contains the MEP's name and country
                        // and the contact data is only available on the MEP's page
                        // https://www.europarl.europa.eu/meps/en/<mep_id>
                        members_by_country[country].push(member);
                        num_meps++;
                    });
                }
            }
            else {
                major_error = true;
                error_count++;
                console.log(error);
            }
            console.log('Found ' + num_meps + ' MEPs');
        });
    });
    // now we have a list of MEPs by country
    // we need to get the contact data for each MEP
    // and add it to the list
    var processed = 0;
    for (let country in members_by_country) {
        let meps = members_by_country[country];
        for (let i = 0; i < meps.length; i++) {
            let mep = meps[i];
            let mep_id = mep.id[0];
            let contact_data = await get_mep_contact_data(mep_id);
            if (contact_data) {
                mep.contact_data = contact_data;
                processed++;
                console.log('Processed ' + processed + '/' + num_meps + ' MEPs');
            } else {
                error_count++;
                console.log('Error processing MEP ' + mep_id);
            }
            await sleep(wait);
        }
    }
    if (major_error || processed != num_meps) {
        throw new Error('There were ' + error_count + ' errors.' + (major_error ? ' Major error.' : '') + processed + '/' + num_meps + ' MEPs processed.');
    }
    console.log('Saving data to ' + data_path + combined_source);
    let dest = fs.createWriteStream(data_path + combined_source);
    dest.write(JSON.stringify(members_by_country));
    dest.close();
}


async function main() {
    if (download) {
        console.log('Downloading data files.');
        await download_data_files();
        console.log('All downloads complete');
        if (combine) {

            await combine_data_files();
        }
    }
    else if (combine) {
        console.log('Combining data sources');
        await combine_data_files();
    }
    console.log('All done!');
}

main();
