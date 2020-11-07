import React from 'react';
import {Stage,Line,Layer, Circle,Rect} from 'react-konva';
import io from 'socket.io-client'
import * as Constants from '../../util/constants.js';
import * as MyMath from '../../util/math.js';
import './style.css';

import ColorPicker from '../color picker/ColorPicker';
import SizePicker from '../size picker/SizePicker';
import ModePicker from '../mode picker/ModePicker';
import MathPicker from '../math picker/MathPicker';

class Board extends React.Component{

    entities = [];
    new_entity = {
        lines: [],
        color: '#000000',
        thickness: 1
    };
    new_line_position = [];
    line_pointer = 0;

    initial_click_position = null;

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
            pan_by: 15,
            color: '#000000',
            thickness: 10,
            mode: Constants.MODE.FREE_DRAW
        }

    }

    componentDidMount()
    {
        this.socket.on(Constants.INITIAL_CANVAS_DATA,(data) => {
            this.entities = data.content;
            this.line_pointer = data.pointer;
        })

        this.socket.on(Constants.CANVAS_DATA,(data)=> {
            this.entities.push(data);
            this.line_pointer +=1;
        })
    }


    _onMouseDown = e =>{
        var stage = e.currentTarget;
        this.setState({mouse_x: this.getRelativePointerPosition(stage).x});
        this.setState({mouse_y: this.getRelativePointerPosition(stage).y});

        if(e.evt.button === Constants.LEFT_BUTTON)
        {
            this.setState({is_drawing: true});
            this.initial_click_position = this.getRelativePointerPosition(stage);
        }
        if(e.evt.button === Constants.RIGHT_BUTTON)
        {
            this.setState({is_panning: true});

            //disable right click context-menu
            e.evt.preventDefault();
            //initial panning position
            this.pan_position = stage.getPointerPosition();
        }
        //clear new line position array
        this.new_line_position = [];
    }
    
    _onMouseUp = e =>{
        if(e.evt.button === Constants.LEFT_BUTTON)
        {
            this.setState({is_drawing: false});
        
            this.line_pointer +=1;

            //emit new line
            this.socket.emit(Constants.CANVAS_DATA  ,this.new_entity);
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


            let dx = this.initial_click_position.x - this.getRelativePointerPosition(stage).x;
            let dy = this.initial_click_position.y - this.getRelativePointerPosition(stage).y;

            switch(this.state.mode)
            {
                case Constants.MODE.FREE_DRAW:
                    //add new positions
                    this.new_line_position.push(this.state.last_mouse_x);
                    this.new_line_position.push(this.state.last_mouse_y);
                    this.new_line_position.push(this.state.mouse_x);
                    this.new_line_position.push(this.state.mouse_y);

                    //create new line
                    this.new_entity = {
                        lines: this.new_line_position,
                        color: this.state.color,
                        thickness: this.state.thickness,
                        type: 'line'
                    }
                    break;
                case Constants.MODE.LINE:
                    //update only last position
                    this.new_line_position[0] = this.initial_click_position.x;
                    this.new_line_position[1] = this.initial_click_position.y;
                    this.new_line_position[2] = this.getRelativePointerPosition(stage).x;
                    this.new_line_position[3] = this.getRelativePointerPosition(stage).y;

                    //create new line
                    this.new_entity = {
                        lines: this.new_line_position,
                        color: this.state.color,
                        thickness: this.state.thickness,
                        type: 'line'
                    }

                    break;
                case Constants.MODE.CIRCLE:
                    var radius = Math.sqrt(dx*dx + dy*dy);
                    
                    this.new_entity={
                        x: this.getRelativePointerPosition(stage).x,
                        y: this.getRelativePointerPosition(stage).y,
                        radius: radius,
                        color: this.state.color,
                        thickness: this.state.thickness,
                        type: 'circle'
                    }
                    break;
                case Constants.MODE.RECTANGLE:
                    this.new_entity={
                        x: this.initial_click_position.x,
                        y: this.initial_click_position.y,
                        width : -1*dx,
                        height: -1*dy,
                        color: this.state.color,
                        thickness: this.state.thickness,
                        type: 'rectangle'
                    }
                    break;
                default:
                    break;
            }
            this.entities[this.line_pointer] = this.new_entity;
        
            stage.batchDraw();

            //set the last mouse coordinates
            this.setState({last_mouse_x: this.state.mouse_x});
            this.setState({last_mouse_y: this.state.mouse_y});
        }

        if(this.state.is_panning)
        {
            var pointer = stage.getPointerPosition();

            //offset from current position to initial panning position
            var new_position = { 
                x: (pointer.x - this.pan_position.x),
                y: (pointer.y - this.pan_position.y)
            }

            //normalize vector and multiply by constant
            new_position = MyMath.vector_normalize(new_position.x,new_position.y);
            new_position.x *= this.state.pan_by;
            new_position.y *= this.state.pan_by;
            
            //calculate new stage position
            var stage_position = {
                x: stage.position().x + new_position.x,
                y: stage.position().y + new_position.y,
            }

            stage.batchDraw();
            stage.position(stage_position);            
        }

        //set the last mouse coordinates
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


    change_color(in_color)
    {
        this.setState({color: in_color});
    }

    change_size(in_size)
    {
        this.setState({thickness: in_size});
    }

    change_mode(in_mode)
    {
        this.setState({mode: in_mode});
    }

    //world coordinates
    getRelativePointerPosition(node) {
        var transform = node.getAbsoluteTransform().copy();
        transform.invert();
        var position = node.getStage().getPointerPosition();

        return transform.point(position);
    }

    render(){
        const items = this.entities;
        return(
            <div className="board" onContextMenu={(e)=> e.preventDefault()}>
                <div className="panel" > Side Panel
                <div classname="panel-wrapper">
                    <div className="color-picker">
                        <ColorPicker data={{change_color_function: this.change_color.bind(this)}}/>
                    </div>
                    <div className="size-picker">
                        <SizePicker data={{change_size_function: this.change_size.bind(this)}}/>
                    </div>
                    <div className="mode-picker"> 
                        <ModePicker data={{change_mode_function: this.change_mode.bind(this)}}></ModePicker>
                    </div>
                    <div className="math-picker">
                        <MathPicker></MathPicker>
                    </div>
                </div>
                </div>
                <Stage className="board-stage" 
                width={window.innerWidth} height={window.innerHeight}
                onMouseDown ={this._onMouseDown.bind(this)}
                onMouseUp   ={this._onMouseUp.bind(this)}
                onMouseMove ={this._onMouseMove.bind(this)}
                onWheel     ={this._onWheel.bind(this)}>
                    <Layer>
                        {items.map((entity,i) =>
                        { 
                            if(entity.type==='line')
                            {
                                return (
                                    <Line 
                                        key={i}
                                        points={entity.lines}
                                        stroke={entity.color}
                                        strokeWidth={entity.thickness}
                                        lineCap={'round'}
                                        lineJoin={'round'}>
                                    </Line>)
                            }
                            else if(entity.type === 'circle')
                            {
                                return (
                                    <Circle
                                        key={i}
                                        x={entity.x}
                                        y={entity.y}
                                        radius={entity.radius}
                                        stroke={entity.color}
                                        strokeWidth={entity.thickness}
                                    />
                                )
                            }
                            else if(entity.type === 'rectangle')
                            {
                                return (
                                    <Rect
                                    key={i}
                                    x={entity.x}
                                    y={entity.y}
                                    width={entity.width}
                                    height={entity.height}
                                    stroke={entity.color}
                                    strokeWidth={entity.thickness}
                                    />
                                )
                            }
                        })}
                    </Layer>
                </Stage>
            </div>
        )
    }
}

export default Board