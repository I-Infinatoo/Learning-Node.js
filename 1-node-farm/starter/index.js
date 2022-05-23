// this <require('fs')> will call the 'fs' --> file system module and create its object
// the object is stored in the 'fs' variable for the later use

const fs = require('fs');
const http = require('http');
const url = require('url');

// 
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////////////////////////////////////////////////
//  Files 

// Blocking, Synchronous way

// const textIn = fs.readFileSync("./txt/input.txt", 'utf-8');
// console.log(textIn);

// // ${<any js expression>}
// const textOut = `This is what we know about avacado: ${textIn}.\nCreated on ${Date.now()}`;

// // textOut will be written in the output file
// fs.writeFileSync('./txt/output.txt', textOut);

// console.log('File Written!');


// unblocking, asynchronous way

// this will start reading the file in the background 
// 3rd argument is the call back function in which :
//              err --> for error 
//              data --> will refer the content of the file 

// fs.readFile("./txt/start.txt", 'utf-8', (err, data) => {

//     if(err){ 
//         return console.log("Error!💥");
//     }

//     // data will contain the contents of the start.txt file
//     // then data is used to refer the another file
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
        
//         fs.readFile("./txt/append.txt", 'utf-8', (err, data3) => {
//             console.log(data3);
            
//             //will write the 2nd argument in the file with 3rd argument encoding  
//             fs.writeFile('./txt/final.txt', `${data2}\n\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written🙂');
//             });
//         });
//     });
// });

// // while the file reading was in the background this statement will get executed
// console.log('will read file!');




///////////////////////////////////////////////////////////////////////////
//  SERVER

// this sync function will allow the engine to parse the json file only once when the 
// program is started and parsing of the data to JSON is done after that

// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// const dataObject = JSON.parse(data);

// // createServer will accept a callBack function, will be called each time a new request hits the server
// const server = http.createServer((req, res)=>{
//     // send response back to the client
//     const reqPathName = req.url;
    // if(reqPathName === '/' || reqPathName === '/overview') {
    //     res.end("This is the OVERVIEW");
    // }
    // else if (reqPathName === '/product') {
    //     res.end("This is the PRODUCT");
    // }

    // else if(reqPathName == '/api') {
    //     res.writeHead(200, {
    //         'Content-type' : 'application/json'
    //     });

    //     // already parsed data will be sended as the response
    //     res.end(data);
    // }

    // else {

    //     res.writeHead(404, {
    //         'Content-type': 'text/html',
    //         'custom-response-header' : 'can be used for metadata'
    //     });
    //     res.end('<h1>Page not found!</h1>');
    // }
// });

// // start listening on port 8000 on local host 127.0.0.1
// server.listen(8000, '127.0.0.1', ()=>{
//     console.log("Listening to requests on port 8000");
// });


//----------------------------------------------------------------------------------------------------------------------//



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// it is an array which holds the data of json file 
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


// using slugify to camouflage the file link in the URL
const slugs = dataObj.map(ele => slugify(ele.productName, {lower: true}));
console.log(slugs);


const server = http.createServer((req, res) => {
    
    // const pathname = req.url;

    // console.log(req.url);
    // console.log(url.parse(req.url, true));

    const {query, pathname} = url.parse(req.url, true);
    

    // overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type' : 'text/html'});
        
        // loop dataObjects and replace all the placeholders in the tempCard with the 'el' element value
        // in the json file
        // '.join' will join all the elements in one string 
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');

        const output = tempOverview.replace('{%ProductCards%}', cardHtml);


        
        res.end(output);
    }

    // product page
    else if (pathname === '/product') {

        res.writeHead(200, { 'Content-type' : 'text/html' });

        // dataObj is an array, will fetch the value of id from the query 
        // and place it in the product variable
        const product = dataObj[query.id];
        // console.log(product);
        const output = replaceTemplate(tempProduct, product);
        res.end(output); 
     }

    // api
    else if(pathname == '/api') {
        res.writeHead(200, {'Content-type' : 'application/json'});
        res.end(data);
    }

    // not found
    else {

        res.writeHead(404, {
            'Content-type': 'text/html',
            'custom-response-header' : 'can be used for metadata'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', ()=>{
    console.log("Listining for requests on port 8000");
});