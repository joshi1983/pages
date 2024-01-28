import { PushStates } from './PushStates.js';

function poppedState(event) {
	const state = event.state;
	if (state !== null && typeof state === 'object' && Number.isInteger(state.id)) {
		const callback = PushStates.getCallback(state.id);
		if (callback !== undefined)
			callback();
	}
}

addEventListener('popstate', poppedState);