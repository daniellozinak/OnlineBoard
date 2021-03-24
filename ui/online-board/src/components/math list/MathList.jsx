import React,{lazy,Suspense} from 'react';
import './style.css';
import * as Constants from "../../util/constants";
import { addStyles} from 'react-mathquill';

import {Card} from 'react-bootstrap';

const MathKeyBoard = lazy(()=> {return import('../math keyboard/MathKeyBoard')});
const EditableMathField = lazy(()=> {return import('react-mathquill')})
const MathElement = lazy(()=>{return import('../math element/MathElement')});

addStyles();

var config = {
    spaceBehavesLikeTab: true,
    leftRightIntoCmdGoes: 'up',
    restrictMismatchedBrackets: true,
    sumStartsWithNEquals: true,
    supSubsRequireOperand: true,
    charsThatBreakOutOfSupSub: '+-=<>',
    autoSubscriptNumerals: true,
    autoCommands: 'pi theta sqrt sum',
    autoOperatorNames: 'sin cos',
    maxDepth: 10,
    substituteTextarea: function() {
      return document.createElement('textarea');
    },
    handlers: {
      edit: function(mathField) {},
      upOutOf: function(mathField) {},
    }
};

class MathList extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            show:true,
            current_latex: '',
            fields: []
        }

        this.math_field = null;
    }

    renderLoader = () => {
        return <p>Loading</p>
    }

    _onChange = e => {
        if(e === undefined){return;}
        if(this.math_field == null || e.latex() === "undefined")
        {
            this.math_field = e;
            this.math_field.latex("");
            return;
        }
        this.setState({current_latex:e.latex()});
        this.math_field.focus();
    }

    delete(element)
    {
        if(typeof this.state.fields === 'undefined') {return;}
        let key = element;
        const filtered = this.state.fields.filter(item => item.props.id !== key);
        this.setState({fields: filtered});
    }

    add()
    {
        if(typeof this.state.current_latex === 'undefined') {return;}
        if(this.state.current_latex === '') {return ;}

        let new_key = Date.now();

        let src = Constants.LATEX_TO_IMAGE + this.state.current_latex + Constants.MATH_COLOR;
        let new_element = <MathElement  id={new_key} src={src} delete_callback={this.delete.bind(this)}/>

        this.setState((state)=>({fields: [new_element,...state.fields]}));
        this.math_field.latex("");
    }

    clear()
    {
        this.math_field.latex("");
    }

    update(text)
    {
        this.math_field.write(text);
        this.setState({current_latex: this.math_field.latex()});
    }

    move(direction)
    {
        this.math_field.keystroke(direction);
        this.math_field.focus();
    }

    render()
    {
        return(
            <Card bg="dark" className="math-list"> Math Keyboard
            <Suspense fallback={this.renderLoader()}>
                <MathKeyBoard className="keyboard"
                    addItem={this.add.bind(this)}
                    clear={this.clear.bind(this)}
                    update={this.update.bind(this)}
                    move={this.move.bind(this)}
                />
                <EditableMathField className="math-field"
                        onChange={(mathField) => {
                            this._onChange(mathField)
                        }}
                        config={config}
                />
                <div className="list">
                    {this.state.fields.map((field,i)=>
                    {
                        return <Suspense key={i} fallback={this.renderLoader()}style={{marginHorizontal: 30}}>{field}</Suspense>
                    })}
                </div>
            </Suspense>
            </Card>
        )
    }
}

export default MathList;