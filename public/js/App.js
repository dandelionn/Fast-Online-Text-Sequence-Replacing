//import axios from 'axios';

getFilename = (fullPath) => {
    if(fullPath === null)
        return null;
    
    return fullPath.replace(/^.*[\\/]/, '');
}


function download(){
    /*console.log('here');
    axios.get('./download')
            .then(response => {
                console.log("Downloaded.");
            })
            .catch(error => {
                console.log("Something went wrong with the download");
            });*/

    let element = document.getElementById('uploadId');
    console.log(element.value);

    window.open('./download/' + getFilename(element.value));
}

function AddNewItem(){
    let list = document.querySelector(".item-list");
}

function process() {
    let element = document.getElementById('uploadId');
    let dictionaryFilename = getFilename(element.value);
    let textFilename = getFilename(element.value);

    window.open('./process/' + dictionaryFilename +'/' + textFilename);
}