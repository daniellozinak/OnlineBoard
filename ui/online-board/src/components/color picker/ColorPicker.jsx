import React from 'react';
import {TwitterPicker} from 'react-color';
import './style.css';
import {Button} from 'react-bootstrap';

import {ReactComponent as ColorLogo} from "../../assets/icons/color.svg";

class ColorPicker extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            color: "#ABB8C3",
            show: false,
        }
    }

    _onChange = e =>{
        this.setState({color: e.hex});
        this.setState({show:false});
        this.props.data.change_color_function(e.hex);
    }

    render()
    {
        return(
            <div className="color">
                <Button variant="dark" className="button" onClick={()=>this.setState((state)=>({show: !state.show}))}><ColorLogo/></Button>
                {this.state.show && (
                <TwitterPicker
                className="picker"
                color={this.state.color}
                onChange={this._onChange.bind(this)}
                />)}
            </div>
        )
    }
}

export default ColorPicker;