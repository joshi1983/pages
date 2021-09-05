import { Command } from '../Command.js';

const pathCommandNames = Command.getCommandsMatchingSearchKeywords(["path"]).
	map(info => info.primaryName).
	filter(name => ['closePath', 'polyEnd', 'polyStart'].indexOf(name) === -1);
const pathCommandNamesStr = pathCommandNames.join(', ');

export { pathCommandNames, pathCommandNamesStr };