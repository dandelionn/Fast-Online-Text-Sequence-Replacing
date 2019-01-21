import React, {Component} from 'react';
import classes from './Job.module.css';
import DropButton from '../../UI/DropButton/DropButton';
import Spinner from '../../UI/Spinner/Spinner';
import axios from 'axios';
import fileDownload from 'js-file-download';

const baseURL = "https://www.theusefulweb.tk/";
//const baseURL = "http://localhost:3000/";

class Job extends Component{
    state = {
          dictionaryFile: null,  
          textFile: null,
          isProcessing: false,
          jobFinished: false,
          isTimeToProcess: false
    }

    shortenFilename = (filename) => {
        if (filename.length < 25){
            return filename;
        } else {
            const point = filename.lastIndexOf('.');
            if(point > 18){
                return filename.slice(0, 18) 
                        + '..'
                        + filename.slice(point, filename.length);
            }
        }
    }

    dropHandler = (ev, selectionType) => {
        console.log('File(s) dropped');

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    
        let file = null;
        if (ev.dataTransfer.items && (ev.dataTransfer.items[0].kind === 'file'))  {
                file = ev.dataTransfer.items[0].getAsFile();
        } else {
            file = ev.dataTransfer.files[0];
        }
        if( file.size === 0 )
            return;
        if(selectionType === 'dictionary') { 
            this.setState({dictionaryFile: file});
        } else { 
            this.setState({textFile: file});
        }
    }
  
    dragOverHandler = (ev) => {
        console.log('File(s) in drop zone'); 
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    dragLeaveHandler = (ev) => {
        console.log("Drag leave!");
    }

    downloadFileHandler = () => {
        axios.get(`${baseURL}download/${this.state.textFile.name}`)
                .then( (response) => {
                    fileDownload(response.data, `processed_${this.state.textFile.name}`);
                    console.log(response);
                })
                .catch(errors => {
                    console.log(errors);
                })
                .then( () => {
                    this.setState({jobFinished: false});
                });
    }

    processFileHandler = () => {
        console.log("IN PROCESS FILE");
        axios.get(`${baseURL}process/${this.state.dictionaryFile.name}/${this.state.textFile.name}`)
                    .then( response => {
                        console.log(response);
                        this.setState({jobFinished: true});
                    })
                    .catch(errors => {
                        console.log(errors);
                    })
                    .then( () => {
                        this.setState({isProcessing: false});
                     });
    }

    uploadDataHandler = (file) => {
        let data = new FormData();
        data.append('filename', file);

        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }

        axios.post(`${baseURL}upload`, data, config)
                .then( response => {
                        console.log(response);
                        if(this.state.isTimeToProcess === true) {
                            this.setState({isTimeToProcess: false});
                            this.processFileHandler();
                        } else {
                            this.setState({isTimeToProcess: true});
                        }
                    })
                .catch(errors => {
                        console.log(errors);
                });
    }

    processInputHandler = () => {
        this.setState({isProcessing: true});
        this.uploadDataHandler(this.state.dictionaryFile);
        this.uploadDataHandler(this.state.textFile);            
    } 

    inputChangedHandler = (ev, selectionType) => {
        let files = ev.target.files || ev.dataTransfer.files;
        if (!files.length) {
            console.log('no files');
        }
        console.log(files);
        console.log(files[0])

        if(files[0].size === 0)
            return;

        if(selectionType === 'dictionary') { 
            this.setState({dictionaryFile: files[0]});
        } else { 
            this.setState({textFile: files[0]});
        }
    }

    render(){
        let content = <>
                        <div><DropButton
                            dictionary={this.state.dictionaryFile ? this.shortenFilename(this.state.dictionaryFile.name) : null}
                            dragOver={this.dragOverHandler}
                            drop={this.dropHandler}
                            dragLeave={this.dragLeaveHandler}
                            selectionType='dictionary'
                            inputChange={this.inputChangedHandler}/>
                        </div>

                        <div><DropButton 
                            text={this.state.textFile ? this.shortenFilename(this.state.textFile.name) : null}
                            dragOver={this.dragOverHandler}
                            drop={this.dropHandler}
                            dragLeave={this.dragLeaveHandler}
                            selectionType='text'
                            inputChange={this.inputChangedHandler}/>
                        </div>

                        <div><button onClick={this.processInputHandler} >Process File</button></div>
                      </>;

        if(this.state.isProcessing === true){
            content = <><Spinner />
                        <p>Processing...</p>  
                      </>

        }

        if(this.state.jobFinished === true){
            content = <>
                        <p className={classes.ProcessedText}>&nbsp; processed_{this.shortenFilename(this.state.textFile.name)}</p>
                        <button onClick={this.downloadFileHandler}>Download </button>
                      </>
        }

        return (
                <li className={classes.Job}>
                  {content}
                </li>
        );
    }
}

export default Job;
