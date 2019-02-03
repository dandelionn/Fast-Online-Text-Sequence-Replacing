import React, {Component} from 'react';
import classes from './Footer.module.css';
//import Modal from '../UI/Modal/Modal';
/*<Modal showModal={this.state.showModal}  modalClosed={this.showModalHandler}></Modal>*/

class footer extends Component {
    /*state = {showModal: false}

    showModalHandler = () => {
        this.setState({showModal: !this.state.showModal});
    }*/

    render(){
        return (
            <div className={classes.Footer}>

                <div>
                    <p>&nbsp; {this.props.processedFilesCount} &nbsp; </p>
                    <p>{this.props.language.processedFilesSoFar}</p>
                </div>
            
                <p onClick = {this.showModalHandler}> {this.props.language.termsAndConditions} </p>
                <p> {this.props.language.copyright} </p>
                <select onChange = {(e) => this.props.changeLanguage(e)}>
                    <option value="english">English</option>
                    <option value="romanian">Română</option>
                </select>
            </div>
        );
    }
}

export default footer;