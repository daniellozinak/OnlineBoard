import React from 'react';
import {Stage,Line,Layer,Text} from 'react-konva';
import io from 'socket.io-client'
import * as Constants from '../../util/constants.js';
import * as MyMath from '../../util/math.js';

class Board extends React.Component{

    lines = [];
    new_lines = [];
    line_pointer = 0;
    socket = io.connect(Constants.LOCAL_SERVER);
    pan_position;
    
    constructor(props)
    {
        super(props);
        this.state = {
            is_drawing: false,
            is_panning: false,
            mouse_x: 0,
            mouse_y: 0,
            last_mouse_x: 0,
            last_mouse_y: 0,
            current_scale: 1,
            scale_by: 1.05,
            pan_by: 15
        }

    }

    componentDidMount()
    {
        this.socket.on(Constants.INITIAL_CANVAS_DATA,(data) => {
            this.lines = data.content;
            this.line_pointer = data.pointer;
        })

        this.socket.on(Constants.CANVAS_DATA,(data)=> {
            this.lines.push(data);
        })
    }


    _onMouseDown = e =>{
        var stage = e.currentTarget;
        this.setState({mouse_x: this.getRelativePointerPosition(stage).x});
        this.setState({mouse_y: this.getRelativePointerPosition(stage).y});

        if(e.evt.button === Constants.LEFT_BUTTON)
        {
            this.setState({is_drawing: true});
        }
        if(e.evt.button === Constants.RIGHT_BUTTON)
        {
            this.setState({is_panning: true});

            //disable right click context-menu
            e.evt.preventDefault();
            //initial panning position
            this.pan_position = stage.getPointerPosition();
        }
        this.new_lines = [];
    }
    
    _onMouseUp = e =>{
        if(e.evt.button === Constants.LEFT_BUTTON)
        {
            this.setState({is_drawing: false});
            this.lines.push(this.new_lines);
            this.socket.emit("canvas-data",this.new_lines);
        }
        if(e.evt.button === Constants.RIGHT_BUTTON)
        {
            this.setState({is_panning: false});
        }
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

        if(this.state.is_panning)
        {
            var pointer = stage.getPointerPosition();

            var new_position = { 
                x: (pointer.x - this.pan_position.x),
                y: (pointer.y - this.pan_position.y)
            }

            new_position = MyMath.vector_normalize(new_position.x,new_position.y);
            new_position.x *= this.state.pan_by;
            new_position.y *= this.state.pan_by;
            
            var stage_position = {
                x: stage.position().x + new_position.x,
                y: stage.position().y + new_position.y,
            }

            console.log(pointer);
            stage.batchDraw();
            stage.position(stage_position);

            
        }

        this.setState({last_mouse_x: this.getRelativePointerPosition(stage).x});
        this.setState({last_mouse_y: this.getRelativePointerPosition(stage).y});
    }

    _onWheel = e =>{
        var stage = e.currentTarget;
        var old_scale = stage.scaleX();
        var pointer = stage.getPointerPosition();


        // deltaY > 0 : ZOOM IN
        // deltaY < 0 : ZOOM OUT
        var new_scale = e.evt.deltaY > 0 ? old_scale * this.state.scale_by : old_scale / this.state.scale_by;

        //mouse position on the screen
        var mouse_screen_position = {
            x: (pointer.x - stage.x()) / old_scale,
            y: (pointer.y - stage.y()) / old_scale
        }

        var new_position = {
            x: pointer.x - mouse_screen_position.x * new_scale,
            y: pointer.y - mouse_screen_position.y * new_scale
        }

        stage.scale({x: new_scale, y: new_scale});
        stage.position(new_position);
        stage.batchDraw();

        this.setState({current_scale: new_scale});
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
            <div className="board" onContextMenu={(e)=> e.preventDefault()}>
                <Stage width={window.innerWidth} height={window.innerHeight}
                onMouseDown ={this._onMouseDown.bind(this)}
                onMouseUp   ={this._onMouseUp.bind(this)}
                onMouseMove ={this._onMouseMove.bind(this)}
                onWheel     ={this._onWheel.bind(this)}>
                    <Layer>
                        <Text className="debug" text={this.state.mouse_x + " " + this.state.mouse_y}></Text>
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