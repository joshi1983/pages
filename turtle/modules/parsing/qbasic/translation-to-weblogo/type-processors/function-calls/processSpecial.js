import { circle, getToName as circleToName } from './circle.js';
import { input } from './input.js';
import { left$ } from './left$.js';
import { line, getToName as lineToName } from './line.js';
import { line_input } from './line_input.js';
import { mid$, getToName as mid$ToName } from './mid$.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { point, getToName as pointToName } from './point.js';
import { processSpecialCommand } from '../../../../generic-parsing-utilities/processSpecialCommand.js';
import { preset, getToName as presetToName } from './preset.js';
import { pset, getToName as psetToName } from './pset.js';
import { read } from './read.js';
import { restore } from './restore.js';
import { space$, getToName as space$ToName } from './space$.js';
import { swap } from './swap.js';
import { tab, getToName as tabToName } from './tab.js';

const specials = [circle, input, left$, line, line_input, mid$, point,
	preset, pset, read, restore, space$, swap, tab];
const specialsNameSet = new Set(specials.map(s => s.name));
const translateToNames = new Map([
	['circle', circleToName],
	['line', lineToName],
	['mid$', mid$ToName],
	['point', pointToName],
	['preset', presetToName],
	['pset', psetToName],
	['space$', space$ToName],
	['tab', tabToName],
]);

function tokenToName(token) {
	const firstChild = token.children[0];
	if (firstChild !== undefined) {
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
			return firstChild.val.toLowerCase();
		else if (firstChild.type === ParseTreeTokenType.COMPOSITE_IDENTIFIER) {
			return firstChild.children.map(t => t.val.toLowerCase()).join('_');
		}
	}
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