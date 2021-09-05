import { testBindKeyboardShortcutListener } from
'./testBindKeyboardShortcutListener.js';
import { testWrapTurtleState } from
'./testWrapTurtleState.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testShortcuts(logger) {
	wrapAndCall([
		testBindKeyboardShortcutListener,
		testWrapTurtleState
	], logger);
};