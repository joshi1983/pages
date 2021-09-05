import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { convertToAlphaColourOrTransparent } from '../../../../../modules/parsing/execution/instructions/data-type-converters/convertToAlphaColourOrTransparent.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testConvertToAlphaColourOrTransparent(logger) {
	const cases = [
		{'in': Transparent, 'out': Transparent},
		{'in': [0, 0, 0], 'out': new AlphaColour('black')},
		{'in': 'blue', 'out': new AlphaColour('blue')}
	];
	testInOutPairs(cases, convertToAlphaColourOrTransparent, logger);
};