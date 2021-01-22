import React from 'react';
import './style.css';

class MathElement extends React.Component{


    onDragStart = (e,data) =>{
        let json_data = JSON.stringify(data);
        e.dataTransfer.setData("element",json_data);
    }

    render(){
        return(
            <div className="math-element" draggable onDragStart={(e) => this.onDragStart(e,this.props)}>
                <button className="delete-button" onClick={()=>{this.props.delete_callback(this.props.id)}}/>
                <img className="math-image" src={this.props.src}></img>
            </div>
        )
    }
}

export default MathElement;