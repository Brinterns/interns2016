var storageService = {
	storeName: storeName,
	storeId: storeId,
	getUser: getUser,
	getRoom: getRoom,
	setRoom: setRoom
};

function storeName(username) {
    localStorage.name = username;
}

function storeId(id) {
	localStorage.id = id;
}

function getUser() {
	return {id: localStorage.id, name: localStorage.name};
}

function setRoom(room) {
	sessionStorage.room = room;
}

function getRoom() {
	return JSON.parse(sessionStorage.room);
}


export default storageService;