export function configureAndRun(refreshLobby, refreshRooms, refreshRoomUsers, address) {
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
            },
            refreshRoomUsers: arg => {
                refreshRoomUsers(arg);
            }
        },
        initialData: {
            id: localStorage.id,
            name: localStorage.name
        }
    });
    cloak.run(address);
}
