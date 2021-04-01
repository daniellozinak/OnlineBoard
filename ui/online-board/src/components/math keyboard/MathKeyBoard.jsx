import React,{Suspense} from 'react';
import './style.css';
import {Button,Modal,InputGroup,FormControl} from 'react-bootstrap';
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
            show: false,
            expression: '',
            label: '',
            buttons: [
                <MathButton id={"1"} data={"\\int_{ }^{ }"} className="math-button" display={"∫"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"2"} data={"\\sum_{ }^{ }"} className="math-button" display={"∑"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"3"} data={"\\log_{}"}      className="math-button" display={"log"} click_callback={this.buttonClick}delete_callback={this.delete}/>,
                <MathButton id={"4"} data={"\\lim_{x\\to }"}className="math-button" display={"lim"} click_callback={this.buttonClick}delete_callback={this.delete}/>,
                <MathButton id={"5"} data={"\\^{}"}         className="math-button" display={"^x"} click_callback={this.buttonClick} delete_callback={this.delete}/>,
                <MathButton id={"6"} data={"\\sqrt[]{}"}    className="math-button" display={"√"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"7"} data={"\\prod_{}^{}"}  className="math-button" display={"∏"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"8"} data={"\\cdot"}        className="math-button" display={"dot"} click_callback={this.buttonClick}delete_callback={this.delete}/>,
                <MathButton id={"9"} data={"\\pm"}          className="math-button" display={"±"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"10"} data={"\\frac{}{}"}   className="math-button" display={"x/y"} click_callback={this.buttonClick}delete_callback={this.delete}/>,
                <MathButton id={"11"} data={"\\infinity"}   className="math-button" display={"∞"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"12"} data={"\\pi"}         className="math-button" display={"π"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"13"} data={"\\neq"}        className="math-button" display={"≠"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"14"} data={"\\leq"}        className="math-button" display={"≤"} click_callback={this.buttonClick}  delete_callback={this.delete}/>,
                <MathButton id={"15"} data={"\\geq"}        className="math-button" display={"≥"} click_callback={this.buttonClick}  delete_callback={this.delete}/>
            ] 
        }
    }

    handleOpen(){
        this.setState({show:true});
    }

    handleClose(){
        this.setState({show:false});
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

    handleSubmit(){
        if(this.state.expression === '' || this.state.label === ''){ return;}
        
        let new_elemet = <MathButton id={Date.now()} 
        data={this.state.expression} 
        className="math-button"
        display={this.state.label} 
        click_callback={this.buttonClick}  
        delete_callback={this.delete}/>

        this.setState((state) =>({buttons: [...state.buttons,new_elemet]}));
        this.handleClose();
    }

    handleExpressionChange(e){
        this.setState({expression: e.target.value});
    }

    handleLabelChange(e){
        this.setState({label: e.target.value});
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
                <Button variant="success" onClick={this.handleOpen.bind(this)}>+</Button>
                <Modal show={this.state.show} 
                    onHide={this.handleClose.bind(this)}> 
                    <Modal.Header closeButton>Create your custom button!</Modal.Header>
                    <Modal.Body className="body">
                        <div>
                        Type an expression in 
                        <a href='https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols' target="_blank"> LaTeX </a>
                         and add a label on top of it !
                        </div>
                    
                        <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text className="input-text">Expression</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        onChange={this.handleExpressionChange.bind(this)}
                        placeholder="expression"
                        aria-label="expression"
                        aria-describedby="basic-addon1"
                        />
                        </InputGroup>

                        <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text className="input-text">Label</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl 
                        onChange={this.handleLabelChange.bind(this)}
                        placeholder="label"
                        aria-label="label"
                        aria-describedby="basic-addon1"
                        />
                        </InputGroup>

                        <Button 
                        onClick={this.handleSubmit.bind(this)}
                        className="confirm-button"
                        variant="secondary">Add</Button>

                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default MathKeyBoard;