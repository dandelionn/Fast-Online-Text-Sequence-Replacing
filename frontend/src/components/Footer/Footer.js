import React from 'react';
import classes from './Footer.module.css';

const footer = () => {
    return (
        <div className={classes.Footer}>
            <div>
                <p><strong> &nbsp; 0 &nbsp; </strong></p>
                <p><strong> processed files so far </strong></p>
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