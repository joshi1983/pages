import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testConvertToAlphaColourOrTransparent } from './testConvertToAlphaColourOrTransparent.js';
import { testConvertToColourOrTransparent } from './testConvertToColourOrTransparent.js';

export function testDataTypeConverters(logger) {
	testConvertToAlphaColourOrTransparent(prefixWrapper('testConvertToAlphaColourOrTransparent', logger));
	testConvertToColourOrTransparent(prefixWrapper('testConvertToColourOrTransparent', logger));
};