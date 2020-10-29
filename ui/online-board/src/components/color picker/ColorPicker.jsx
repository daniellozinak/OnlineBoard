import React from 'react';
import {ChromePicker} from 'react-color';

class ColorPicker extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            color: "#000000",
            show: false,
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
                <button onClick={()=>this.setState({show: !this.state.show})}/>
                {this.state.show && (
                <ChromePicker 
                color={this.state.color}
                onChange={this._onChange.bind(this)}
                />)}
            </div>
        )
    }
}

export default ColorPicker;