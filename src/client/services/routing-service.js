import { browserHistory } from 'react-router';

class RoutingService {
	navigateToRoom(roomName) {
	    browserHistory.push(`/room/${roomName}`);
	}

	navigateToLobby() {
		browserHistory.push('/');
	}
}

var router = new RoutingService();
export default router;