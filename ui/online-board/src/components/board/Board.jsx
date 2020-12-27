import React from 'react';
import {Stage,Layer} from 'react-konva';
import io from 'socket.io-client'
import * as Constants from '../../util/constants.js';
import * as MyMath from '../../util/math.js';
import * as Util from '../../util/util.js';
import './style.css';

import {Drawable} from '../../shapes/Drawable.js'
import {MLine} from '../../shapes/MLine.js';
import {MCircle} from '../../shapes/MCircle.js';
import {MRect} from '../../shapes/MRect.js';
import {MField} from '../../shapes/MField.js';

import ColorPicker from '../color picker/ColorPicker';
import SizePicker from '../size picker/SizePicker';
import ModePicker from '../mode picker/ModePicker';
import MathPicker from '../math picker/MathPicker';
import SelectPanel from '../select panel/SelectPanel';


class Board extends React.Component{

    entities = [];
    new_entity = null;
    new_line_position = [];
    entity_pointer = 0;
    copied_entities = [];
    mouse_down = false;

    initial_click_position = null;

    pan_position = null;

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
            color: '#ABB8C3',
            thickness: 10,
            mode: Constants.MODE.FREE_DRAW,
            math_field: null,
            select_panel_data: {is_selected: Util.is_anything_selected(this.entities), x: 0, y:0},
        }
        console.log("ptr: " + this.entity_pointer);
    }

    componentDidMount()
    {
        this.socket.on(Constants.INITIAL_CANVAS_DATA,(data) => {
            if(this.entities.length > 0) {return;}
            for(var i in data.content)
            {
                this.entities.push(Util.get_object(data.content[i]));
            }
            this.entity_pointer = data.pointer;
        })

        this.socket.on(Constants.CANVAS_DATA,(data)=> {
            let new_data = Util.get_object(data);
            this.entities.push(new_data);
            this.entity_pointer +=1;
        })

        this.socket.on(Constants.CANVAS_DATA_DELETE,(data) =>{
          this.delete_entity(data);
        })

        this.socket.on(Constants.CANVAS_DATA_FILTER,(data) =>{
            this.filter();
          })
    }


    _onMouseDown = e =>{
        var stage = e.currentTarget;
        this.setState({mouse_x: this.getRelativePointerPosition(stage).x});
        this.setState({mouse_y: this.getRelativePointerPosition(stage).y});
        this.setState({select_panel_data:
          {is_selected: false,
            x: 0,
            y: 0}
        });

        this.pan_position = {x: this.state.mouse_x,y: this.state.mouse_y};

        if(e.evt.button === Constants.LEFT_BUTTON)
        {
            this.setState({is_drawing: true});
            this.initial_click_position = this.getRelativePointerPosition(stage);
            this.mouse_down = true;
        }

        if(e.evt.button === Constants.RIGHT_BUTTON)
        {
            if(typeof this.copied_entities === 'undefined' || this.copied_entities.length <= 0) {return;}

            let offset = {x: this.state.mouse_x - this.copied_entities[0].points[0],
                          y: this.state.mouse_y - this.copied_entities[0].points[1]};
            //this.setState({is_panning: true});
            this.paste_selected(offset);
            //disable right click context-menu
            e.evt.preventDefault();
            //initial panning position
            //this.pan_position = stage.getPointerPosition();
        }
        //clear new line position array
        this.new_line_position = [];

        if(this.state.mode === Constants.MODE.MATH_FIELD)
        {
            if(this.state.math_field === "" || this.state.math_field ===null) {this.new_entity = null;return;}

            this.new_line_position[0] = this.initial_click_position.x;
            this.new_line_position[1] = this.initial_click_position.y;

            this.new_entity = new MField('Field',Util.next_key(this.entities),this.new_line_position,Constants.LATEX_TO_IMAGE + this.state.math_field);

            this.entities[this.entity_pointer] = this.new_entity;
            this.entity_pointer ++;
        }
    }

    _onMouseUp = e =>{
        console.log(this.entities);
        this.mouse_down = false;
        if(this.entities[this.entity_pointer] === undefined) {return;}

        //selector
        if(this.entities[this.entity_pointer].key === -1)
        {
            let cors = MyMath.get_selector(this.entities);
            if(cors !== null)
            {
                this.entities[this.entity_pointer].points[0] = (this.entities[this.entity_pointer].width > 0)? cors.min_x : cors.max_x;
                this.entities[this.entity_pointer].points[1] =  (this.entities[this.entity_pointer].height > 0)? cors.min_y : cors.max_y;
                this.entities[this.entity_pointer].width = (this.entities[this.entity_pointer].width > 0)? cors.max_x - cors.min_x: cors.min_x - cors.max_x;
                this.entities[this.entity_pointer].height = (this.entities[this.entity_pointer].height > 0)? cors.max_y - cors.min_y: cors.min_y - cors.max_y;

                // TODO: Better placing
                this.update_select_panel(e.currentTarget);
            }
            else{
                //delete selector from entities
                this.remove_selector();
            }
        }

        if(e.evt.button === Constants.LEFT_BUTTON)
        {
            this.setState({is_drawing: false});
            if(this.new_entity !== null && this.new_entity.key >=0)
            {
                this.entity_pointer +=1;
                this.socket.emit(Constants.CANVAS_DATA  ,this.new_entity);
            }
        }
        if(e.evt.button === Constants.RIGHT_BUTTON)
        {
            //this.setState({is_panning: false});
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

            let width = -1*dx;
            let height = -1*dy;
            this.new_entity = null;
            switch(this.state.mode)
            {
                case Constants.MODE.FREE_DRAW:
                    //add new positions
                    this.new_line_position.push(this.state.last_mouse_x);
                    this.new_line_position.push(this.state.last_mouse_y);
                    this.new_line_position.push(this.state.mouse_x);
                    this.new_line_position.push(this.state.mouse_y);

                    //create new line
                    this.new_entity = new MLine('Line',Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness);

                    break;
                case Constants.MODE.LINE:
                    //update only last position
                    this.new_line_position[0] = this.initial_click_position.x;
                    this.new_line_position[1] = this.initial_click_position.y;
                    this.new_line_position[2] = this.getRelativePointerPosition(stage).x;
                    this.new_line_position[3] = this.getRelativePointerPosition(stage).y;

                    //create new line
                    this.new_entity = new MLine('Line',Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness);

                    break;
                case Constants.MODE.CIRCLE:
                    var radius = Math.sqrt(dx*dx + dy*dy);
                    this.new_line_position[0] = this.getRelativePointerPosition(stage).x;
                    this.new_line_position[1] = this.getRelativePointerPosition(stage).y;

                    this.new_entity = new MCircle('Circle',Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness,radius);
                    break;
                case Constants.MODE.RECTANGLE:
                    this.new_line_position[0] = this.initial_click_position.x;
                    this.new_line_position[1] = this.initial_click_position.y;

                    this.new_entity = new MRect('Rect',Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness,width,height);
                    break;
                case Constants.MODE.SELECT:
                    let new_points = [this.initial_click_position.x,this.initial_click_position.y];

                    let selector = new MRect('Rect',-1,new_points,Constants.SELECT_COLOR,this.state.thickness,width,height);
                    selector.fill = true;
                    selector.opacity = 0.3;

                    //calculate collision for every entity on the board
                    for(var i in this.entities)
                    {
                        this.entities[i].selected = MyMath.collision_check(this.entities[i],selector);
                    }

                    //if mode doesnt create new entity, set it to null
                    this.new_entity = selector;
                    break;
                case Constants.MODE.PANNING:
                    if(this.mouse_down)
                    {
                        var newPos = {
                            x: (stage.getPointerPosition().x - this.pan_position.x * stage.scaleX()) ,
                            y: (stage.getPointerPosition().y - this.pan_position.y * stage.scaleY()) ,
                        };

                        //var touch1 = e.evt.touches[0];
                        //var touch2 = e.evt.touches[1];

                        stage.position(newPos);
                        console.log(newPos);
                        //stage.batchDraw();
                    }
                    //console.log("Pann");
                    
                    break;
                default:
                     //if mode doesnt create new entity, set it to null

                    break;
            }
            if(this.new_entity!== null)
                this.entities[this.entity_pointer] = this.new_entity;

            stage.batchDraw();

            //set the last mouse coordinates
            this.setState({last_mouse_x: this.state.mouse_x});
            this.setState({last_mouse_y: this.state.mouse_y});
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

        this.update_select_panel(stage);
    }


    update_select_panel(stage)
    {
      let shown = Util.is_anything_selected(this.entities);
      if(!shown) {return;}

      let width = this.entities[this.entity_pointer].width;
      let height = this.entities[this.entity_pointer].height;


      let x = (width > 0) ? this.entities[this.entity_pointer].points[0] : this.entities[this.entity_pointer].points[0] + width;
      let y = (height > 0 ) ? this.entities[this.entity_pointer].points[1] : this.entities[this.entity_pointer].points[1] + height;

      let scale =  stage.scaleX();


      let offset_x = 40;
      let offset_y = 120;

      let x_diff =  stage.absolutePosition().x;
      let y_diff =  stage.absolutePosition().y;


      this.setState({select_panel_data:
        {is_selected: shown,
          x: (x * scale + x_diff - offset_x),
          y: (y * scale + y_diff) - offset_y }
      });
    }

    remove_selector()
    {
      if(this.entities[this.entity_pointer] === undefined) {return;}
      if(this.entities[this.entity_pointer].key !== -1) { return;}
      this.entities.splice(this.entity_pointer,1);
      this.setState({select_panel_data:
        {is_selected: false,
          x: 0,
          y: 0 }
      });
    }

    delete_entity(index)
    {
      delete this.entities[index];
      this.entity_pointer --;
    }

    delete_selected()
    {
      //check if anything is selected
      if(!Util.is_anything_selected(this.entities)) {return;}

      for(var i in this.entities)
      {
        var entity = this.entities[i];
        console.log(this.entities);
        if(entity.selected) //if entity is selected
        {
          this.delete_entity(i); //delete locally

          this.socket.emit(Constants.CANVAS_DATA_DELETE,i); //emit
        }

      }
      this.filter();
      this.socket.emit(Constants.CANVAS_DATA_FILTER,null); //emit

      this.remove_selector(); // remove selector
    }

    filter()
    {
        this.entities = Util.filter_empty_array(this.entities);
    }

    
    copy_selected()
    {
      //check if anything is selected
      if(!Util.is_anything_selected(this.entities)) {return;}
      //empty array
      this.copied_entities = [];
      for(var i in this.entities)
      {
        if(this.entities[i].selected) // if is selected
        {
          //using JSON to clone object
          let entity = Util.get_object(JSON.parse(JSON.stringify(this.entities[i])));
          this.copied_entities.push(entity);
        }
      }
      console.log(this.copied_entities);
      console.log(this.entities); 
      this.remove_selector();
    }

    paste_selected(offset)
    {
        //remove selector
        this.remove_selector();
        for(var i in this.copied_entities)
        {
            let entity = this.copied_entities[i];
            entity.key = Util.next_key(this.entities) + parseInt(i);

            //temporary
            for(var j in entity.points)
            {
                entity.points[j] += (j%2 == 0)? offset.x : offset.y;
            }

            //add entity
            this.entities[this.entity_pointer] = entity;
            this.entity_pointer ++ ;

            //emit entity
            this.socket.emit(Constants.CANVAS_DATA  ,entity);
        }
        //clear copied entities
        this.copied_entities = [];

        console.log(this.entities);
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


    getLatexMath(html)
    {
        this.setState({math_field: html});
    }

    //world coordinates
    getRelativePointerPosition(node) {
        var transform = node.getAbsoluteTransform().copy();
        transform.invert();
        var position = node.getStage().getPointerPosition();

        return transform.point(position);
    }

    getRelativePointPosition(node,point)
    {
      var transform = node.getAbsoluteTransform().copy();
      transform.invert();

      return transform.point(point);
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
                        <MathPicker data={{change_field_function: this.getLatexMath.bind(this)}}></MathPicker>
                    </div>
                    <div className="panning">
                        <button onClick={()=> {this.setState({mode: Constants.MODE.PANNING})}}>Pan</button>
                    </div>
                </div>
                <SelectPanel
                data={this.state.select_panel_data}
                callback_delete={{delete_callback: this.delete_selected.bind(this)}}
                callback_copy={{copy_callback: this.copy_selected.bind(this)}}
                />

            </div>
                <Stage className="board-stage"
                width={window.innerWidth} height={window.innerHeight}
                onMouseDown ={this._onMouseDown.bind(this)}
                onMouseUp   ={this._onMouseUp.bind(this)}
                onMouseMove ={this._onMouseMove.bind(this)}
                onWheel     ={this._onWheel.bind(this)}>
                    <Layer>
                        {items.map((entity) =>
                        {
                            if(entity instanceof Drawable){ return (entity.draw())}
                        })}
                    </Layer>
                </Stage>
            </div>
        )
    }
}

export default Board
