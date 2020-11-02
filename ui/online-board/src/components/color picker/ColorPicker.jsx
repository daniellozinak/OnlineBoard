import React from 'react';
import {TwitterPicker} from 'react-color';
import './style.css';

class ColorPicker extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            color: "#000000",
            show: true,
        }
    }

    _onChange = e =>{
        this.setState({color: e.hex});
        this.props.data.change_color_function(e.hex);
    }

    render()
    {
        return(
            <div className="color">
                <button className="button" onClick={()=>this.setState({show: !this.state.show})}></button>
                {this.state.show && (
                <TwitterPicker  className="picker"
                color={this.state.color}
                onChange={this._onChange.bind(this)}
                />)}
            </div>
        )
    }
}

export default ColorPicker;