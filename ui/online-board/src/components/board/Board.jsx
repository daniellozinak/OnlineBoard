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

import SelectPanel from '../select panel/SelectPanel';
import Panel from '../side panel/Panel';


class Board extends React.Component{

    entities = [];
    new_entity = null;
    new_line_position = [];
    copied_entities = [];
    mouse_down = false;
    current_position=0;
    stage = null;
    selector = null;

    is_dragging = false;

    initial_click_position = null;

    socket = io.connect(Constants.LOCAL_SERVER);

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
            select_panel_data: {is_selected: Util.is_there_selector(this.entities), x: 0, y:0},
        }
    }

    componentDidMount()
    {
        this.socket.on(Constants.INITIAL_CANVAS_DATA,(data) => {
            if(this.entities.length > 0) {return;}
            for(var i in data.content)
            {
                this.entities.push(Util.retrieve_object(data.content[i]));
            }
        })

        this.socket.on(Constants.CANVAS_DATA,(data)=> {
            let new_data = Util.retrieve_object(data);
            this.entities.push(new_data);
        })

        this.socket.on(Constants.CANVAS_DATA_DELETE,(data) =>{
          this.delete_entity(data);
        })

        this.socket.on(Constants.CANVAS_DATA_FILTER,(data) =>{
            this.filter();
          })
    }


    _onMouseDown = e =>{
        this.stage = e.currentTarget;
        this.setState({mouse_x: Util.screen_to_world(this.stage).x});
        this.setState({mouse_y: Util.screen_to_world(this.stage).y});
        this.setState({select_panel_data:
          {is_selected: false,
            x: 0,
            y: 0}
        });

        if(e.evt.button === Constants.LEFT_BUTTON)
        {
            this.setState({is_drawing: true});
            this.initial_click_position = Util.screen_to_world(this.stage);
            this.mouse_down = true;
            this.copied_entities = [];

            if(!this.is_dragging) {this.remove_selector(); this.selector = null;}
        }

        if(e.evt.button === Constants.RIGHT_BUTTON)
        {
            //disable right click context-menu
            e.evt.preventDefault();

            if(typeof this.copied_entities === 'undefined') {return;}
            if(this.copied_entities.length === 0) {return;}

            let offset = {x: this.state.mouse_x - this.copied_entities[0].points[0],
                          y: this.state.mouse_y - this.copied_entities[0].points[1]};

            this.paste_selected(offset);
        }
        //clear new line position array
        this.new_line_position = [];
        this.current_position = this.entities.length;
    }

    _onMouseUp = e =>{
        this.mouse_down = false;

        //selector
        this.entities = Util.select(this.entities);
        this.update_select_panel(e.currentTarget);

        if(!Util.is_anything_selected(this.entities)) {this.remove_selector();}

        this.emit_data();

        this.setState({is_drawing: false});
        console.log(this.entities);
    }

    _onMouseMove = e =>{
        this.stage = e.currentTarget;

        this.setState({mouse_x: Util.screen_to_world(this.stage).x});
        this.setState({mouse_y: Util.screen_to_world(this.stage).y});
        if(this.state.is_drawing && this.mouse_down)
        {


            let dx = this.initial_click_position.x - Util.screen_to_world(this.stage).x;
            let dy = this.initial_click_position.y - Util.screen_to_world(this.stage).y;

            let width = -1*dx;
            let height = -1*dy;
            this.new_entity = null;

            //added to fix the key generation
            this.entities[this.current_position] = this.new_entity;

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
                    this.new_line_position[2] = Util.screen_to_world(this.stage).x;
                    this.new_line_position[3] = Util.screen_to_world(this.stage).y;

                    //create new line
                    this.new_entity = new MLine('Line',Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness);
                    break;
                case Constants.MODE.CIRCLE:
                    var radius = Math.sqrt(dx*dx + dy*dy);
                    this.new_line_position[0] = Util.screen_to_world(this.stage).x;
                    this.new_line_position[1] = Util.screen_to_world(this.stage).y;

                    this.new_entity = new MCircle('Circle',Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness,radius);
                    break;
                case Constants.MODE.RECTANGLE:
                    this.new_line_position[0] = this.initial_click_position.x;
                    this.new_line_position[1] = this.initial_click_position.y;

                    this.new_entity = new MRect('Rect',Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness,width,height);
                    break;
                case Constants.MODE.SELECT:
                    if(this.is_dragging) {break;}
                    let new_points = [this.initial_click_position.x,this.initial_click_position.y];

                    this.selector = new MRect('Rect',-1,new_points,Constants.SELECT_COLOR,this.state.thickness,width,height);
                    this.selector.fill = true;
                    this.selector.opacity = Constants.SELECT_OPACITY;

                    //calculate collision for every entity on the board
                    for(var i in this.entities)
                    {
                        if(this.entities[i] !== null)
                            this.entities[i].selected = MyMath.collision_check(this.entities[i],this.selector);
                    }

                    //if mode doesnt create new entity, set it to null
                    // this.is_dragging = MyMath.is_dragging({x: this.state.mouse_x, y: this.state.mouse_y},selector);
                    // console.log(this.is_dragging);

                    this.new_entity = this.selector;
                    break;
                case Constants.MODE.PANNING:
                    if(this.mouse_down)
                    {
                        var newPos = {
                            x: (this.stage.getPointerPosition().x - this.initial_click_position.x * this.stage.scaleX()) ,
                            y: (this.stage.getPointerPosition().y - this.initial_click_position.y * this.stage.scaleY()) ,
                        };
                        this.stage.position(newPos);
                    }
                    
                    break;
                case Constants.MODE.MATH_FIELD:
                    if(this.state.math_field === "" || this.state.math_field ===null) {this.new_entity = null;return;}

                    this.new_line_position[0] = this.initial_click_position.x;
                    this.new_line_position[1] = this.initial_click_position.y;

                    this.new_entity = new MField('Field',Util.next_key(this.entities),this.new_line_position,Constants.LATEX_TO_IMAGE + this.state.math_field);
                    break;
                default:
                     //if mode doesnt create new entity, set it to null

                    break;
            }
            this.entities[this.current_position] = this.new_entity;

            this.stage.batchDraw();

            //set the last mouse coordinates
            this.setState({last_mouse_x: this.state.mouse_x});
            this.setState({last_mouse_y: this.state.mouse_y});
            return;
        }

        this.is_dragging = MyMath.is_dragging({x: this.state.mouse_x, y: this.state.mouse_y},this.selector);
        if(this.is_dragging)
        {
            //console.log("moving");
        }

        //set the last mouse coordinates
        this.setState({last_mouse_x: Util.screen_to_world(this.stage).x});
        this.setState({last_mouse_y: Util.screen_to_world(this.stage).y});
    }

    _onWheel = e =>{
        this.stage = e.currentTarget;
        var old_scale = this.stage.scaleX();
        var pointer = this.stage.getPointerPosition();


        // deltaY > 0 : ZOOM IN
        // deltaY < 0 : ZOOM OUT
        var new_scale = e.evt.deltaY > 0 ? old_scale * this.state.scale_by : old_scale / this.state.scale_by;

        //mouse position on the screen
        var mouse_screen_position = {
            x: (pointer.x - this.stage.x()) / old_scale,
            y: (pointer.y - this.stage.y()) / old_scale
        }

        var new_position = {
            x: pointer.x - mouse_screen_position.x * new_scale,
            y: pointer.y - mouse_screen_position.y * new_scale
        }

        this.stage.scale({x: new_scale, y: new_scale});
        this.stage.position(new_position);
        this.stage.batchDraw();

        this.setState({current_scale: new_scale});

        this.update_select_panel(this.stage);
    }

    update_select_panel(stage)
    {
      if(!Util.is_there_selector(this.entities)) {return;}

      let width = this.entities[this.entities.length - 1].width;
      let height = this.entities[this.entities.length - 1].height;


      let x = (width > 0) ? this.entities[this.entities.length - 1].points[0] : this.entities[this.entities.length - 1].points[0] + width;
      let y = (height > 0 ) ? this.entities[this.entities.length - 1].points[1] : this.entities[this.entities.length - 1].points[1] + height;

      let scale =  stage.scaleX();


      let offset_x = 40;
      let offset_y = 120;

      let x_diff =  stage.absolutePosition().x;
      let y_diff =  stage.absolutePosition().y;


      this.setState({select_panel_data:
        {is_selected: Util.is_there_selector(this.entities),
          x: (x * scale + x_diff - offset_x),
          y: (y * scale + y_diff) - offset_y }
      });
    }

    emit_data()
    {
        if(this.new_entity !== null && this.new_entity.key >=0)
        {
            this.socket.emit(Constants.CANVAS_DATA  ,this.new_entity);
        }
    }

    remove_selector()
    {
        if(typeof this.entities[this.entities.length - 1] === 'undefined' || this.entities[this.entities.length - 1] === null) {return;}
        if(this.entities[this.entities.length - 1].key !== -1) { return;}

        this.entities.splice(this.entities.length - 1,1);
        this.setState({select_panel_data:
          {is_selected: false,
            x: 0,
            y: 0 }
        });
    }

    delete_entity(index)
    {
      delete this.entities[index];
    }

    delete_selected()
    {
      //check if anything is selected
      if(!Util.is_there_selector(this.entities)) {return;}

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
      this.copied_entities = Util.copy_entities(this.entities);
      this.remove_selector();
    }

    paste_selected(offset)
    {
        console.log("paste?");
        for(var i in this.copied_entities)
        {
            let entity = Util.retrieve_object(Util.clone_object(this.copied_entities[i]));
            entity.key = Util.next_key(this.entities) + 1;


            //temporary
            for(var j in entity.points)
            {
                entity.points[j] += (j%2 == 0)? offset.x : offset.y;
            }

            //add entity
            this.entities.push(entity);

            //emit entity
            this.socket.emit(Constants.CANVAS_DATA  ,entity);
        }
        //clear copied entities
        console.log(this.entities);
    }

    change_color(in_color){this.setState({color: in_color}); }
    change_size(in_size) {this.setState({thickness: in_size}); }
    change_mode(in_mode){this.setState({mode: in_mode});}
    math_field_visibility(show)
    {
        if(show) {return;}
        this.entities.push(this.new_entity);
        this.emit_data();
        this.stage.batchDraw();
        this.setState({math_field: ""});
    }
    get_latex(src)
    {
        this.setState({math_field: src});
        if(this.state.math_field === '' || this.state.math_field === Constants.MATH_COLOR || this.stage === null || this.state.math_field === null) {return;}

        let position = Util.get_math_position(this.stage);
        console.log(position);
        this.new_entity = new MField('Field',Util.next_key(this.entities),[position.x, position.y],Constants.LATEX_TO_IMAGE + this.state.math_field);
    }

    render(){
        const items = this.entities;
        return(
            <div className="board" onContextMenu={(e)=> e.preventDefault()}>
                <div className="panel">
                <Panel 
                color_callback={{color_callback: this.change_color.bind(this)}}
                size_callback={{size_callback: this.change_size.bind(this)}}
                mode_callback={{mode_callback: this.change_mode.bind(this)}}
                latex_callback={{latex_callback: this.get_latex.bind(this)}}
                math_visible_callback={{math_visible_callback: this.math_field_visibility.bind(this)}}
                />
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
            </div>)
    }
}

export default Board