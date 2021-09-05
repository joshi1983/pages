import { testClipboardHelper } from './testClipboardHelper.js';

function runTests(logger) {
	testClipboardHelper(logger);
}

export function bindDocumentFocusTests(logger) {
	const button = document.getElementById('runTestsRequiringDocumentFocus');
	button.addEventListener('click', function() {
		runTests(logger);
	});
}