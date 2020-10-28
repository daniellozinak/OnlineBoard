import React from 'react';
import {Stage,Line,Layer} from 'react-konva';

class Board extends React.Component{

    lineCors = [];
    constructor(props)
    {
        super(props);
        this.state = {
            is_drawing: false
        }

        this.lineCors.push(5,70,100,200);
    }



    _onMouseDown = e =>{

        this.setState({is_drawing: !this.state.is_drawing});
        var stage = e.currentTarget;
        console.log(this.getRelativePointerPosition(stage));
    }

    _onMouseOver = e =>{
        console.log("over");
    }

    getRelativePointerPosition(node) {
        var transform = node.getAbsoluteTransform().copy();
        transform.invert();
        var pos = node.getStage().getPointerPosition();

        return transform.point(pos);
      }

    render(){
        return(
            <div className="board">
                <Stage width={window.innerWidth} height={window.innerHeight}
                onMouseDown={this._onMouseDown.bind(this)}
                onMouseOver={this._onMouseOver.bind(this)}>
                    <Layer>
                        {this.lineCors.map((line) =>
                        <Line points={this.lineCors}
                            stroke={'red'}
                            strokeWidth={15}
                            lineCap={'round'}
                            lineJoin={'round'}>
                        </Line>)}
                    </Layer>
                </Stage>
            </div>
        )
    }
}

export default Board