import React,{lazy,Suspense} from 'react';
import './style.css';
import * as Constants from "../../util/constants";
import { addStyles} from 'react-mathquill';

const MathKeyBoard = lazy(()=> {return import('../math keyboard/MathKeyBoard')});
const EditableMathField = lazy(()=> {return import('react-mathquill')})

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
      edit: function(mathField) {  },
      upOutOf: function(mathField) {  },
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

    add()
    {
        if(typeof this.state.current_latex === 'undefined') {return;}
        //let new_node = <img src={}/>
        let src = Constants.LATEX_TO_IMAGE + this.state.current_latex + Constants.MATH_COLOR;
        let new_element = <img src={src}/>;
        this.setState((state)=>({fields: [new_element,...state.fields]}));
        this.math_field.latex("");
    }

    clear()
    {
        this.math_field.latex("");
    }

    update(text)
    {
        this.math_field.latex(this.math_field.latex() + text);
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
            <div className="math-list">Math
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
                    {this.state.fields.map((field)=>
                    {
                        return <div className="math-container-item">{field}</div>
                    })}
                </div>
            </Suspense>
            </div>
        )
    }
}

export default MathList;