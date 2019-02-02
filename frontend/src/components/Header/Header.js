import React from 'react';
import Logo from '../Logo/Logo';

import classes from './Header.module.css';


const header = (props) => {
    return (
        <div className={classes.Header}>
            <Logo />
            <div>
                <button className="signIn">{props.language.signIn}</button>
                <button className="signUp">{props.language.signUp}</button>
            </div>
        </div>
    );
};

export default header;