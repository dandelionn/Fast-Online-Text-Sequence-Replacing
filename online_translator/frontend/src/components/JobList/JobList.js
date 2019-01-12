import React, { Component } from 'react';
import Job from './Job/Job';
import classes from './JobList.module.css';

class JobList extends Component{
    render(){   
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
                <Job />
                <button className={classes.Add}>add job</button>
            </ul>
            </div>
        );
    }
}

export default JobList;