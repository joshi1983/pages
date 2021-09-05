import { ListCommands } from '../../modules/command-groups/ListCommands.js';
const list = new ListCommands();

export function testListCommands(logger) {
	const item = list.item(1, [5, 6, 7]);
	if (item !== 5)
		logger(`Expected 5 but got ${item}`);
};