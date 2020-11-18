const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring= require('querystring');
require('env')('./config.env');


const port = process.env.PORT || 3000;

const router = (request, response) => {
    const method = request.method;
    const endpoint = request.url;
    console.log('endpoint', endpoint);
    
 const extensionType = {
            'css' : 'text/css',
            'js' : 'text/javascript',
            'jpg' : 'image/jpeg',
            'png': 'image/png'
            
        }
    if (endpoint === '/'){
       const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (error, file) =>{
            if(error){
                response.writeHead(500, {'Content-Type' : 'text/html'});
                response.end('<h1> error with server </h1>')
            } else {
                response.writeHead(200, {'Content-Type' : 'text/html'});
                response.end(file);
            }

        })
    } else if(endpoint.includes('public')){
        const filePath = path.join(__dirname, endpoint);
        console.log('path',filePath);
        const extension = endpoint.split('.')[1];
        console.log(extension);
       
        fs.readFile( filePath, (error, file) => {
            if (error){
                response.writeHead(500, {'Content-Type' : 'text/html'});
                response.end('<h1> error with public </h1>')
            } else {
                response.writeHead(200, {'Content-Type' : extensionType[extension]});
                console.log(extensionType[extension]);
                response.end(file);
            }
             
        })
       
    }
    
    else if (endpoint === '/node'){
        console.log(__dirname);
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('<h1>in /node page </h1>');
        response.end();
    } else if(endpoint === '/girls'){
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('<h1>in /girls page </h1>');
        response.end();
   
    
    } else if(endpoint==="/create-post" && method ==='POST'){
          let allTheData="";
          const filePath = path.join(__dirname, endpoint);
    request.on('data', chunkOfData =>{
        allTheData += chunkOfData;
    })

    request.on('end', () =>{
       
        const convertedData = querystring.parse(allTheData);
        console.log( "data",convertedData.blog);

        const filePath = path.join(__dirname, 'src','posts.json');
        fs.readFile(filePath,"utf8", (error, file) =>{
            if(error){
                response.writeHead(500, {'Content-Type' : 'text/html'});
                response.end('<h1> error with server </h1>')
            } else {
               console.log(file);
               const newData= JSON.parse(file);
               newData[Date.now()] = convertedData.blog;
               fs.writeFile(filePath, JSON.stringify(newData), (error)=>{
                   if (error){
                       console.log('error post');
                   }
              response.writeHead(302, {"Location": '/'});
        response.end();
               
               })  
            }

        })
        
    });
    }

    else if (endpoint=== '/posts'){
        const filePath = path.join(__dirname, 'src','posts.json');
       
        fs.readFile(filePath,"utf8", (error, file) =>{
            if(error){
                response.writeHead(500, {'Content-Type' : 'text/html'});
                response.end('<h1> error with server </h1>')
            } else {
                response.writeHead(200, {'Content-Type' : 'application/json'});
                console.log(file);
                response.end(file);
                
            }

        })
    }
    
    else{
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('page not found');
        response.end();
    } 
    

  
    
};
const server = http.createServer(router);



server.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});







