var cors = require('cors');

var express = require("express"),
    app = express(),
    http = require("http").Server(app).listen(3000);
    upload = require("express-fileupload");

    app.use(upload());
app.use(express.static('../frontend/build'));

console.log("Server Started!");
app.get("/", function(req, res){
    //console.log(__dirname + "/index.html");

    res.sendFile(__dirname + "/index.html");
});

app.post("/upload", function(req, res) {
    if(req.files){

        console.log(req.files)

        let file = req.files.filename;
        let filename =  file.name;
        
        file.mv("./uploads/" + filename, function(err){
            if(err){
                console.log(err);
                res.send("upload error occurred!");
            }
            else {
                res.send("Done!");
            }
        })
    }
});


const path = require('path');
//define a route to donwload a file
app.get('/download/:file(*)', (req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./uploads', file);
    console.log(fileLocation);
    res.download(fileLocation, file, (error) => {
        if(error){
            console.log(error);
        }
    });
    /*, function(err){
        
            res.send("download error occuped");
        }
        else {
            res.send("Done!");
        }
    });*/
});


const {TranslateFile} = require('./build/Release/addon'); // native c++

var fs = require('fs');
app.get("/process/:dictionaryFile/:textFile", function(req, res) {
        
    if(req.params.dictionaryFile && req.params.textFile){
        const dictionaryFilePath = path.join('./uploads', req.params.dictionaryFile);
        const textFilePath = path.join('./uploads', req.params.textFile);
        const outputFilePath = path.join('./processed', 'processed_' + req.params.textFile);

        const start = Date.now();

        const result = `Returned value: ${
                    TranslateFile(
                                dictionaryFilePath, 
                                textFilePath, 
                                outputFilePath)
                    }`;

        const end = Date.now();
        const cppProcessingTime = end - start; // time in milliseconds

        var difference = new Date(cppProcessingTime);
        //If you really want the hours/minutes, 
        //Date has functions for that too:
        var diff_hours = difference.getHours();
        var diff_mins = difference.getMinutes();
        var diff_seconds = difference.getSeconds();
        console.log(`Processing time :{cppProcessingTime}`);
        res.send(`Time: ${cppProcessingTime} miliseconds! \n${result}`);
    }
});


/**
 * in console type: npm run compile --python=python2.7;
 * node index.js
 *  
 * */
