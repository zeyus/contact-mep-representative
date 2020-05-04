const fs = require('fs');
const https = require('https');
const xml2js       = require('xml2js');
const parser       = new xml2js.Parser();

const data_path = './data/';
const source_base_uri = 'https://www.europarl.europa.eu/meps/en/';
const master_source = ['full-list/xml/', 'member-list.xml'];
const combined_source = 'members_by_country.json';
// var argv = require('minimist')(process.argv.slice(2));
const download = false;
const create_combined_source = true;
var alphasources = [];
var sources = [];

for(let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
    alphasources.push(['odp/detailed-list-xml/' + String.fromCharCode(i), String.fromCharCode(i) + '.xml']);
}

sources.push(master_source);
sources.push(...alphasources);


const master_file = './data/member-list.xml';

// console.log(fs.readFileSync('./data/a.xml', {encoding: 'utf-8'}));


// https://www.europarl.europa.eu/meps/en/full-list/xml/

// https://www.europarl.europa.eu/meps/en/odp/detailed-list-xml/c
function download_data_file(remote, local) {
    var dest = fs.createWriteStream(data_path + local);
    const request = https.get(source_base_uri + remote, function(response) {
      response.pipe(dest);
    });
}

if(download) {
    // Download
    sources.forEach(function(source){
        console.log('Downloading data file... ' + source[0] + ' to: ' + source[1])
        download_data_file(source[0], source[1]);
    });
}

if (create_combined_source) {
    var members_by_country = {};
    alphasources.forEach(function(source){
        let xml_string = fs.readFileSync(data_path + source[1], "utf8");
        parser.parseString(xml_string, function(error, result) {
            if(error === null) {
                if (result.meps.mep) {
                    result.meps.mep.forEach(function(member){
                        var country = member.country[0]._;
                        if (!members_by_country[country]){
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
    var dest = fs.createWriteStream(data_path + combined_source);
    dest.write(JSON.stringify(members_by_country));
    dest.close();
}

