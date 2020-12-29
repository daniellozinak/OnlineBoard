import {MLine} from '../shapes/MLine.js';
import {MCircle} from '../shapes/MCircle.js';
import {MRect} from '../shapes/MRect.js';
import {MField} from '../shapes/MField.js';
import * as MyMath from './math.js';

export function filter_empty_array(array)
{
  if(!Array.isArray(array)) {return null;}

  var filtered = array.filter(n => n);
  return filtered;
}

export function is_there_selector(array)
{
  if(!Array.isArray(array)) {return null;}
  let filtered = array.filter(e => e !== null);

  for(var i in filtered)
  {
    let temp_entitiy = filtered[i];
    if(temp_entitiy.key === -1)
    {
      return true;
    }
  }
  return false;
}

export function is_anything_selected(array)
{
  if(!Array.isArray(array)) {return null;}
  let filtered = array.filter(e => e !== null);

  for(var i in filtered)
  {
    let temp_entitiy = filtered[i];
    if(temp_entitiy.selected){ return true; }
  }
  return false;
}

export function next_key(array)
{
  if(!Array.isArray(array)) {return null;}
  let keys = [];
  let filtered = array.filter(e=> e!== null);

  if(filtered.length === 0) {return 0;}
  
  filtered.forEach(e=> keys.push(e.key));
  return Math.max(...keys) + 1;
}

export function retrieve_object(data)
{
    if(data === null) {return null;}
    switch(data.type)
    {
        case "Line":
            return new MLine("Line",data.key,data.points,data.color,data.thickness);
        case "Circle":
            return new MCircle("Circle",data.key,data.points,data.color,data.thickness,data.radius);
        case "Rect":
            return new MRect("Rect",data.key,data.points,data.color,data.thickness,data.width,data.height);
        case "Field":
            return new MField("Field",data.key,data.points,data.src);
        default:
            return null;
    }
}

export function clone_object(data)
{
  return JSON.parse(JSON.stringify(data));
}

export function encode_url(value)
{
  return encodeURIComponent(value).replace("(", "%28").replace(")", "%29");
}

export function select(entities)
{
  let filtered = entities.filter(e=> e !== null);
  let selector = null;
  for(var i in filtered)
  {
    if(filtered[i].key === -1) { selector = filtered[i];}
  }

  if(selector === null || typeof selector === 'undefined'){ return filtered;}


  let cors = MyMath.get_selector(filtered);
  if(cors !== null)
  {
    selector.points[0] = (selector.width > 0)? cors.min_x : cors.max_x;
    selector.points[1] =  (selector.height > 0)? cors.min_y : cors.max_y;
    selector.width = (selector.width > 0)? cors.max_x - cors.min_x: cors.min_x - cors.max_x;
    selector.height = (selector.height > 0)? cors.max_y - cors.min_y: cors.min_y - cors.max_y;
  }
  
  return filtered;
}