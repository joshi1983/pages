import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testHighlighter } from './testHighlighter.js';
import { testProcessColorStringLiterals } from './testProcessColorStringLiterals.js';
import { testProcessStringHyperlinks } from './testProcessStringHyperlinks.js';
import { testUnwrapStringValue } from './testUnwrapStringValue.js';

export function testHighlighters(logger) {
	testHighlighter(prefixWrapper('testHighlighter', logger));
	testProcessColorStringLiterals(prefixWrapper('testProcessColorStringLiterals', logger));
	testProcessStringHyperlinks(prefixWrapper('testProcessStringHyperlinks', logger));
	testUnwrapStringValue(prefixWrapper('testUnwrapStringValue', logger));
};