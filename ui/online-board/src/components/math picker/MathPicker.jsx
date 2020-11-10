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
        if(this.math_field == null || e.latex() === "undefined")
        {
            this.math_field = e;
            this.math_field.latex("");
            console.log("init");
            return;
        }
        //this.math_field.latex("");
        this.setState({text:e.latex()});
        this.math_field.focus();

        console.log("_onchange: " + e.latex());
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

    clear = e =>{
        this.math_field.latex("");
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
                        <div className="math-panel-keyboard">
                            <button onClick={()=>this._onAddSign("\\int_{ }^{ }")}>∫</button>
                            <button onClick={()=>this._onAddSign("\\sum_{ }^{ }")}>∑</button>
                            <button onClick={()=>this._onAddSign("\\log_{}")}>Log</button>
                            <button onClick={()=>this._onAddSign("\\lim_{x\\to }")}>Lim</button>
                            <button onClick={()=>this._onAddSign("\\^{}")}>^x</button>
                            <button onClick={()=>this._onAddSign("\\sqrt[]{}")}>sqrt</button>
                            <button onClick={()=>this._onAddSign("\\prod_{}^{}")}>∏</button>
                            <button onClick={()=>this._onAddSign("\\cdot")}>dot</button>
                            <button onClick={()=>this._onAddSign("\\pm")}>±</button> 
                            <button onClick={()=>this._onAddSign("\\frac{}{}")}>x/y</button> 
                            <button onClick={()=>this._onAddSign("\\times")}>cross</button> 
                            <button onClick={()=>this._onAddSign("\\infinity")}>∞</button> 
                            <button onClick={()=>this._onAddSign("\\infinity")}>pi</button> 
                            <div className="math-panel-keyboard-control">
                                <button className="button-up" onClick={()=>this._onMove(Direction.UP)}>↑</button>
                                <button className="button-down" onClick={()=>this._onMove(Direction.DOWN)}>↓</button>
                                <button className="button-right" onClick={()=>this._onMove(Direction.RIGHT)}>→</button>
                                <button className="button-left" onClick={()=>this._onMove(Direction.LEFT)}>←</button>
                            </div>
                            <button onClick={()=>this.clear()}>clear</button>
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