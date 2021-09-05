import { isValidIdentifier } from
'./isValidIdentifier.js';
import { SeaTurtleCommands } from
'../SeaTurtleCommands.js';

const invalids = new Set(Array.from(SeaTurtleCommands.getAllNames()));
invalids.add('end');

export function isValidSubroutineName(s) {
	s = s.toLowerCase();
	if (invalids.has(s))
		return false;

	return isValidIdentifier(s);
};