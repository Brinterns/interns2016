import { browserHistory } from 'react-router';

class RoutingService {
	navigateToRoom(room) {
	    browserHistory.push(`/room/${room}`);
	}

	navigateToLobby() {
		browserHistory.push('/');
	}
}

var router = new RoutingService();
export default router;
