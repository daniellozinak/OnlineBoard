import React from 'react';
import './style.css';
import { addStyles, EditableMathField,MathField } from 'react-mathquill'

addStyles()

var Direction = {
    LEFT : "Left",
    RIGHT: "Right",
    UP   : "Up",
    DOWN : "Down"
}

class MathPicker extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            show: false,
        }

        this.math_field = null;
    }

    componentDidMount(){
    }

    _onClick = e =>{
        this.setState({show:!this.state.show});
    }

    _onChange = e =>{
        if(this.math_field == null)
        {
            this.math_field = e;
           this.math_field.latex("");
        }
        this.setState({text:e.latex()});
        //console.log(e);

        console.log(e.text());
    }

    _onAddSign(sign){
        if(this.math_field != null){
            this.math_field.write(sign);
        }
    }

    _onMove(dir)
    {
        this.math_field.keystroke(dir);
    }

    _onDispatchEvent =e =>{
        //console.log(e.target);
    }

    _locateElement = e =>{

    }

    //TODO : add style, more buttons
    render(){
        return(
            <div className="math">
                <button onClick={this._onClick.bind(this)} className="button">Math</button>
                {this.state.show &&
                    <div className="math-panel-wrapper">
                        <div className="math-panel-buttons">
                            <button onClick={()=>this._onAddSign("∫")}>∫</button>
                            <button onClick={()=>this._onAddSign("∑")}>∑</button>
                            <button onClick={()=>this._onMove(Direction.UP)}>up</button>
                            <button onClick={()=>this._onMove(Direction.DOWN)}>down</button>
                            <button onClick={()=>this._onMove(Direction.RIGHT)}>right</button>
                            <button onClick={()=>this._onMove(Direction.LEFT)}>left</button>
                        </div>
                        <div className="root-input-wrapper">
                        <EditableMathField
                            onChange={(mathField) => {
                                this._onChange(mathField)
                              }}
                            onClick={this._locateElement.bind(this)}
                        />
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default MathPicker;