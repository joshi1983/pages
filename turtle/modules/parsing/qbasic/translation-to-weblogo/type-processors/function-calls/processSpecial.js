import { circle, getToName as circleToName } from './circle.js';
import { input } from './input.js';
import { line, getToName as lineToName } from './line.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { point, getToName as pointToName } from './point.js';
import { processSpecialCommand } from '../../../../generic-parsing-utilities/processSpecialCommand.js';
import { preset, getToName as presetToName } from './preset.js';
import { pset, getToName as psetToName } from './pset.js';
import { read } from './read.js';
import { restore } from './restore.js';

const specials = [circle, input, line, point, preset, pset, read, restore];
const specialsNameSet = new Set(specials.map(s => s.name));
const translateToNames = new Map([
	['circle', circleToName],
	['line', lineToName],
	['point', pointToName],
	['preset', presetToName],
	['pset', psetToName]
]);

function tokenToName(token) {
	const firstChild = token.children[0];
	if (firstChild !== undefined &&
	firstChild.type === ParseTreeTokenType.IDENTIFIER)
		return firstChild.val.toLowerCase();
}

const processSpecial = processSpecialCommand(specials, tokenToName);

export function translateToName(token, options) {
	const name = tokenToName(token);
	if (name !== undefined && translateToNames.has(name))
		return translateToNames.get(name)(token, options);
}

export function isSpecial(token) {
	const name = tokenToName(token);
	return specialsNameSet.has(name);
};

export { processSpecial };