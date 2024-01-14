import { count } from './count.js';
import { createPList } from './createPList.js';
import { item } from './item.js';

const commandsMap = new Map([
['count', count],
['createPList', createPList],
['item', item]
]);

export function translateSpecialCommandCall(commandInfo, args) {
	const func = commandsMap.get(commandInfo.primaryName);
	if (func === undefined)
		return;
	return func(args);
};