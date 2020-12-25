export function filter_empty_array(array)
{
  if(!Array.isArray(array)) {return null;}

  var filtered = array.filter(n => n);

  console.log(filtered); 
  return filtered;
}
