var cors = require('cors');
const path = require('path');

var express = require("express"),
    app = express(),
    http = require("http").Server(app).listen(3000);
    upload = require("express-fileupload");
    app.use(upload());
app.use(express.static(path.join(__dirname, '..', '/frontend/build')));

console.log("Server Started!");

app.get("/", function(req, res){
    console.log(path.join(__dirname, '..', '/frontend/build/index.html'));

    res.sendFile(path.join(__dirname, '..', '/frontend/build/index.html'));
});

app.post("/upload", function(req, res) {
    console.log("In upload");
    if(req.files){
        dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        console.log(req.files)

        let file = req.files.filename;
        let filename =  file.name;
        
        file.mv("./uploads/" + filename, function(err){
            if(err){
                console.log(err);
                res.send("upload error occurred!");
            }
            else {
                res.send("Done uploading file!");
            }
        })
    }
});


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
    console.log("In process");
    if(req.params.dictionaryFile && req.params.textFile){

        dir = './processed';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

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
