var express = require("express"),
    app = express(),
    http = require("http").Server(app).listen(80);
    upload = require("express-fileupload");
app.use(upload());

console.log("Server Started!");
app.get("/", function(req, res){
    //console.log(__dirname + "/index.html");
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    if(req.files){
        let file = req.files.filename;
        let filename =  file.name;
        
        file.mv("./upload/" + filename, function(err){
            if(err){
                console.log(err);
                res.send("upload error occuped");
            }
            else {
                res.send("Done!");
            }
        })
    }
});

app.get('/download', function(req, res){
    res.download(__dirname + '/upload/file.txt', 'file.txt', function(err){
        if(err){
            console.log(err);
            res.send("download error occuped");
        }
        else {
            res.send("Done!");
        }
    });
});