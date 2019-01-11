import React from 'react';

import appLogo from '../../assets/images/logo-black-paper-transparent.png';
import classes from './Logo.module.css';

const logo = () => (
    <div className={classes.Logo}>
        <img src={appLogo} alt= "myLogo" />
    </div>
)

export default logo;