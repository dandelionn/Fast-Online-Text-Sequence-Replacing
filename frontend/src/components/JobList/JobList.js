import React, { Component } from 'react';
import classes from './JobList.module.css';
import Job from './Job/Job';

class JobList extends Component{
    state = {
        count: 0,
        jobIds: [],
        hiddenControlButtons: [],
        failedJobs: []
    }

    addNewJob = (id) => {
        const insertPos = this.state.jobIds.indexOf(id);
        let ids = [...this.state.jobIds];
        ids.splice( insertPos + 1, 0, this.state.count);

        this.setState({jobIds: ids});
        this.setState({count: this.state.count + 1});
    }

    deleteJob = (id) => {
        if(this.state.jobIds.length === 1){
            this.setState({count: 0});
        }
        this.setState({jobIds: this.state.jobIds.filter(jobId => jobId !== id)});
        this.setState({hiddenControlButtons: this.state.hiddenControlButtons.filter(jobId => jobId !== id)});
        this.setState({failedJobs: this.state.failedJobs.filter(jobId => jobId !== id)});
    }

    hideJobControlButtons = (id) => {
        this.setState({hiddenControlButtons: [...this.state.hiddenControlButtons, id]})
    }

    markAsFailedJob = (id, message) => {
        this.setState({failedJobs: [...this.state.failedJobs, id]});
    }
    
    render(){
        let jobs = [];
        jobs = this.state.jobIds.map(jobId => {
            if(this.state.failedJobs.indexOf(jobId) === -1) {
                return (<div key = {jobId} className={classes.JobListItem}>
                    <div className={classes.ControlButtons} style={this.state.hiddenControlButtons.indexOf(jobId) !== -1 ? {display:'none'} : {}}>
                        <button className={classes.AddJob} onClick={() => this.addNewJob(jobId)}>+</button>
                        <button className={classes.RemoveJob} onClick={() => this.deleteJob(jobId)}>-</button>
                    </div>
                    <Job
                         updateProcessedFilesCount={this.props.updateProcessedFilesCount} 
                         language={this.props.language}
                         hideControlButtons={() => this.hideJobControlButtons(jobId)}
                         markAsFailedJob={(message) => this.markAsFailedJob(jobId, message)}
                         deleteJob={() => this.deleteJob(jobId)} />
                </div>);
            } else {
                console.log(jobId);
                return (<div key = {jobId} className={classes.JobListItem}>
                    <div className={classes.FailedJob}>
                        <p>{this.props.language.jobFailure}</p>
                        <button onClick={() => this.deleteJob(jobId)}>X</button>
                    </div>
                </div>);
            }
        });

        let buttonAdd;
        if(this.state.jobIds.length === 0)
        {
            jobs = false;
            buttonAdd = <button className={classes.Add} onClick={this.addNewJob}>+</button>        
        }

        return (
            <div className={classes.JobList}>
                {buttonAdd}
                <ul >
                    {jobs}
                </ul>
            </div>
        );
    }
}

export default JobList;






























/*import React, { Component } from 'react';
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

// className={classes.List}>
/*        return (
            <div className={classes.JobList}>
                <ul >
                    {jobs}
                    <button className={classes.Add} onClick={this.addNewJob}>+</button>
                </ul>
            </div>
        );
    }
}

export default JobList;*/