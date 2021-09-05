import { convertToColourOrTransparent } from '../../../../../modules/parsing/execution/instructions/data-type-converters/convertToColourOrTransparent.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testConvertToColourOrTransparent(logger) {
	const cases = [
		{'in': Transparent, 'out': Transparent}
	];
	testInOutPairs(cases, convertToColourOrTransparent, logger);
};