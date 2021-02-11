import React,{lazy,Suspense} from 'react';
import './style.css';
import * as Constants from '../../util/constants.js';
import {Card} from 'react-bootstrap';


const ColorPicker = lazy(()=> {return import('../color picker/ColorPicker')});
const SizePicker = lazy(()=> {return import('../size picker/SizePicker')});
const ModePicker = lazy(()=> {return import('../mode picker/ModePicker')});

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
    get_visibility(show){this.props.math_visible_callback.math_visible_callback(show);}

    renderLoader = () => {
        return <p>Loading</p>
    }

    render(){
        return(
            <Card bg="dark" text="white" style={{width: '5rem', height: '13rem'}} className="panel">
                Side Panel
                <Suspense fallback={this.renderLoader()}>
                <div className="color-picker">
                        <ColorPicker data={{change_color_function: this.change_color.bind(this)}}/>
                    </div>
                    <div className="size-picker">
                        <SizePicker data={{change_size_function: this.change_size.bind(this)}}/>
                    </div>
                    <div className="mode-picker">
                        <ModePicker data={{change_mode_function: this.change_mode.bind(this)}}/>
                    </div>
                    <div className="panning">
                        <button onClick={this.set_pan.bind(this)}>Pan</button>
                    </div>
                    <div className="select">
                        <button onClick={this.set_select.bind(this)}>Slct</button>
                </div>
                </Suspense>
            </Card>
        )
    }
}

export default Panel;

// render(){
//     return(
//         <div className="panel">
//             <Suspense fallback={this.renderLoader()}>
//             Side
//             <div className="color-picker">
//                     <ColorPicker data={{change_color_function: this.change_color.bind(this)}}/>
//                 </div>
//                 <div className="size-picker">
//                     <SizePicker data={{change_size_function: this.change_size.bind(this)}}/>
//                 </div>
//                 <div className="mode-picker">
//                     <ModePicker data={{change_mode_function: this.change_mode.bind(this)}}/>
//                 </div>
//                 <div className="panning">
//                     <button onClick={this.set_pan.bind(this)}>Pan</button>
//                 </div>
//                 <div className="select">
//                     <button onClick={this.set_select.bind(this)}>Slct</button>
//             </div>
//             </Suspense>
//         </div>
//     )
// }