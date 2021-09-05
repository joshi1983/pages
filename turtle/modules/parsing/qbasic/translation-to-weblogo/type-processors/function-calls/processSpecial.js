import { _cv, getToName as _cvToName } from './_cv.js';
import { _mk$, getToName as _mk$ToName } from './_mk$.js';
import { _palettecolor, getToName as _palettecolorGetToName } from './_palettecolor.js';
import { _rgb, getToName as _rgbToName } from './_rgb.js';
import { _rgb32, getToName as _rgb32ToName } from './_rgb32.js';
import { circle, getToName as circleToName } from './circle.js';
import { color } from './color.js';
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
import { screen } from './screen.js';
import { space$, getToName as space$ToName } from './space$.js';
import { stop } from './stop.js';
import { swap } from './swap.js';
import { tab, getToName as tabToName } from './tab.js';

const specials = [_cv, _mk$, _palettecolor, _rgb, _rgb32,
	circle, color, input, left$,
	line, line_input, mid$, point, preset, pset, read,
	restore, screen, space$, stop, swap, tab];
const specialsNameSet = new Set(specials.map(s => s.name));
const translateToNames = new Map([
	['_cv', _cvToName],
	['_mk$', _mk$ToName],
	['_palettecolor', _palettecolorGetToName],
	['_rgb', _rgbToName],
	['_rgb32', _rgb32ToName],
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