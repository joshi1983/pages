import { testConvertToAlphaColourOrTransparent } from './testConvertToAlphaColourOrTransparent.js';
import { testConvertToColourOrTransparent } from './testConvertToColourOrTransparent.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testDataTypeConverters(logger) {
	wrapAndCall([
		testConvertToAlphaColourOrTransparent,
		testConvertToColourOrTransparent
	], logger);
};