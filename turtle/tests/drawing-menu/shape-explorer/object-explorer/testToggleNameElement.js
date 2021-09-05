import { ToggleNameElement } from '../../../../modules/drawing-menu/shape-explorer/object-explorer/ToggleNameElement.js';

export function testToggleNameElement(logger) {
	const toggleNameElement = new ToggleNameElement('hello');
	toggleNameElement.toggleExpand();
	const div = toggleNameElement.toDiv();
	if (!(div instanceof Element))
		logger('div expected to be an Element.  Not: ' + div);
	toggleNameElement.toggleExpand();
	toggleNameElement.unbind();
};