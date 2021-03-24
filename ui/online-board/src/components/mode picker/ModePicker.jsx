import React from 'react';
import './style.css';
import * as Constants from '../../util/constants.js';
import {Button} from 'react-bootstrap';

import {ReactComponent as ModeLogo} from "../../assets/icons/draw.svg";
import {ReactComponent as FreeLogo} from "../../assets/icons/free.svg";
import {ReactComponent as LineLogo} from "../../assets/icons/line.svg";
import {ReactComponent as CircleLogo} from "../../assets/icons/circle.svg";
import {ReactComponent as RectLogo} from "../../assets/icons/rectangle.svg";

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
                <Button variant="dark"className="button" onClick={()=>this.setState({show: !this.state.show})}><ModeLogo/></Button>
                {this.state.show &&
                <div className="mode-panel-wrapper">
                    <div className="free-draw">
                        <Button variant="light" className="free-draw-buton" onClick={()=>this._onClick(Constants.MODE.FREE_DRAW)}>
                        <FreeLogo/></Button>
                    </div>
                    <div className="line">
                        <Button variant="light" className="line-buton" onClick={()=>this._onClick(Constants.MODE.LINE)}>
                        <LineLogo/></Button>
                    </div>
                    <div className="circle">
                        <Button variant="light" className="circle-buton" onClick={()=>this._onClick(Constants.MODE.CIRCLE)}>
                        <CircleLogo/></Button>
                    </div>
                    <div className="rect">
                        <Button variant="light" className="rect-buton" onClick={()=>this._onClick(Constants.MODE.RECTANGLE)}>
                        <RectLogo/></Button>
                    </div>
                </div>}
            </div>
        )
    }
}

export default ModePicker;