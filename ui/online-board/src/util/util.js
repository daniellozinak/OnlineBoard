import {MLine} from '../shapes/MLine.js';
import {MCircle} from '../shapes/MCircle.js';
import {MRect} from '../shapes/MRect.js';
import {MField} from '../shapes/MField.js';

export function filter_empty_array(array)
{
  if(!Array.isArray(array)) {return null;}

  var filtered = array.filter(n => n);

  console.log(filtered); 
  return filtered;
}

export function is_anything_selected(array)
{
  if(!Array.isArray(array)) {return null;}

  for(var i in array)
  {
    let temp_entitiy = array[i];
    if(temp_entitiy.key === -1)
    {
      return true;
    }
  }
  return false;
}
export function next_key(array)
{
  if(!Array.isArray(array)) {return null;}

  let keys = [];
  array.forEach(function(value,index,array)
  {
    keys.push(value.key);
  });

  if(keys.length === 0){return 0;}

  return Math.max(...keys) + 1;
}

export function get_object(data)
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