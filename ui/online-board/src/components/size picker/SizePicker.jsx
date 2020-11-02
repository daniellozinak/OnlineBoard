import React from 'react';
import Slider from '@material-ui/core/Slider';
import './style.css';

class SizePicker extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            value: 10,
            show: true,
        }
    }

    _onChange = (e,value) =>
    {
        this.setState({value: value});
        this.props.data.change_size_function(value);
    }

    render(){
        return(
            <div className="size">
                <button  className="button" onClick={() => this.setState({show: !this.state.show})}></button>
                {this.state.show &&
                    <Slider
                    className="slider"
                    defaultValue={10}
                    aria-labelledby="discrete-slider-always"
                    step={2}
                    valueLabelDisplay="on"
                    value={this.state.value}
                    onChange={this._onChange.bind(this)}
                    />}
            </div>
        )
    }
}

export default SizePicker;