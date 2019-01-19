import React from 'react';
import Logo from '../Logo/Logo';

import classes from './Header.module.css';

const header = () => {
    return (
        <div className={classes.Header}>
            <Logo />
            <div>
                <button className="signIn">Sign In</button>
                <button className="signUp">Sign Up</button>
            </div>
        </div>
    );
};

export default header;