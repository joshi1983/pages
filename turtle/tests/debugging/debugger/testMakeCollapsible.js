import { makeCollapsible } from '../../../modules/debugging/debugger/makeCollapsible.js';
import { noop } from '../../helpers/noop.js';

export function testMakeCollapsible(logger) {
	const div = document.createElement('div');
	const h2 = document.createElement('h2');
	div.appendChild(h2);
	makeCollapsible(div, noop);
	if (div.classList.contains('collapsed'))
		logger('The div should be initially not collapsed');
	h2.click();
	if (!div.classList.contains('collapsed'))
		logger('The div should become collapsed after clicking the h2 once');
};