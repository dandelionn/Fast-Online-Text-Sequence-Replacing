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

app.get('/download/example-files/:file(*)', (req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./example-files', file);
    console.log(fileLocation);
    res.download(fileLocation, file, (error) => {
        if(error){
            console.log(error);
        }
    });
});


app.get('/download/:file(*)', (req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./processed', file);
    console.log(fileLocation);
    res.download(fileLocation, file, (error) => {
        if(error){
            console.log(error);
        }
    });
});


const {ReplaceWords} = require('./build/Release/addon'); // native c++

let processedFilesCount = 0;


app.get("/processedFilesCount", (req, res) => {
    res.send(`{"processedFilesCount": ${processedFilesCount}}`);
});


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

        const cppProcessingTime = ReplaceWords(
                                        dictionaryFilePath, 
                                        textFilePath, 
                                        outputFilePath);

        ++ processedFilesCount;
        console.log(`Processing time :${cppProcessingTime}`);
        res.send(`{"processedFilesCount": ${processedFilesCount}, "cppProcessingTime": ${cppProcessingTime}}`);
    }
});
