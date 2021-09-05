import { compareTokenLocations } from '../compareTokenLocations.js';

function getTokenFrom(val) {
	if (val.nameToken === undefined)
		return val;
	else
		return val.nameToken;
}

export function compareProcedureLocationAndToken(val1, val2) {
	val1 = getTokenFrom(val1);
	val2 = getTokenFrom(val2);
	return compareTokenLocations(val1, val2);
};