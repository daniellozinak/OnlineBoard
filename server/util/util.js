module.exports = {
    is_room: function(rooms,current_room)
    {
        for(var i in rooms)
        {
            if(rooms[i].id === current_room) {return true;}
        }
        
        return false;
    },

    find_room: function(server_rooms,socket_rooms)
    {
        for(var i in server_rooms)
        {
            for (const [key, value] of Object.entries(socket_rooms)) {
                if(key === server_rooms[i].id) { return server_rooms[i]; }
            }
        }

        return null;
    },

    find_room_by_id: function(server_rooms,room_id)
    {
        for(var i in server_rooms)
        {
            if(room_id === server_rooms[i].id) { return server_rooms[i]}
        }
        return null;
    },

    remove_room: function(rooms,to_delete)
    {
        let index = rooms.indexOf(to_delete);
        if(index > -1)
        {
            rooms.splice(index,1);
        }
    },

    move_content: function(current_content,data)
    {
        if(typeof data !== 'object') {return;}
        if(!data.hasOwnProperty('key') || !data.hasOwnProperty('points')){return;}
        for(var i in current_content)
        {
          if(current_content[i].key === data.key)
          {
            current_content[i].points = data.points;
          }
        }
    },

    filter_content: function(current_content)
    {
        if(!Array.isArray(current_content)) {return null;}
        var filtered = current_content.filter(n => n);
        return filtered;
    }
}