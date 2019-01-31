import React, {Component} from 'react';
import classes from './DropButton.module.css';

class DropButton extends Component{

    render(){

        return (
            <div onClick={() => this.inputElement.click()}
                 className={classes.DropButton} 
                 onDrop={(ev) => {this.props.drop(ev, this.props.selectionType)}} 
                 onDragOver={this.props.dragOver}
                 onDragLeave={this.props.dragLeave}>
           
           <p className={classes.DropFile}><strong>SELECT/DROP FILE</strong></p>
            <p className={classes.DropFile}>{this.props.selectionType}</p>
            
            <input type="file" accept="textfile/*"
                ref={ input => this.inputElement = input} 
                onChange={(ev) => this.props.inputChange(ev, this.props.selectionType)}/>
            </div>
        );
    }
};

//const fileInput = document.getElementById("input-button");
//aTag.addEventListener("click", () => fileInput.click());

export default DropButton;