import React, {Component} from 'react';
import classes from './DragAndDropButton.module.css';

class DragAndDropButton extends Component{
    render(){
        let selectionType = this.props.language.text;  
        if(this.props.selectionType === 'dictionary')
        {
            selectionType = this.props.language.dictionary;
        }

        return (
            <div onClick={() => this.inputElement.click()}
                 className={classes.DragAndDropButton} 
                 onDrop={(ev) => {this.props.drop(ev, this.props.selectionType)}} 
                 onDragOver={this.props.dragOver}
                 onDragLeave={this.props.dragLeave}>
           
           <p className={classes.DropFile}><strong>{this.props.language.selectDropFile}</strong></p>
            <p className={classes.DropFile}>{selectionType}</p>
            
            <input type="file" accept="textfile/*"
                ref={ input => this.inputElement = input} 
                onChange={(ev) => this.props.inputChange(ev, this.props.selectionType)}/>
            </div>
        );
    }
};

export default DragAndDropButton;