import React from 'react';
import classes from  './TermsAndConditions.module.css';

const TermsAndConditions = (props) => {
        return (
            <div className={classes.TermsAndConditions} onClick = {props.clicked}>
                <p style={{fontSize:"20px"}}>{props.language.termsAndConditionsPage}</p>
                <p style={{fontSize:"15px"}}>{props.language.clickAnywhere}</p>
            </div>
        );
}

export default TermsAndConditions;