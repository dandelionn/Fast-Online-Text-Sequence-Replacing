import React from 'react';
import classes from './Footer.module.css';

const footer = () => {
    return (
        <div className={classes.Footer}>
            <div>
                <p>&nbsp; 0 &nbsp; </p>
                <p>processed files so far </p>
            </div>
         
            <p> Terms and Conditions </p>
            <p> &#x24B8; Copyright</p>
            <select>
                <option value="english">English</option>
                <option value="romanian">Romanian</option>
            </select>
        </div>
    );
}

export default footer;