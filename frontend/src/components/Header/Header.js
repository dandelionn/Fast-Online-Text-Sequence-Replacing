import React, {Component} from 'react';
import Logo from '../Logo/Logo';
import classes from './Header.module.css';
import fileDownload from 'js-file-download';
import axios from 'axios';

let baseURL = "https://www.theusefulweb.tk/";
if(window.location.href.startsWith("https://www.theusefulweb.tk/"))
    baseURL = "https://www.theusefulweb.tk/";
else if(window.location.href.startsWith("https://theusefulweb.tk/"))
    baseURL = "https://theusefulweb.tk/";
else baseURL = "http://localhost:3000/";

class Header extends Component {
    downloadFileHandler = (name, oneMoreFile) => {
        axios.get(`${baseURL}download/example-files/${name}`)
                .then( (response) => {
                    console.log(response);
                    fileDownload(response.data, name);
                    if(oneMoreFile === true){
                        this.downloadFileHandler('dictionary-example.txt', false);
                    }
                })
                .catch(errors => {
                    console.log(errors);
                })
    }

    downloadExampleFilesHandler = () => {
        this.downloadFileHandler('text-example.txt', true);
    }
    
    render(){
        return (
            <div className={classes.Header}>
                <Logo />
                <div>
                    <button onClick={this.downloadExampleFilesHandler}>{this.props.language.downloadExampleFiles}</button>
                </div>
            </div>
        );
    }
};

export default Header;