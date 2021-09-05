import { RepcountStackItem } from '../../../modules/debugging/debugger/RepcountStackItem.js';

function testCreateColumnLabels(logger) {
	const labels = RepcountStackItem.createColumnLabels();
	if (!(labels instanceof Element))
		logger('createColumnLabels() expected to return an Element but got ' + labels);
}

function testConstructorAndMethods(logger) {
	const repcountObject = {
		'current': 1,
		'max': 3
	};
	const item = new RepcountStackItem(repcountObject);
	const div = item.getDiv();
	if (div.textContent.indexOf('3') === -1)
		logger('RepcountStackItem div expected to contain a 3 but not found in "' + div.textContent + '"');
	if (div.textContent.indexOf('1') === -1)
		logger('RepcountStackItem div expected to contain a 1 but not found in "' + div.textContent + '"');
	repcountObject.current = 2;
	const div2 = item.getDiv();
	if (div.textContent.indexOf('2') === -1)
		logger('RepcountStackItem div expected to contain a 2 but not found in "' + div2.textContent + '"');
	if (div.textContent.indexOf('3') === -1)
		logger('RepcountStackItem div expected to contain a 3 but not found in "' + div.textContent + '"');
}

export function testRepcountStackItem(logger) {
	testCreateColumnLabels(logger);
	testConstructorAndMethods(logger);
};