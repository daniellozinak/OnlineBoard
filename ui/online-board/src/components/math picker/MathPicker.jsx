import React,{lazy,Suspense} from 'react';
import './style.css';
import { addStyles} from 'react-mathquill'
import * as Util from '../../util/util.js';
import * as Constants from '../../util/constants.js';



addStyles()

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

const Keyboard = lazy(()=>{ return import('../math keyboard/MathKeyBoard')});
const EditableMathField = lazy(()=> {return import('react-mathquill')})

class MathPicker extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            show: false,
        }

        this.math_field = null;
    }

    componentDidMount(){
    }

    _onClick = e =>{
        this.setState((state) =>({show: !state.show}));
        this.props.visibility.change_visibility_function(!this.state.show);
    }

    _onChange = e =>{
        if(e === undefined){return;}
        if(this.math_field == null || e.latex() === "undefined")
        {
            this.math_field = e;
            this.math_field.latex("");
            return;
        }
        
        this.setState({text:e.latex()});
        this.math_field.focus();
        //send html to Board
        this.updateMathField();
    }

    _onAddSign(sign){
        if(this.math_field != null){
            this.math_field.write(sign);
        }
    }

    _onMove(dir)
    {
        this.math_field.keystroke(dir);
        this.math_field.focus();
    }

    clear = e =>{
        this.math_field.latex("");
    }

    updateMathField()
    {
        let output = this.math_field.latex() + Constants.MATH_COLOR;
        //let output = Util.encode_url(this.math_field.latex()) + Constants.MATH_COLOR;
        this.props.data.change_field_function(output);
    }

    renderLoader = () => {
        return <p>Loading</p>
    }

    render(){
        return(
            <div className="math">
                <Suspense fallback={this.renderLoader()}>
                <button onClick={this._onClick.bind(this)} className="button">Math</button>
                {this.state.show &&
                    <div className="math-panel-wrapper">
                        <Keyboard/>
                        <div className="root-input-wrapper">
                        <EditableMathField
                            config={config}
                            className="math-field"
                            onChange={(mathField) => {
                                this._onChange(mathField)
                              }}
                        />
                        </div>
                    </div>
                }
                </Suspense>
            </div>
        )
    }
}

export default MathPicker;