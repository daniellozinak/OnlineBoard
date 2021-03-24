import React,{lazy,Suspense} from 'react';
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
import {Selector} from '../../shapes/Selector.js';
import { MText } from '../../shapes/MText.js';

import ImageTransformer from '../image transformer/ImageTransformer';


const SelectPanel = lazy(()=> {return import('../select panel/SelectPanel')});
const Panel = lazy(()=> {return import('../side panel/Panel')});
const MathList = lazy(()=> {return import('../math list/MathList')});
const Invite = lazy(()=> {return import('../invite/Invite')});
const Save = lazy(()=> {return import('../save/Save')});



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
    is_drawing = false;

    initial_click_position = null;

    socket = null;

    constructor(props)
    {
        super(props);
        this.state = {
            joined: false,
            invite_link: '',
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
            selected_entity : {konva_object: null, custom_object: null},
            select_panel_data: {is_selected: Util.is_there_selector(this.entities), x: 0, y:0},
        }

        this.mathlistRef = React.createRef();
    }


    componentDidMount()
    {
        this.socket = io.connect(Constants.LOCAL_SERVER);

        // register socket events
        this.socket.on(Constants.JOINED_ROOM,(room)=>{
            for(var i in room.content)
            {
                this.entities.push(Util.retrieve_object(room.content[i]));
            }

            this.current_position = room.pointer;

            console.log(room);
            this.setState({joined: true});
        })

        this.socket.on(Constants.CANVAS_DATA,(data)=> {
            let new_data = Util.retrieve_object(data);
            this.entities.push(new_data);
        })

        this.socket.on(Constants.CANVAS_DATA_DELETE,(data) =>{
          this.delete_entity(data);
        })

        this.socket.on(Constants.CANVAS_DATA_FILTER,() =>{
            this.filter();
        })

        this.socket.on(Constants.CANVAS_DATA_MOVE,(data)=>{
            this.entities = Util.move_entity(data.key,data.points,this.entities);
            //TODO: update selector (ak ma prijimatel selctor, neposunie sa s entitami)
        })

        this.socket.on(Constants.CANVAS_TEXT_EDIT, (data) => {
            this.entities = Util.edit_text(data.key,data.text,this.entities);
        })

        this.socket.on('canvas-data-edit', (data) => {
            this.entities = Util.edit_data(data.key,data.attrs,this.entities);
        })
        
        //TODO: add constant
        this.socket.on("new-user",function(data){
            console.log('new user ' + data);
        })

        this.socket.on('redirect',function(data){
            window.location.href = data;
        })

        this.socket.on('created-room',(data) =>{
            let link = Constants.LOCAL_SERVER_REACT + "/draw/" + data;
            this.setState({invite_link: link});
            console.log('new room created: ' + link);
        })

        this.socket.on('already-in-room',function()
        {
            //notification
            console.log('Already in room');
        })

        this.socket.on('invalid-room',function(data){
            //throw an error page
            console.log(data + ' is not a valid room');
        })

        this.socket.on('left',function(data){
            console.log(data + ' left');
        })

        window.addEventListener('beforeunload', (ev) => 
        {  
            this.socket.emit('leave-room',null);
            this.socket.emit('disconnect',null);
        });
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

        this.mouse_down = true;
        if(e.evt.button === Constants.LEFT_BUTTON)
        {
            if(this.state.mode === Constants.MODE.TEXT){
                this.entities.push(new MText(Util.next_key(this.entities),[this.state.mouse_x,this.state.mouse_y],20,"",this.state.current_scale**-1,false,this.state.color));
                this.current_position ++;
            }
            this.is_drawing = true;
            this.is_dragging = MyMath.is_dragging({x: this.state.mouse_x, y: this.state.mouse_y},this.selector);
            this.initial_click_position = Util.screen_to_world(this.stage);
            this.copied_entities = [];
            if(this.selector !== null) {this.selector.set_offset();}
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

        this.is_drawing = false;
        // console.log(this.entities[this.entities.length-1]);
        if(this.state.mode === Constants.MODE.TEXT){
            this.no_mode();
        }

        console.log(this.entities);
    }

    _onMouseMove = e =>{
        this.stage = e.currentTarget;

        this.setState({mouse_x: Util.screen_to_world(this.stage).x});
        this.setState({mouse_y: Util.screen_to_world(this.stage).y});
        if(this.is_drawing && this.mouse_down)
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
                    this.new_entity = new MLine(Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness);
                    break;
                case Constants.MODE.LINE:
                    //update only last position
                    this.new_line_position[0] = this.initial_click_position.x;
                    this.new_line_position[1] = this.initial_click_position.y;
                    this.new_line_position[2] = Util.screen_to_world(this.stage).x;
                    this.new_line_position[3] = Util.screen_to_world(this.stage).y;

                    //create new line
                    this.new_entity = new MLine(Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness);
                    break;
                case Constants.MODE.CIRCLE:
                    var radius = Math.sqrt(dx*dx + dy*dy);
                    this.new_line_position[0] = Util.screen_to_world(this.stage).x;
                    this.new_line_position[1] = Util.screen_to_world(this.stage).y;

                    this.new_entity = new MCircle(Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness,radius);
                    break;
                case Constants.MODE.RECTANGLE:
                    this.new_line_position[0] = this.initial_click_position.x;
                    this.new_line_position[1] = this.initial_click_position.y;

                    this.new_entity = new MRect(Util.next_key(this.entities),this.new_line_position,this.state.color,this.state.thickness,width,height);
                    break;
                case Constants.MODE.SELECT:
                    if(this.is_dragging) { this.is_drawing = false; break;}
                    let new_points = [this.initial_click_position.x,this.initial_click_position.y];

                    this.selector = new Selector(new_points,Constants.SELECT_COLOR,this.state.thickness,width,height);
                    this.selector.fill = true;
                    this.selector.opacity = Constants.SELECT_OPACITY;

                    //calculate collision for every entity on the board
                    for(var i in this.entities)
                    {
                        let current_entity = this.entities[i];
                        if(current_entity !== null)
                        {
                            current_entity.selected = MyMath.collision_check(current_entity,this.selector);
                            if(current_entity.selected) { this.selector.attach(current_entity);}
                            else{this.selector.dettach(current_entity);}
                        }
                    }
                    
                    this.selector.set_offset();

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
                case Constants.MODE.NONE:
                    break;
                default:
                     //if mode doesnt create new entity, set it to null
                    break;
            }
            this.entities[this.current_position] = this.new_entity;

            this.stage.batchDraw();

            //set the last mouse coordinates
            this.setState((state) =>({last_mouse_x: state.mouse_x}));
            this.setState((state) =>({last_mouse_y: state.mouse_y}));
            return;
        }

        if(this.is_dragging && this.mouse_down)
        {
            this.selector.move({x:this.state.mouse_x, y: this.state.mouse_y},this.initial_click_position,this.socket);
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

    _onDragOver = e =>{
        e.preventDefault();
    }

    _onDrop = e =>{
        this.no_mode();
        e.preventDefault();
        e.stopPropagation();

        let x = e.clientX;
        let y = e.clientY;
        let position = {x: x, y:y};
        let new_position = (this.stage === null)? position : Util.screen_to_world_point(this.stage,position);

        let files = e.dataTransfer.files;

        if(files.length > 0){
            let file = files[0];
            if(file.type !== "image/png" && file.type !== "image/jpeg"){
                return;
            }
            let url = URL.createObjectURL(file);
            let image = new window.Image();
            image.src = url;

            this.new_entity = new MField(Util.next_key(this.entities),
            [new_position.x,new_position.y],url,this.state.current_scale ** -1,image);
            this.entities = [this.new_entity,...this.entities];
            this.emit_data();
            this.new_entity = null;

            return;
        }
        
        let data = JSON.parse(e.dataTransfer.getData("element"));

        this.new_entity = new MField(Util.next_key(this.entities),
        [new_position.x,new_position.y],data.src,this.state.current_scale ** -1);
        this.entities = [this.new_entity,...this.entities];
        this.emit_data();
        this.new_entity = null;

        this.mathlistRef.current.delete(data.id);
    }

    _onStageClick(e){
        let clickedOn = e.target;
        if('className' in clickedOn.attrs)
        {
            if(this.state.selected_entity.konva_object){
                this.socket.emit('canvas-data-edit',{key: this.state.selected_entity.custom_object.key,
                    attrs: this.state.selected_entity.konva_object.attrs});
            }
            if(clickedOn.attrs.className === "board-stage") {this.setState({selected_entity: {konva_object: null, custom_object: null}})}
        }
    }


    update_select_panel(stage)
    {
      if(!Util.is_there_selector(this.entities)) {return;}
      if(this.entities[this.entities.length - 1] === null) {return;}

      let width = this.entities[this.entities.length - 1].width;
      let height = this.entities[this.entities.length - 1].height;


      let x = (width > 0) ? this.entities[this.entities.length - 1].points[0] : this.entities[this.entities.length - 1].points[0] + width;
      let y = (height > 0 ) ? this.entities[this.entities.length - 1].points[1] : this.entities[this.entities.length - 1].points[1] + height;

      let scale =  stage.scaleX();


      let offset_x = 40;
      let offset_y = 130;

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

    move_data_callback = (key,points) =>{
        this.socket.emit(Constants.CANVAS_DATA_MOVE,{key: key,points: points});
    }

    edit_data_callback = (data) => {
        let to_emit = {key: data.key,attrs: data.attrs};
        to_emit = Util.clone_object(to_emit);
        to_emit.attrs.text = data.text;
        this.socket.emit('canvas-data-edit',to_emit);
    }

    new_data_callback = (data) => {
        this.new_entity = null;
        this.socket.emit(Constants.CANVAS_DATA,data);
        this.current_position ++;
    }

    select_image_callback = (data) => {
        this.setState({selected_entity: data});
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

    no_mode(){
        this.setState({mode: Constants.MODE.NONE});
    }

    paste_selected(offset)
    {
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
    }

    change_color(in_color){this.setState({color: in_color}); }
    change_size(in_size) {this.setState({thickness: in_size}); }
    change_mode(in_mode){this.setState({mode: in_mode});}
    create_room(){ this.socket.emit('new-room',{content: this.entities,pointer: this.current_position}); }
    load_entities(data){
        try{
            for(var i in data){
                this.entities.push(Util.retrieve_object(data[i]));
            }
            this.current_position = this.entities.length - 1;

        }catch(e)
        {
            console.log(e);
        }
    }

    join = function join_room(room) { this.socket.emit('join-room',room);} 

    render(){
        const items = this.entities;
        return(
            <div className="board" 
             onDrop={e=> this._onDrop(e,"complete")}
             onDragOver={e=> this._onDragOver(e)}
             onContextMenu={(e)=> e.preventDefault()}>
                    <Invite
                        joined={this.state.joined} 
                        link={this.state.invite_link}
                        create_callback={{create_callback: this.create_room.bind(this)}}/>
                    <Panel
                    color_callback={{color_callback: this.change_color.bind(this)}}
                    size_callback={{size_callback: this.change_size.bind(this)}}
                    mode_callback={{mode_callback: this.change_mode.bind(this)}}
                    />
                <div className="select-panel">
                    <SelectPanel
                    data={this.state.select_panel_data}
                    callback_delete={{delete_callback: this.delete_selected.bind(this)}}
                    callback_copy={{copy_callback: this.copy_selected.bind(this)}}
                    />
                </div>
                <div className="math-list-container">
                    <MathList ref={this.mathlistRef}/>
                </div>
                <div className='save-container'>
                    <Save board={this.entities}
                        load_callback={{load: this.load_entities.bind(this)}}/>
                </div>
                
                <Stage className="board-stage"
                width={window.innerWidth} height={window.innerHeight -65}
                onMouseDown ={this._onMouseDown.bind(this)}
                onMouseUp   ={this._onMouseUp.bind(this)}
                onMouseMove ={this._onMouseMove.bind(this)}
                onWheel     ={this._onWheel.bind(this)}
                onClick     ={this._onStageClick.bind(this)}
                >
                    <Layer>
                        {items.map((entity) =>
                        {
                            if(entity instanceof Drawable){ 
                                return (entity.draw(
                                    {move: this.move_data_callback, 
                                     edit: this.edit_data_callback,
                                     create: this.new_data_callback,
                                     select: this.select_image_callback}
                                ))}
                        })}
                        <ImageTransformer selected={this.state.selected_entity}/>
                    </Layer>
                </Stage>
            </div>)
    }
}

export default Board