module.exports={
    create_room: function(id) {
        return{
            id:id,
            content: [],
            pointer: 0
        }
    }
}