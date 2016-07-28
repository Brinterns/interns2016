var storageService = {
	storeName: storeName,
	storeId: storeId,
	getUser: getUser
};

function storeName(username) {
    localStorage.name = username;
}

function storeId(id) {
	localStorage.id = id;
}

function getUser() {
	return {
		id: localStorage.id, 
		name: localStorage.name
	};
}

export default storageService;