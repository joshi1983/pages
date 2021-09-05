import('../../modules/components/popStateListener.js');
import { PushStates } from '../../modules/components/PushStates.js';

export function testPushStates(logger) {
	let currentId = -1;
	PushStates.add(function() {
		currentId = 0;
	});
	PushStates.add(function() {
		currentId = 1;
	});
	history.back();
	const delay = 5000;
	setTimeout(function() {
		if (currentId !== 0)
			logger(`currentId expected to be 0 but got ${currentId} after a delay of ${delay}ms.`);
	}, delay);
};