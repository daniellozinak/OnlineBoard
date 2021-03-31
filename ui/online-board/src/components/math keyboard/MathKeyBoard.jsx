import React,{Suspense} from 'react';
import './style.css';
import {Button} from 'react-bootstrap';
import MathButton from '../math button/MathButton';

var Direction = {
    LEFT : "Left",
    RIGHT: "Right",
    UP   : "Up",
    DOWN : "Down"
}

class MathKeyBoard extends React.Component{

    constructor(props){
        super(props);
        this.state={
            buttons: [
                <MathButton id={"1"} data={"\\int_{ }^{ }"} display={"∫"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"2"} data={"\\sum_{ }^{ }"} display={"∑"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"3"} data={"\\log_{}"}      display={"log"} click_callback={this.buttonClick}delete_callback={this.delete}/>,
                <MathButton id={"4"} data={"\\lim_{x\\to }"}display={"lim"} click_callback={this.buttonClick}delete_callback={this.delete}/>,
                <MathButton id={"5"} data={"\\^{}"}         display={"^x"} click_callback={this.buttonClick} delete_callback={this.delete}/>,
                <MathButton id={"6"} data={"\\sqrt[]{}"}    display={"√"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"7"} data={"\\prod_{}^{}"}  display={"∏"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"8"} data={"\\cdot"}        display={"dot"} click_callback={this.buttonClick}delete_callback={this.delete}/>,
                <MathButton id={"9"} data={"\\pm"}          display={"±"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"10"} data={"\\frac{}{}"}   display={"x/y"} click_callback={this.buttonClick}delete_callback={this.delete}/>,
                <MathButton id={"11"} data={"\\infinity"}   display={"∞"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"12"} data={"\\pi"}         display={"π"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"13"} data={"\\neq"}        display={"≠"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"14"} data={"\\leq"}        display={"≤"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"15"} data={"\\geq"}        display={"≥"} click_callback={this.buttonClick}  delete_callback={this.delete}/>
            ] 
        }
    }

    renderLoader = () => {
        return <p>Loading</p>
    }

    buttonClick = (message) =>{
        this.props.update(message);
    }

    delete = (key) =>{
        const filtered = this.state.buttons.filter(item => item.props.id !== key);
        this.setState({buttons: filtered});
    }

    render()
    {
        return(
            <div className="math-keyboard">
                {this.state.buttons.map((button,i)=>{
                    return <Suspense key={i} fallback={this.renderLoader()}>{button}</Suspense>
                })}
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