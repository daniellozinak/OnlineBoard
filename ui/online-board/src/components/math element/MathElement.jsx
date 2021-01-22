import React from 'react';
import './style.css';

class MathElement extends React.Component{


    onDragStart = (e,data) =>{
        e.dataTransfer.setData("src",data);
    }

    render(){
        return(
            <div className="math-element" draggable onDragStart={(e) => this.onDragStart(e,this.props.src)}>
                <button className="delete-button" onClick={()=>{this.props.delete_callback(this)}}/>
                <img className="math-image" src={this.props.src}></img>
            </div>
        )
    }
}

export default MathElement;