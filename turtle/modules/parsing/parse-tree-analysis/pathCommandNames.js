import { Command } from '../Command.js';
await Command.asyncInit();

const pathCommandNames = Command.getCommandsMatchingSearchKeywords(["path"]).
	map(info => info.primaryName).
	filter(name => ['closePath', 'polyEnd', 'polyStart'].indexOf(name) === -1);
pathCommandNames.push('jumpTo');
const pathCommandNamesStr = pathCommandNames.join(', ');

export { pathCommandNames, pathCommandNamesStr };