# contact-mep-representative
Contact details for the Members of the European Parliament (MEPs) are painful to get from the official website, this helps

You can access a version here (updated monthly on the 17th day of the month):

https://www.zeyus.com/contact-mep-representative/

# Why?

I wanted to contact my European parliament representatives, and I noticed the website didn't make it easy and involved multiple clicks. Same with the data, it wasn't organised in a way to facilitate easily finding all the contact information for your country's representatives, so I wanted to make a very quick and dirty web based app to gather and consolidate the data and present it for easy access. That's all :)

## Important note

This is a fragile way to collect this information. It relies on document parsing based on the website structure. Of course if any changes are made to the site, this code might break, as it did today (2026-02-23), but thanksfully the wheels of government turn slowly so this shouldn't happen too often. If you want to help, or you notice any problems, please open an issue or a pull request.

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

# License

This code is licenced under the [MIT licence](https://github.com/zeyus/contact-mep-representative/blob/master/LICENSE).

## Flag Icons

by lipis
[Flag Icons / Flag Icons CSS](https://github.com/lipis/flag-icons) by [lipis](https://github.com/lipis) are licenced under the [MIT licence](https://github.com/lipis/flag-icons/blob/main/LICENSE):

```text
The MIT License (MIT)

Copyright (c) 2013 Panayiotis Lipiridis

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Bootstrap

[Bootstrap](https://github.com/twbs/bootstrap/tree/main) / [Bootstrap Icons](https://github.com/twbs/icons) are licenced under the [MIT licence](https://github.com/twbs/bootstrap/blob/main/LICENSE)

```text
The MIT License (MIT)

Copyright (c) 2019-2024 The Bootstrap Authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
