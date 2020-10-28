import React from 'react';
import {Stage,Line,Layer,Text} from 'react-konva';
import io from 'socket.io-client'

class Board extends React.Component{

    lines = [];
    new_lines = [];
    line_pointer = 0;
    socket = io.connect("http://localhost:5000");
    
    constructor(props)
    {
        super(props);
        this.state = {
            is_drawing: false,
            mouse_x: 0,
            mouse_y: 0,
            last_mouse_x: 0,
            last_mouse_y: 0,
        }

    }

    componentDidMount()
    {
        this.socket.on('canvas-data-initial',(data) => {
            this.lines = data.content;
            this.line_pointer = data.pointer;
        })

        this.socket.on('canvas-data',(data)=> {
            this.lines.push(data);
        })
    }


    _onMouseDown = e =>{
        this.setState({is_drawing: true});
        this.new_lines = [];
    }
    
    _onMouseUp = e =>{
        this.setState({is_drawing: false});
        this.lines.push(this.new_lines);
        this.socket.emit("canvas-data",this.new_lines);
    }

    _onMouseMove = e =>{
        var stage = e.currentTarget;
        if(this.state.is_drawing)
        {
            this.setState({mouse_x: this.getRelativePointerPosition(stage).x});
            this.setState({mouse_y: this.getRelativePointerPosition(stage).y});
            
            this.new_lines.push(this.state.last_mouse_x);
            this.new_lines.push(this.state.last_mouse_y);
            this.new_lines.push(this.state.mouse_x);
            this.new_lines.push(this.state.mouse_y);

            this.lines[this.line_pointer] = this.new_lines;

            this.setState({last_mouse_x: this.state.mouse_x});
            this.setState({last_mouse_y: this.state.mouse_y});
        }
        else{
            this.setState({last_mouse_x: this.getRelativePointerPosition(stage).x});
            this.setState({last_mouse_y: this.getRelativePointerPosition(stage).y});
        }

    }


    //world coordinates
    getRelativePointerPosition(node) {
        var transform = node.getAbsoluteTransform().copy();
        transform.invert();
        var position = node.getStage().getPointerPosition();

        return transform.point(position);
    }

    render(){
        const items = this.lines;
        return(
            <div className="board">
                <Stage width={window.innerWidth} height={window.innerHeight}
                onMouseDown={this._onMouseDown.bind(this)}
                onMouseUp={this._onMouseUp.bind(this)}
                onMouseMove={this._onMouseMove.bind(this)}>
                    <Layer>
                        <Text text={this.state.mouse_x + " " + this.state.mouse_y}></Text>
                        {items.map((line,i) =>
                        <Line 
                            key={i}
                            points={line}
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