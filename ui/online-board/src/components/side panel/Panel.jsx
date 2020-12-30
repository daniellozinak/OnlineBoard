import React from 'react';
import './style.css';

import ColorPicker from '../color picker/ColorPicker';
import SizePicker from '../size picker/SizePicker';
import ModePicker from '../mode picker/ModePicker';
import MathPicker from '../math picker/MathPicker';

import * as Constants from '../../util/constants.js';

class Panel extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            show: true,
        }
    }

    change_color(color){this.props.color_callback.color_callback(color);}
    change_size(size){this.props.size_callback.size_callback(size);}
    change_mode(mode){this.props.mode_callback.mode_callback(mode);}
    set_pan(){this.props.mode_callback.mode_callback(Constants.MODE.PANNING);}
    set_select(){this.props.mode_callback.mode_callback(Constants.MODE.SELECT);}
    get_latex(src){this.props.latex_callback.latex_callback(src);}

    render(){
        return(
            <div>
                Side
                <div className="color-picker">
                        <ColorPicker data={{change_color_function: this.change_color.bind(this)}}/>
                    </div>
                    <div className="size-picker">
                        <SizePicker data={{change_size_function: this.change_size.bind(this)}}/>
                    </div>
                    <div className="mode-picker">
                        <ModePicker data={{change_mode_function: this.change_mode.bind(this)}}></ModePicker>
                    </div>
                    <div className="math-picker">
                        <MathPicker data={{change_field_function: this.get_latex.bind(this)}}></MathPicker>
                    </div>
                    <div className="panning">
                        <button onClick={this.set_pan.bind(this)}>Pan</button>
                    </div>
                    <div className="select">
                        <button onClick={this.set_select.bind(this)}>Slct</button>
                </div>
            </div>
        )
    }
}

export default Panel;