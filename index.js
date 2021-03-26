const fs = require('fs');
const http = require('http');
const { default: slugify } = require('slugify');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
////////////////////////////////////////////////////////////////////////
// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');

const objData = JSON.parse(data.trim());
const slugs = objData.map(el => slugify(el.productName, {lower:true}));
console.log(slugs);
const server = http.createServer((req, res) => {
  // console.log(req.url);
  const {query,pathname} = url.parse(req.url,true); 
  //Overview page
  if(pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {'Content-type': 'text/html'});
    const cardsHtml = objData.map(el => replaceTemplate(tempCard,el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
    res.end(output);
  } 
  //Product page
  else if (pathname === '/product') {
    const product = objData[query.id];
    const output = replaceTemplate(tempProduct,product);
    res.end(output);
  } 
  //API
    else if (pathname === '/api') {
      res.writeHead(200, {'Content-type': 'application/json'});
      res.end(data);
    }
  // NOT FOUND
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});
 
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});