import { ArrayUtils } from '../ArrayUtils.js';
import { EventDispatcher } from '../EventDispatcher.js';

const events = [];
const maxAge = 3000; // miliseconds

function removeOldEvents() {
	const nowTime = new Date().getTime();
	ArrayUtils.remove(events, function(e) {
		return nowTime - e.t <= maxAge;
	});
}

class QueueEvent {
	constructor(info) {
		if (typeof info !== 'object')
			throw new Error(`info must be an object.  Not: ${info}`);
		this.t = new Date().getTime();
		this.info = info;
	}
};

/*
This is a singleton maintaining events triggered by things the end-user does.
There are a few situations that are hard to detect through low-level single events.
For example, if a user pastes code from a website into the code editor,
errors are detected in it, and Autofix becomes enabled, we usually want to
ask the user if he/she wants to use autofix.

Since autofix, errors... are all run at intervals and some is asyncronous, we can't detect that by 1 single event.
*/
class PrivateEventQueue extends EventDispatcher {
	constructor() {
		super(['change']);
	}

	addEvent(e) {
		if (typeof e !== 'object')
			throw new Error(`e must be an object.  Not: ${e}`);
		e = new QueueEvent(e);
		removeOldEvents();
		events.push(e);
		super._dispatchEvent('change', {});
	}

	// do not mutate the returned Array.
	// The return value is only for reading purposes.
	getEvents() {
		return events;
	}
}

const EventQueue = new PrivateEventQueue();

export { EventQueue };