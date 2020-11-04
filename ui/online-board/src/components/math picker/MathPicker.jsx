import React from 'react';
import './style.css';
import TextField from "input-material-ui";
import { addStyles, EditableMathField } from 'react-mathquill'

addStyles()

class MathPicker extends React.Component{
    constructor(props)
    {
        super(props)
        {
            this.state={
                show: false,
                text:"\log_{ }",
            }
        }
    }

    _onClick = e =>{
        this.setState({show:!this.state.show});
    }

    _onChange = e =>{
        this.setState({text:e});
        console.log(e);
    }


    _onAddSign(sign){

        this.setState({text: this.state.text + sign});
    }

    _locateElement = e =>{
        console.log(e);
    }

    render(){
        return(
            <div className="math">
                <button onClick={this._onClick.bind(this)} className="button">Math</button>
                {this.state.show &&
                    <div className="math-panel-wrapper">
                        <div classNam="math-panel-buttons">
                            <button onClick={()=>this._onAddSign("∫")}>∫</button>
                            <button onClick={()=>this._onAddSign("∑")}>∑</button>
                        </div>
                        <div className="root-input-wrapper">
                        <EditableMathField
                            latex={this.state.text}
                            onChange={(mathField) => {
                                this._onChange(mathField.latex())
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