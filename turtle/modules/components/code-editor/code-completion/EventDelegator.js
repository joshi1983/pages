import { calculateSuggestionContainerPosition } from './calculateSuggestionContainerPosition.js';
import { ClipboardHelper } from '../../../ClipboardHelper.js';

/*
This will decide if specific keyboard and mouse events should:
- open/hide the suggestions SuggestionContainer
- move the suggestions SuggestionContainer
- update suggestions in the SuggestionContainer
*/
const delayInterval = 1000;

export class EventDelegator {
	constructor(suggestionsUpdater) {
		if (typeof suggestionsUpdater !== 'object')
			throw new Error(`suggestionsUpdater must be an object.  not: ${suggestionsUpdater}`);
		this.lastKeyTime = undefined;
		this.suggestionsUpdater = suggestionsUpdater;
	}

	_delayReached() {
		if (this.textarea === undefined)
			return;
		let pos = ClipboardHelper.getCursorPosition(this.textarea);
		const code = this.textarea.value;
		const lines = code.split('\n');
		let lineIndex = 0;
		while (lineIndex < lines.length && lines[lineIndex].length < pos) {
			pos -= lines[lineIndex].length + 1;
			lineIndex++;
		}
		const position = {
			'lineIndex': Math.max(0, lineIndex),
			'colIndex': pos
		};
		calculateSuggestionContainerPosition(this.textarea, position);
		this.suggestionsUpdater.update(position);
		this.cancelTimer();
	}

	cancelTimer() {
		if (this.timer !== undefined) {
			clearTimeout(this.timer);
			this.timer = undefined;
		}
	}

	handleEvent(event) {
		if (event.target instanceof Element &&
		event.target.tagName === 'TEXTAREA')
			this.textarea = event.target;
		console.log('event=', event);
		if (event.type === 'keyup') {
			this.lastKeyTime = new Date().getTime();
			this.resetTimer();
		}
	}

	resetTimer() {
		this.cancelTimer();
		const outer = this;
		this.timer = setTimeout(function() {
			outer._delayReached();
		}, delayInterval);
	}
};