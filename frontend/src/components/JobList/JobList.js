import React, { Component } from 'react';
import Job from './Job/Job';
import classes from './JobList.module.css';

class JobList extends Component{

    state = {
        jobsCount: 1
    }

    addNewJob = () => {
        this.setState({jobsCount: this.state.jobsCount + 1});
    }
    
    render(){
        let jobs = [];
        for(let i=0; i < this.state.jobsCount; ++i){
            jobs.push(<Job key = {i}/>);
        }

        /*const jobs = this.state.jobs.map((job, index) => {
            return <Job 
                file={job.file}
                dictionary={job.dictionary}
                key={index}
                dragOver={this.dragOverHandler }
                drop={this.dropHandler} />
        });*/


        return (
            <div className={classes.JobList}>
            <ul >
                {jobs}
                <button className={classes.Add} onClick={this.addNewJob}>add job</button>
            </ul>
            </div>
        );
    }
}

export default JobList;