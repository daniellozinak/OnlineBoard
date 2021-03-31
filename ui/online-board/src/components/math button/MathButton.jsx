import React from 'react';
import './style.css';
import {Button} from 'react-bootstrap';

import {ReactComponent as DeleteButtonLogo} from "../../assets/icons/delete_button.svg";

class MathButton extends React.Component{

    hideTimeout;

    constructor(props){
        super(props);
        this.state={
            show_delete: false
        }
    }

    _moveOver(e){
        this.setState({show_delete: true});
        clearTimeout(this.hideTimeout);
    }

    _moveOut(e){
        this.hideTimeout = setTimeout(()=>{
            this.setState({show_delete: false});
        },750);
    }



    render(){
        return(
            <div
            onMouseOver={this._moveOver.bind(this)}
            onMouseOut={this._moveOut.bind(this)} 
            className="math-button">
                { this.state.show_delete && <Button 
                variant='dark'
                className="delete-math-button" 
                onClick={()=>{this.props.delete_callback(this.props.id)}} >
                    <DeleteButtonLogo className="delete-math-button-logo"/></Button>}
                <Button 
                    variant='secondary'
                    onClick={()=>{this.props.click_callback(this.props.data)}}
                    className="send-math-button">{this.props.display}</Button>
            </div>
        )
    }
}

export default MathButton;