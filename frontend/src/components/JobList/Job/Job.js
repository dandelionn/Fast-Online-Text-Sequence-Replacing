import React, {Component} from 'react';
import classes from './Job.module.css';
import DragAndDropButton from '../../UI/DragAndDropButton/DragAndDropButton';
import Spinner from '../../UI/Spinner/Spinner';
import axios from 'axios';
import fileDownload from 'js-file-download';

let baseURL = "https://www.theusefulweb.tk/";
if(window.location.href.startsWith("https://www.theusefulweb.tk/"))
    baseURL = "https://www.theusefulweb.tk/";
else if(window.location.href.startsWith("https://theusefulweb.tk/"))
    baseURL = "https://theusefulweb.tk/";
else baseURL = "http://localhost:3000/";

class Job extends Component{
    state = {
          dictionaryFile: null,  
          textFile: null,
          isProcessing: false,
          jobFinished: false,
          isTimeToUpload: false,
          isDownloading: false,
          isUploading: false
    }

    shortenFilename = (filename) => {
        if (filename.length < 18){
            return filename;
        } else {
            const point = filename.lastIndexOf('.');
            if(point > 11){
                return filename.slice(0, 11) 
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

    downloadFileHandler = () => {
        this.setState({isDownloading: true});
        axios.get(`${baseURL}download/processed_${this.state.textFile.name}`)
                .then( (response) => {
                    console.log(response);
                    fileDownload(response.data, `processed_${this.state.textFile.name}`);
                })
                .catch(errors => {
                    this.props.markAsFailedJob("Error! Download failed!");
                    console.log(errors);
                })
                .then( () => {
                    this.setState({jobFinished: false});
                    this.setState({isDownloading: false});
                    this.props.deleteJob();
                });
    }

    processFileHandler = () => {
        this.setState({isProcessing: true});
        console.log("IN PROCESS FILE");
        axios.get(`${baseURL}process/${this.state.dictionaryFile.name}/${this.state.textFile.name}`)
                    .then( response => {
                        console.log(response.data);
                        this.props.updateProcessedFilesCount(response.data.processedFilesCount);
                        this.setState({jobFinished: true});
                    })
                    .catch(errors => {
                        this.props.markAsFailedJob("Error! Processing failed!");
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
                        if(this.state.isTimeToUpload === true) {
                            this.setState({isTimeToUpload: false});
                            this.setState({isUploading: false});
                            this.processFileHandler();
                        } else {
                            this.setState({isTimeToUpload: true});
                        }
                    })
                .catch(errors => {
                        this.props.markAsFailedJob("Error! Uploading files failed!");
                        console.log(errors);
                });
    }

    processInputHandler = () => {
        if(this.state.dictionaryFile && this.state.textFile)
        {
            this.props.hideControlButtons();
            this.setState({isUploading: true});
            this.uploadDataHandler(this.state.dictionaryFile);
            this.uploadDataHandler(this.state.textFile);
        }            
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
        const dictionary = this.state.dictionaryFile ? this.shortenFilename(this.state.dictionaryFile.name) : null;
        const text = this.state.textFile ? this.shortenFilename(this.state.textFile.name) : null;

        let content = <>
                        <div className={classes.SelectionArea} ><DragAndDropButton
                            language={this.props.language}
                            dragOver={this.dragOverHandler}
                            drop={this.dropHandler}
                            dragLeave={this.dragLeaveHandler}
                            selectionType='dictionary'
                            inputChange={this.inputChangedHandler}/>
                            <p className={classes.Selected}>{dictionary}</p>
                        </div>

                        <div className={classes.SelectionArea}><DragAndDropButton 
                            language={this.props.language}
                            dragOver={this.dragOverHandler}
                            drop={this.dropHandler}
                            dragLeave={this.dragLeaveHandler}
                            selectionType='text'
                            inputChange={this.inputChangedHandler}/>
                            <p className={classes.Selected}>{text}</p>
                        </div>

                        <div><button onClick={this.processInputHandler}>{this.props.language.processFile}</button></div>
                      </>;

        if(this.state.isUploading === true){
            content = <><Spinner />
                        <p className={classes.SpinnerText}>{this.props.language.uploading}</p>  
                      </>;
        } else if(this.state.isProcessing === true){
            content = <><Spinner />
                        <p className={classes.SpinnerText}>{this.props.language.processing}</p>  
                      </>;
        } else if(this.state.isDownloading === true){
            content = <><Spinner />
                        <p className={classes.SpinnerText}>{this.props.language.downloading}</p>  
                      </>;
        } else if(this.state.jobFinished === true){
            content = <>
                        <p className={classes.ProcessedText}>&nbsp; processed_{this.shortenFilename(this.state.textFile.name)}</p>
                        <button onClick={this.downloadFileHandler}>{this.props.language.download}</button>
                      </>
        } 

        return (
                <div className={classes.Job}>
                  {content}
                </div>
        );
    }
}

export default Job;
