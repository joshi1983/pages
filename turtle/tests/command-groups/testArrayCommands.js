import { ArrayCommands } from '../../modules/command-groups/ArrayCommands.js';
import { ListCommands } from '../../modules/command-groups/ListCommands.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

function testSetItem(logger) {
	const a = new ArrayCommands();
	const list = new ListCommands();
	const array = [];
	a.setItem(1, array, 5);
	if (array[0] !== 5)
		logger(`Expected 5 but got ${array[0]} at index 0`);
	if (list.item(1, array) !== 5)
		logger(`Expected to get 5 from list index 1 but got ${list.item(1, array)}`);
}

export function testArrayCommands(logger) {
	testSetItem(prefixWrapper('testSetItem', logger));
};