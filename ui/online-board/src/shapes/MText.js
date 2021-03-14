import { Drawable } from "./Drawable";
import {Text} from 'react-konva';
import React from 'react';

export class MText extends Drawable{
    constructor(key,points,font_size,text,scale,is_copy,color='#000000')
    {
        super('Text',key,points);
        this.font_size = font_size;
        this.text = text;
        this.width = 100;
        this.height = 100;
        this.scaleX = this.scaleY = scale;
        this.ref = React.createRef();
        this.edit = false;
        this.edit_displayed = false;
        this.color = color;
        this.newly_created = true;
        this.is_copy = is_copy;
        this.rotation = 0;

        this.update_data = null;

        if(!this.is_copy){
            this.create_edit(null);
        }
    }

    draw(callback=null)
    {
        if(this.newly_created && !this.is_copy && this.ref){
            this.newly_created = false;
            callback.create(this);
            this.create_edit(callback);
        }

        if(this.update_data && this.ref.current){
            this.points[0] = this.update_data.x;
            this.points[1] = this.update_data.y;
            this.scaleX = this.update_data.scaleX;
            this.scaleY = this.update_data.scaleY;
            this.rotation = this.update_data.rotation;
            this.text = this.update_data.text;
            this.update_data = null;
        }

        return(
                <Text
                key={this.key}
                x={this.points[0]}
                y={this.points[1]}
                text={this.text}
                scaleX={this.scaleX}
                scaleY={this.scaleY}
                rotation={this.rotation}
                fontSize={this.font_size}
                ref={this.ref}
                fill={this.color}
                draggable={true}
                onDblClick={()=>{
                    this.create_edit(callback);
                    this.edit_displayed = true;
                    
                }}
                onDragEnd={(e)=>{
                    if(callback!== null){
                        callback.move(this.key,[e.target.attrs.x,e.target.attrs.y]);
                    }
                }}
                onClick={(e)=>{
                    callback.select({konva_object: e.target, custom_object: this}); 
                }}
                />
            )
    }

    update(attrs){
        this.update_data = attrs;
    }

    create_edit(callback){
        if(this.edit_displayed) {return;}
        let node = this.ref.current;
        let edit_text = document.createElement('textarea');
        edit_text.id = 'temp-edit-node';
        let position = {x: this.points[0], y: this.points[1]};
        edit_text.value = "";
        if(node !== null){
            position = node.getAbsolutePosition();
            edit_text.value = node.getText();
        }
        this.edit = !this.edit;
        edit_text.style.position = 'absolute';
        edit_text.style.top = position.y + 'px';
        edit_text.style.left = position.x + 'px';
        edit_text.style.zIndex = 2;
        edit_text.focus();
        document.body.appendChild(edit_text);
        edit_text.addEventListener('focusout', () =>{
            this.text = edit_text.value;
            document.body.removeChild(edit_text);
            this.edit_displayed = false;

            if(callback !== null){
                callback.edit({key: this.key,attrs: this.ref.current.attrs,text: this.text});
            }
            
            let edit_node = document.getElementById('temp-edit-node');
            if(edit_node !== null) {document.body.removeChild(edit_node);}
        })
    }

    get_offset() 
    {
        return {width: this.width, height:this.height}
    }

    to_rect()
    {
        this.width = this.ref.current.width();
        this.height = this.ref.current.height();
        return {
            points: this.points,
            width: this.width,
            height: this.height,
        }
    }
};