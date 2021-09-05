import { ArrayCommands } from './ArrayCommands.js';
import { ListCommands } from './ListCommands.js';
import { MathCommands } from './MathCommands.js';
import { PropertyListCommands } from './PropertyListCommands.js';
import { StringCommands } from './StringCommands.js';

export function getCommandGroups(turtle) {
	const result = new Map();
	result.set('array', new ArrayCommands());
	result.set('turtle', turtle);
	result.set('list', new ListCommands());
	result.set('math', new MathCommands());
	result.set('plist', new PropertyListCommands());
	result.set('string', new StringCommands());
	return result;
};