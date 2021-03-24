import React from 'react';
import './style.css';
import {Card} from 'react-bootstrap';

class MathElement extends React.Component{

    constructor(props){
        super(props);
        this.state={
            src: ''
        }

        this.state.src = this.props.src.replace('&color=black','&color=white');
    }


    onDragStart = (e,data) =>{
        let json_data = JSON.stringify(data);
        e.dataTransfer.setData("element",json_data);
    }

    render(){
        return(
            <Card bg="dark" className="math-element" draggable onDragStart={(e) => this.onDragStart(e,this.props)}>
                <button className="delete-button" onClick={()=>{this.props.delete_callback(this.props.id)}}/>
                <img className="math-image" src={this.state.src}></img>
            </Card>
        )
    }
}

export default MathElement; 