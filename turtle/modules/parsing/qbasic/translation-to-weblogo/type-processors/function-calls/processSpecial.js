import { circle, getToName as circleToName } from './circle.js';
import { input } from './input.js';
import { line, getToName as lineToName } from './line.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processSpecialCommand } from '../../../../generic-parsing-utilities/processSpecialCommand.js';
import { pset, getToName as psetToName } from './pset.js';

const specials = [circle, input, line, pset];
const specialsNameSet = new Set(specials.map(s => s.name));
const translateToNames = new Map([
	['circle', circleToName],
	['line', lineToName],
	['pset', psetToName]
]);

function tokenToName(token) {
	const firstChild = token.children[0];
	if (firstChild !== undefined &&
	firstChild.type === ParseTreeTokenType.IDENTIFIER)
		return firstChild.val.toLowerCase();
}

const processSpecial = processSpecialCommand(specials, tokenToName);

export function translateToName(token) {
	const name = tokenToName(token);
	if (name !== undefined && translateToNames.has(name))
		return translateToNames.get(name)(token);
}

export function isSpecial(token) {
	const name = tokenToName(token);
	return specialsNameSet.has(name);
};

export { processSpecial };