import { getTitleForHelpID, isValidHelpID, showGeneralHelpContent } from './showGeneralHelpContent.js';

function getHelpIDFromElement(e) {
	e = e.closest('[data-helpid]');
	return e.getAttribute('data-helpid');
}

function showGeneralHelpContentForHelpID(event) {
	if (!event)
		event = window.event;
	const helpId = getHelpIDFromElement(event.target);
	showGeneralHelpContent(helpId);
}

processHelpIds();

export function processHelpIds(e) {
	if (e === undefined)
		e = document;
	else if (!(e instanceof Element))
		throw new Error('e must either be undefined or an Element');
	const elements = e.querySelectorAll('[data-helpid]');
	elements.forEach(function(childE) {
		const helpID = getHelpIDFromElement(childE);
		if (!isValidHelpID(helpID))
			throw new Error('Unrecognized helpid: "' + helpID + '"');
		childE.addEventListener('click', showGeneralHelpContentForHelpID);
		if (!childE.hasAttribute('title'))
			childE.setAttribute('title', 'Click to get help on ' + getTitleForHelpID(helpID));
	});
};