import React from 'react';
import './style.css';

class MathElement extends React.Component{

    render(){
        return(
            <div className="math-element">
                <button className="delete-button" onClick={()=>{this.props.delete_callback(this)}}/>
                <img src={this.props.src}></img>
            </div>
        )
    }
}

export default MathElement;