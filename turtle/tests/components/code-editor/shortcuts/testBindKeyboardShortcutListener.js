import { bindKeyboardShortcutListener } from
'../../../../modules/components/code-editor/shortcuts/bindKeyboardShortcutListener.js';

export function testBindKeyboardShortcutListener(logger) {
	const textarea = document.createElement('textarea');
	function executeShortcutMock() {
		
	}
	bindKeyboardShortcutListener(textarea, executeShortcutMock);
};
