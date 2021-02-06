module.exports = {
    is_room: function(rooms,current_room)
    {
        for(var i in rooms)
        {
            if(rooms[i] === current_room) {return true;}
        }
        
        return false;
    }
}