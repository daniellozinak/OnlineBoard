import React from 'react';
import './style.css';


var Direction = {
    LEFT : "Left",
    RIGHT: "Right",
    UP   : "Up",
    DOWN : "Down"
}

class MathKeyBoard extends React.Component{

    _onAddSign(sign){
        console.log(sign);
    }

    _onMove(dir)
    {
        console.log("move");
    }

    render()
    {
        return(
            <div className="math-keyboard">
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
        )
    }
}

export default MathKeyBoard;