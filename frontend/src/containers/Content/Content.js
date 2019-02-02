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
                <p className = {classes.title}>{this.props.language.title}</p>

                <JobList updateProcessedFilesCount={this.props.updateProcessedFilesCount}
                        language={this.props.language} />

                <p className ={classes.description}>{this.props.language.description}</p>
            </div>
        );
    }
}


export default Content;
