import { Dialog } from '../Dialog.js';
import { DialogGroups } from '../dialog/DialogGroups.js';
import { EventQueue } from '../EventQueue.js';
import { fetchText } from '../../fetchText.js';
import { itemClicked } from './autoFixCodeMenuItem.js';
import { RateLimiter } from '../../RateLimiter.js';
const html = await fetchText('content/components/code-editor/autofix-prompt.html');
let lastCancelTime = 0;
const cancelPersistenceThreshold = 5000;
/* 5 seconds of time between hitting 'No' to autofix
 and the next time it can be more thoroughly checked.
 This is to prevent annoying users with too many confirmations for the same code.
*/

function isCodePasteEvent(e) {
	return e.info.type === 'paste';
}

function isReplacingMostCode(e) {
	if (typeof e.info === 'object')
		e = e.info;
	if (typeof e.pastedString === 'string') {
		const textarea = e.target;
		if (e.pastedString.length < textarea.value.length / 2)
			return false;
	}
	return true;
}

function isGoodQualityAutofixResult(e) {
	// translating to empty code is a strong indication of a bad autofix.
	if (e.fixedCode === '')
		return false;
	return true;
}

function isAutofixable(events) {
	for (let i = events.length - 1; i >= 0; i--) {
		const e = events[i];
		if (e.info.type === 'no-autofix')
			return false;
		else if (e.info.type === 'autofix')
			return isGoodQualityAutofixResult(e);
	}
	return false;
}

function hasParseErrors(events) {
	for (let i = events.length - 1; i >= 0; i--) {
		const e = events[i];
		if (e.info.type === 'no-parse-errors')
			return false;
		else if (e.info.type === 'parse-errors')
			return true;
	}
	return false;
}

function shouldShowAutofixPrompt() {
	if (new Date().getTime() - lastCancelTime < cancelPersistenceThreshold)
		return false;
	let events = EventQueue.getEvents();
	let i;
	for (i = events.length - 1; i >= 0; i--) {
		const e = events[i];
		if (isCodePasteEvent(e)) {
			if (!isReplacingMostCode(e))
				return false;
			break;
		}
	}
	if (i < 0)
		return false; // no code paste event found.
	events = events.slice(i + 1); // we only care about events after the last paste.
	if (!hasParseErrors(events))
		return false;
	if (!isAutofixable(events))
		return false;
	return true;
}

function refreshShowAutofixPrompt() {
	if (shouldShowAutofixPrompt())
		showAutofixPrompt();
}

function delayedRefreshShowAutofixPrompt() {
	RateLimiter.run('autofix-prompt-refresher', refreshShowAutofixPrompt, 300);
}

function showAutofixPrompt() {
	Dialog.show(html, 'Autofix Confirmation', undefined, undefined, {
		'cancelCaption': 'No',
		'cancelClicked': function() {
			lastCancelTime = new Date().getTime();
			Dialog.hide();
		},
		'disableResize': true,
		'groupId': DialogGroups.CONFIRMATION,
		'showCancel': true,
		'okCaption': 'Yes',
		'okClicked': function() {
			itemClicked();
			Dialog.hide();
		}
	});
};

EventQueue.addEventListener('change', delayedRefreshShowAutofixPrompt);