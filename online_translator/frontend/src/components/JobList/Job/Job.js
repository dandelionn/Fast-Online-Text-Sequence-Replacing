import React, {Component} from 'react';
import classes from './Job.module.css';
import DropButton from '../../UI/DropButton/DropButton';
import Spinner from '../../UI/Spinner/Spinner';

class Job extends Component{
    //const spinner = <Spinner />;
    state = {
          text: null, 
          dictionary: null,  
          processing: false,
          jobFinished: false
    }

    dropHandler = (ev, selectionType) => {
        console.log('File(s) dropped');

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    
        /*if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    const file = ev.dataTransfer.items[i].getAsFile();
                    console.log('... file[' + i + '].name = ' + file.name);
                }
            }*/
        if (ev.dataTransfer.items) {
            if (ev.dataTransfer.items[0].kind === 'file') {
                const file = ev.dataTransfer.items[0].getAsFile();
                console.log(file);
                this.inputChangedHandler(file.name, selectionType);
            }
        }
        else {
            /*// Use DataTransfer interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
                console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
            }*/
            console.log(ev.dataTransfer.files[0].name);
            const file = ev.dataTransfer.files[0];
            this.inputChangedHandler(file.name, selectionType);
        }
    }
  
    dragOverHandler = (ev) => {
        console.log('File(s) in drop zone'); 
        //console.log(ev.target.tagName);
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    dragLeaveHandler = (ev) => {
        console.log("Drag leave!");
    }

    getFilename = (fullPath) => {
        if(fullPath === null)
            return null;
        
        return fullPath.replace(/^.*[\\/]/, '');
    }

    inputChangedHandler = (fullPath, selectionType) => {
        console.log(fullPath);
        if(selectionType === 'dictionary') { 
            this.setState({dictionary: this.getFilename(fullPath)});
        } else { 
            this.setState({text: this.getFilename(fullPath)});
        }
    }

    processInputHandler = () => {
        this.setState({processing: true});
    } 

    render(){
        let content = <>
                        <div><DropButton
                            dictionary={this.state.dictionary}
                            dragOver={this.dragOverHandler}
                            drop={this.dropHandler}
                            dragLeave={this.dragLeaveHandler}
                            inputChange={this.inputChangedHandler}
                            selectionType='dictionary' />
                        </div>
                        <div><DropButton 
                            text={this.state.text}
                            dragOver={this.dragOverHandler}
                            drop={this.dropHandler}
                            dragLeave={this.dragLeaveHandler}
                            inputChange={this.inputChangedHandler}
                            selectionType='text' />
                        </div>
                        <div><button onClick={this.processInputHandler} >Process File</button></div>
                      </>;
        if(this.state.processing === true){
            content = <><Spinner />
                        <p>Processing...</p>  
                      </>

        }
        if(this.state.jobFinished === true){
            content = <>
                        <button>Download </button>
                        <p>&nbsp; processed_{this.state.text}</p>
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
