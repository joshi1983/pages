import { CodeEditor } from '../CodeEditor.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';

export class EdAllAction {
	matches(tokens) {
		return tokens.filter(t => typeof t.s === 'string' && t.s.toLowerCase() === 'edall').length !== 0;
	}

	perform(tokens) {
		if (tokens.length > 1)
			CommandBoxMessages.warn('The code editor is being opened because you typed "edall" but any other code is being ignored.', false);
		else if (CodeEditor.isVisible)
			CommandBoxMessages.warn('The code editor is already open.', false);
		else {
			CommandBoxMessages.print('Opening code editor', false);
		}
		CodeEditor.show();
	}
};