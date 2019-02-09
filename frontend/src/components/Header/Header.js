import React from 'react';
import Logo from '../Logo/Logo';
import classes from './Header.module.css';


const header = (props) => {
    return (
        <div className={classes.Header}>
            <Logo />
        </div>
    );
};

export default header;