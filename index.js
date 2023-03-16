'use strict';

const fs = require('fs');
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const data_path = './data/';
const source_base_uri = 'https://www.europarl.europa.eu/meps/en/';
const combined_source = 'members_by_country.json';
let argv = require('minimist')(process.argv.slice(2));

const download = !argv.hasOwnProperty('download') || argv.download != false;
const combine = !argv.hasOwnProperty('combine') || argv.combine != false;

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
                        ;
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

// Combine alphabetic contact lists into single JSON object.
function combine_data_files() {
    console.log('Combining data sources');
    var members_by_country = {};
    alphasources.forEach(function (source) {
        let xml_string = fs.readFileSync(data_path + source[1], "utf8");
        parser.parseString(xml_string, function (error, result) {
            if (error === null) {
                if (result.meps.mep) {
                    result.meps.mep.forEach(function (member) {
                        let country = member.country[0]._;
                        if (!members_by_country[country]) {
                            members_by_country[country] = [];
                        }
                        members_by_country[country].push(member);
                    });
                }
            }
            else {
                console.log(error);
            }
        });
    });
    console.log('Saving data to ' + data_path + combined_source)
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

            combine_data_files();
        }
    }
    else if (combine) {
        console.log('Combining data sources');
        combine_data_files();
    }
    console.log('All done!');
}

main();
