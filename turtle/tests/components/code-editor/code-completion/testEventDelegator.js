import { EventDelegator } from '../../../../modules/components/code-editor/code-completion/EventDelegator.js';

class MockSuggestionsUpdater {
	update() {
		
	}
}

function getMockKeyUpEvent() {
	const textarea = document.createElement('textarea');
	textarea.value = 'hello';
	const objectToClone = new KeyboardEvent({
		'type': 'keyup',
		'key': 'e'
	});
	const result = {};
	for (const key in objectToClone) {
		result[key] = objectToClone[key];
	}
	result.target = textarea;
	return result;
}

export function testEventDelegator(logger) {
	const mockSuggestionsUpdater = new MockSuggestionsUpdater();
	const eventDelegator = new EventDelegator(mockSuggestionsUpdater);
	eventDelegator.handleEvent(getMockKeyUpEvent());
	if (typeof eventDelegator.handleLayoutChange !== 'function')
		logger(`Expected handleLayoutChange to be a function but got ${eventDelegator.handleLayoutChange}`);
};