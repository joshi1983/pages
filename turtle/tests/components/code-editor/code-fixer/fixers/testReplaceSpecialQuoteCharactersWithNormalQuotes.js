import { processTestCases } from './processTestCases.js';
import { replaceSpecialQuoteCharactersWithNormalQuotes } from '../../../../../modules/components/code-editor/code-fixer/fixers/replaceSpecialQuoteCharactersWithNormalQuotes.js';

export function testReplaceSpecialQuoteCharactersWithNormalQuotes(logger) {
	const cases = [
		{'code': 'print "hi', 'logged': false},
		{'code': 'print “hi', 'to': 'print "hi', 'logged': true},
		{'code': 'print ”hi', 'to': 'print "hi', 'logged': true},
	];
	processTestCases(cases, replaceSpecialQuoteCharactersWithNormalQuotes, logger);
};