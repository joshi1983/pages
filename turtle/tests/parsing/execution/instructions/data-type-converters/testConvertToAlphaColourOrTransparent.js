import { convertToAlphaColourOrTransparent } from '../../../../../modules/parsing/execution/instructions/data-type-converters/convertToAlphaColourOrTransparent.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testConvertToAlphaColourOrTransparent(logger) {
	const cases = [
		{'in': Transparent, 'out': Transparent}
	];
	testInOutPairs(cases, convertToAlphaColourOrTransparent, logger);
};