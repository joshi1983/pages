import { CodeEditor } from '../CodeEditor.js';
import { Dialog } from '../Dialog.js';
import { fetchText } from '../../fetchText.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { scrapeProceduresFromParseTreeTokens } from '../../parsing/parse-tree-analysis/scrapeProceduresFromParseTreeTokens.js';
import { Settings } from '../../Settings.js';
import { ToastMessages } from '../ToastMessages.js';
const setupHTML = await fetchText('content/components/code-editor/set-up-animation.html');
const item = CodeEditor.editor.querySelector('#editor-setup-animation');

// parsing can be a little slow so we cache the tree until the code changes.
const disableCheckCache = new Map();

function getAnimationStyleSnapshotCode() {
	// if there is no 
	if (doesProcedureExist('animation.snapshotstyle'))
		return '';
	else
		return `to animation.snapshotstyle
	localmake "result plistCreate
	output :result
end

`;
}

function getAnimationSetupProcedureCode(minutes, seconds) {
	return `to animation.setup
	localmake "minutes ${minutes}
	localmake "seconds ${seconds}
	; Edit this if you want to change the length of your animation.
	output :minutes * 60 + :seconds
end
`;
}

function sanitizeMinutes(minutes) {
	return parseInt(minutes.trim());
}

function sanitizeSeconds(seconds) {
	return parseFloat(seconds.trim());
}

function setupClicked() {
	let minutes;
	let seconds;
	let addButton;
	Dialog.show(setupHTML, 'Animation Wizard', 350, 200, {
		'disableResize': true,
		'okCaption': 'Add animation.setup',
		'okClicked': function() {
			if (!addButton.hasAttribute('disabled')) {
				let min = sanitizeMinutes(minutes.value);
				let sec = sanitizeSeconds(seconds.value);

				// if user inputted the seconds directly through text, it could go past the 60 max value.
				if (sec >= 60) {
					min += Math.floor(sec / 60);
					sec = sec % 60;
				}
				const extraCode = getAnimationStyleSnapshotCode() + getAnimationSetupProcedureCode(min, sec);
				const existingCode = CodeEditor.getSourceCode().trim();
				const newCode = existingCode + '\n\n' + extraCode;
				CodeEditor.setSourceCode(newCode);
				const lineIndex = newCode.split('\n').length - 1;
				CodeEditor.textElement.setCursorPosition(0, lineIndex);
				const durationSeconds = min * 60 + sec;
				Settings.animationDurationSeconds = durationSeconds;
				ToastMessages.success(`Added new animation.setup procedure that outputs ${durationSeconds} second(s)`, false);
			}
		},
		'showCancel': true
	});
	minutes = document.getElementById('set-up-animation-minutes');
	seconds = document.getElementById('set-up-animation-seconds');
	addButton = document.getElementById('dialog-footer-ok');
	function updateAddButtonEnabled() {
		const min = sanitizeMinutes(minutes.value);
		const secs = sanitizeSeconds(seconds.value);
		let title = 'Add animation.setup procedure to your code';
		addButton.setAttribute('disabled', '');
		if (!Number.isInteger(min) || min < 0)
			title = 'Minutes must be an integer at least 0';
		else if (isNaN(secs) || secs < 0)
			title = 'Seconds must be a number at least 0';
		else if (secs === 0 && min === 0)
			title = 'An animation that immediately ends is not much of an animation';
		else {
			addButton.removeAttribute('disabled');
		}
		addButton.setAttribute('title', title);
	}
	minutes.addEventListener('input', updateAddButtonEnabled);
	seconds.addEventListener('input', updateAddButtonEnabled);
}

function getTree() {
	const code = CodeEditor.getSourceCode().trim();
	if (!disableCheckCache.has(code)) {
		disableCheckCache.clear();
		const parseLogger = new ParseLogger();
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (parseLogger.hasLoggedErrors())
			disableCheckCache.set(code, undefined);
		else
			disableCheckCache.set(code, tree);
	}
	return disableCheckCache.get(code);
}

function doesProcedureExist(procName) {
	const tree = getTree();
	if (tree === undefined)
		return false;

	return scrapeProceduresFromParseTreeTokens(tree).some(p => p.name === procName);
}

function isAlreadySetup() {
	return doesProcedureExist('animation.setup');
}

function isUnableToParse() {
	return getTree() === undefined;
}

function refreshDisabled() {
	let title = 'Start animating this drawing by adding an animation.setup procedure';
	if (isUnableToParse()) {
		title += ' (Fix your code errors first)';
		item.setAttribute('disabled', '');
	}
	else if (isAlreadySetup()) {
		title += ' (Already set up)';
		item.setAttribute('disabled', '');
	}
	else {
		item.removeAttribute('disabled');
	}
	item.setAttribute('title', title);
}

item.addEventListener('click', setupClicked);
setInterval(refreshDisabled, 2000);