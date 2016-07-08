export default (refreshLobby, refreshRooms)=> {
    cloak.configure({
        serverEvents: {
            begin: () => {
                cloak.message('setUserUp');
            }
        },
        messages: {
            refreshLobby: arg => {
                refreshLobby(arg);
            },
            updateData: arg => {
                localStorage.id = arg.id;
                localStorage.name = arg.name;
            },
            refreshRooms: arg => {
                refreshRooms(arg);
            }
        },
        initialData: {
            id: localStorage.id,
            name: localStorage.name
        }
    });
}
