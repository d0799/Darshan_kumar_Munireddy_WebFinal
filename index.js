const http =require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res)=>{

    console.log(req.url);
    // / or /api /about.html
     
    if( req.url ==='/'){
     
        fs.readFile(path.join(__dirname,'public','index.html'),
        (err, content)=>{

            if (err) throw err;
            res.writeHead(200,{ 'Content-type': 'text/html'});
            res.end(content);

        });


    }
    else if(req.url ==='/about.html'){

       
        fs.readFile(path.join(__dirname,'public','about.html'),
        (err, content)=>{
            if(err ) throw err;
            res.writeHead(200, { 'Content-type': 'text/html'})
            res.end(content)
        })
    }

        else if (req.url.startsWith('/Images/')) {
            const imagePath = path.join(__dirname, 'public', req.url);
            const imageStream = fs.createReadStream(imagePath);
    
            res.setHeader("Access-Control-Allow-Origin", "*");
    
            
            if (req.url.match(/.*\.jpg$/i)) {
              res.writeHead(200, { 'Content-Type': 'image/jpg' });
            } else if (req.url.match(/.*\.webp$/i)) {
              res.writeHead(200, { 'Content-Type': 'image/webp' });
            } else if (req.url.match(/.*\.png$/i)) {
              res.writeHead(200, { 'Content-Type': 'image/png' });
            } else if (req.url.match(/.*\.svg$/i)) {
              res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
            }
          
            imageStream.pipe(res);
          
            imageStream.on('error', () => {
              res.writeHead(404, { 'Content-type': 'text/html' });
              res.end("<h1> 404 Not Found </h1>");
            });
          }  
        else if (req.url === '/style.css') { // add this else if statement to serve style.css
            fs.readFile(path.join(__dirname, 'public', 'style.css'), (err, content) => {
                if (err) throw err;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(200, { 'Content-type': 'text/css' });
                res.end(content);
            });}

    

    else if(req.url ==='/api'){

        var input;
    
            //import { MongoClient } from 'mongodb';
            const { MongoClient } = require('mongodb');
    
            main(processData);
            async function main(callback) {
    
                const uri = "mongodb+srv://teja:webdatabase@flightcluster.b1toamz.mongodb.net/?retryWrites=true&w=majority";
                //const client = new MongoClient(uri, { useUnifiedTopology: true });
                //const client = new MongoClient(uri);
                const client = new MongoClient(uri, {useUnifiedTopology:true
                  });
    
                //Use a try-catch block to connect to the MongoDB Atlas cluster:
                try {
                    //Import the MongoClient class from the mongodb package:
    
    
                    // Connect to MongoDB Atlas cluster
                    await client.connect();
                    console.log('Connected to MongoDB Atlas cluster');
    
                    const Flight = client.db('flightdetails').collection('flightnames');
    
                    //const projection = {_id}; // exclude _id field
    
                    const collectionData = {
    
                        
                        FlightDetails: await Flight.find().toArray()
                    };
                    //const cars = await carCollection.find().toArray();
                    console.log(collectionData);
    
    
                    input = collectionData;
                    console.log('input data');
                    console.log(input);
                    // Call the callback function with the data as a parameter
                    callback(input);
    
                } catch (err) {
                    console.error(err);
                } finally {
                    // This Closes the MongoDB Atlas cluster connection
                    await client.close();
                    console.log('Disconnected from MongoDB Atlas cluster');
                }
    
            }
    
            function processData(data) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                    res.writeHead(200, { 'Content-type': 'application/json' })
                    res.end(JSON.stringify(data));
            }
    
            //code ends here
    
        }


    
    else{
        res.writeHead(404, { 'Content-type': 'text/html'})  
        res.end("<h1> 404 Nothing is Here </h1>")
    }

  

   

});

server.listen(5501, ()=> console.log(" great our server is runnning"));
