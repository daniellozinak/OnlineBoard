module.exports={
    create_room: function(id) {
        return{
            id:id,
            content: [],
            pointer: 0,
            connected: 1 // when created, creator is already in the room
        }
    }
}