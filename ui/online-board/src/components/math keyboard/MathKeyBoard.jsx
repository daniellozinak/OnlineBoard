import React from 'react';
import './style.css';


var Direction = {
    LEFT : "Left",
    RIGHT: "Right",
    UP   : "Up",
    DOWN : "Down"
}

class MathKeyBoard extends React.Component{
    render()
    {
        return(
            <div className="math-keyboard">
                <button onClick={()=>this.props.update("\\int_{ }^{ }")}>∫</button>
                <button onClick={()=>this.props.update("\\sum_{ }^{ }")}>∑</button>
                <button onClick={()=>this.props.update("\\log_{}")}>Log</button>
                <button onClick={()=>this.props.update("\\lim_{x\\to }")}>Lim</button>
                <button onClick={()=>this.props.update("\\^{}")}>^x</button>
                <button onClick={()=>this.props.update("\\sqrt[]{}")}>sqrt</button>
                <button onClick={()=>this.props.update("\\prod_{}^{}")}>∏</button>
                <button onClick={()=>this.props.update("\\cdot")}>dot</button>
                <button onClick={()=>this.props.update("\\pm")}>±</button> 
                <button onClick={()=>this.props.update("\\frac{}{}")}>x/y</button> 
                <button onClick={()=>this.props.update("\\times")}>cross</button> 
                <button onClick={()=>this.props.update("\\infinity")}>∞</button> 
                <button onClick={()=>this.props.update("\\pi")}>pi</button> 
                <div className="math-panel-keyboard-control">
                    <button className="button-up" onClick={()=>this.props.move(Direction.UP)}>↑</button>
                    <button className="button-down" onClick={()=>this.props.move(Direction.DOWN)}>↓</button>
                    <button className="button-right" onClick={()=>this.props.move(Direction.RIGHT)}>→</button>
                    <button className="button-left" onClick={()=>this.props.move(Direction.LEFT)}>←</button>
                </div>
                <button onClick={()=>this.props.clear()}>clear</button>
                <button onClick={()=>this.props.addItem()}>add</button>
            </div>
        )
    }
}

export default MathKeyBoard;