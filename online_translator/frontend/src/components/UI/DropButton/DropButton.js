import React, {Component} from 'react';
import classes from './DropButton.module.css';

class DropButton extends Component{

    render(){
        let selected = null;
    
        if(this.props.selectionType === 'text' && this.props.text != null){
            selected =  <p className={classes.Selected}>Selected: &nbsp; {this.props.text} </p>;
        }

        if(this.props.selectionType === 'dictionary' && this.props.dictionary != null){
            selected =  <p className={classes.Selected}>Selected: &nbsp; {this.props.dictionary} </p>;
        }

        let text = 'Browse File';
        if(this.props.selectionType === 'dictionary'){
            text = 'Browse Dictionary File';
        }

        return (
            <div onClick={() => this.inputElement.click()}
                 className={classes.DropButton} 
                 onDrop={(ev) => {this.props.drop(ev, this.props.selectionType)}} 
                 onDragOver={this.props.dragOver}
                 onDragLeave={this.props.dragLeave}>
           
            <p className={classes.ChooseFile}>{text}</p>
            <p className={classes.DropFile}><strong>DROP FILE HERE</strong></p>
             {selected}
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