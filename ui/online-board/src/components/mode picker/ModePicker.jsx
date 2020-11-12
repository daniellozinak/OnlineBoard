import React from 'react';
import './style.css';
import * as Constants from '../../util/constants.js';

class ModePicker extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            show: false,
        }
    }

    _onClick(mode)
    {
        this.props.data.change_mode_function(mode);
        this.setState({show:false})
    }

    render(){
        return(
            <div className="mode">
                <button className="button" onClick={()=>this.setState({show: !this.state.show})}>Mode</button>
                {this.state.show &&
                <div className="mode-panel-wrapper">
                    <div className="free-draw">
                        <button className="free-draw-buton" onClick={()=>this._onClick(Constants.MODE.FREE_DRAW)}>
                        FREE</button>
                    </div>
                    <div className="line">
                        <button className="line-buton" onClick={()=>this._onClick(Constants.MODE.LINE)}>
                        LINE</button>
                    </div>
                    <div className="circle">
                        <button className="circle-buton" onClick={()=>this._onClick(Constants.MODE.CIRCLE)}>
                        CIRCLE</button>
                    </div>
                    <div className="rect">
                        <button className="rect-buton" onClick={()=>this._onClick(Constants.MODE.RECTANGLE)}>
                        RECT</button>
                    </div>
                    <div className="math">
                        <button className="rect-buton" onClick={()=>this._onClick(Constants.MODE.MATH_FIELD)}>
                        MATH</button>
                    </div>
                
                </div>}
            </div>
        )
    }
}

export default ModePicker;