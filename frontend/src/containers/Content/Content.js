import React, {Component} from 'react';
import JobList from '../../components/JobList/JobList';
import classes from './Content.module.css';

class Content extends Component{
    state = {
        isProcessing: false
    }

    render(){

        return(
            <div className={classes.Content}>
                <p className = {classes.title}>Aho-Corasick Words Replacer</p>

                <JobList />

                <p className ={classes.description}>Choose a file and a dictionary. 
                    Hit the process button and the files will be uploaded and processed. 
                    After that a download button will appear. You have to provide non-empty files.</p>
            </div>
        );
    }
}


export default Content;