import { browserHistory } from 'react-router';

class RoutingService {
	navigateToRoom(room) {
	    browserHistory.push(`/room/${room}`);
	}

	navigateToLobby() {
		browserHistory.push('/');
	}

	redirect(path) {
		window.location = path;
	}
}

var router = new RoutingService();
export default router;
