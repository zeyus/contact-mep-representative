# contact-mep-representative
Contact details for the Members of the European Parliament (MEPs) are painful to get from the official website, this helps

You can access a version here (updated with data from 2023-03-16):

https://www.zeyus.com/contact-mep-representative/

# Why?

I wanted to contact my European parliament representatives, and I noticed the website didn't make it easy and involved multiple clicks. Same with the data, it wasn't organised in a way to facilitate easily finding all the contact information for your country's representatives, so I wanted to make a very quick and dirty web based app to gather and consolidate the data and present it for easy access. That's all :)

# Usage

Either use the version available at: https://www.zeyus.com/contact-mep-representative/ or alternatively to use it locally:

- clone this repo
- `cd contact-mep-representative`
- `npm install`
- `node index.js`
- `npm install http-server -g`
- `http-server`
- visit in a browser: http://localhost:8080/

Optionally, the index.js script accepts the following arguements:
- `--no-download` - skips download step
- `--no-combine` - skip data source combination step
- `--wait=n` - where `n` is an integer for how many milliseconds to wait between downloading each file (default `300`) 

That's it, you'll see a list of countries, you can click on them and find your MEP representatives' contact details.
