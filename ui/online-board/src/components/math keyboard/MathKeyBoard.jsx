import React from 'react';
import './style.css';
import {Button} from 'react-bootstrap';

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
                <Button variant="secondary"onClick={()=>this.props.update("\\int_{ }^{ }")}>∫</Button>
                <Button variant="secondary"onClick={()=>this.props.update("\\sum_{ }^{ }")}>∑</Button>
                <Button variant="secondary"onClick={()=>this.props.update("\\log_{}")}>log</Button>
                <Button variant="secondary"onClick={()=>this.props.update("\\lim_{x\\to }")}>lim</Button>
                <Button variant="secondary"onClick={()=>this.props.update("\\^{}")}>^x</Button>
                <Button variant="secondary"onClick={()=>this.props.update("\\sqrt[]{}")}>√</Button>
                <Button variant="secondary"onClick={()=>this.props.update("\\prod_{}^{}")}>∏</Button>
                <Button variant="secondary"onClick={()=>this.props.update("\\cdot")}>dot</Button>
                <Button variant="secondary"onClick={()=>this.props.update("\\pm")}>±</Button> 
                <Button variant="secondary"onClick={()=>this.props.update("\\frac{}{}")}>x/y</Button> 
                <Button variant="secondary"onClick={()=>this.props.update("\\infinity")}>∞</Button> 
                <Button variant="secondary"onClick={()=>this.props.update("\\pi")}>π</Button> 
                <Button variant="secondary"onClick={()=>this.props.update("\\neq")}>≠</Button> 
                <Button variant="secondary"onClick={()=>this.props.update("\\leq")}>≤</Button> 
                <Button variant="secondary"onClick={()=>this.props.update("\\geq")}>≥</Button> 
                <div className="math-panel-keyboard-control">
                    <Button variant="secondary"className="button-left" onClick={()=>this.props.move(Direction.LEFT)}>←</Button>
                    <Button variant="secondary"className="button-up" onClick={()=>this.props.move(Direction.UP)}>↑</Button>
                    <Button variant="secondary"className="button-right" onClick={()=>this.props.move(Direction.RIGHT)}>→</Button>
                    <Button variant="secondary"className="button-down" onClick={()=>this.props.move(Direction.DOWN)}>↓</Button>
                </div>
                <div className="math-panel-manipulate">
                    <Button variant="danger" className="button-clear" onClick={()=>this.props.clear()}>clear</Button>
                    <Button variant="success" className="button-add" onClick={()=>this.props.addItem()}>add</Button>
                </div>
            </div>
        )
    }
}

export default MathKeyBoard;