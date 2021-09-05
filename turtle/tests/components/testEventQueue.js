import { EventQueue } from '../../modules/components/EventQueue.js';

export function testEventQueue(logger) {
	EventQueue.addEvent({'type': 'paste'});
	EventQueue.addEvent({'type': 'autofix'});
	const events = EventQueue.getEvents();
	if (!(events instanceof Array))
		logger(`Expected getEvents() to return an Array but got ${events}`);
	else if (events.length < 2)
		logger(`Expected at least 2 events but got ${events.length}`);
};