import React from 'react';
import classes from './Footer.module.css';


const footer = (props) => {
    return (
        <div className={classes.Footer}>
            <div>
                <p>&nbsp; {props.processedFilesCount} &nbsp; </p>
                <p>{props.language.processedFilesSoFar}</p>
            </div>
        
            <p> {props.language.termsAndConditions} </p>
            <p> {props.language.copyright} </p>
            <select onChange = {(e) => props.changeLanguage(e)}>
                <option value="english">English</option>
                <option value="romanian">Română</option>
            </select>
        </div>
    );
}

export default footer;