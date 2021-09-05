import { processTestCase } from './processTestCase.js';
import { replaceSpecialQuoteCharactersWithNormalQuotes } from '../../../../../modules/components/code-editor/code-fixer/fixers/replaceSpecialQuoteCharactersWithNormalQuotes.js';

export function testReplaceSpecialQuoteCharactersWithNormalQuotes(logger) {
	const cases = [
		{'code': 'print "hi', 'to': 'print "hi', 'logged': false},
		{'code': 'print “hi', 'to': 'print "hi', 'logged': true},
		{'code': 'print ”hi', 'to': 'print "hi', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, replaceSpecialQuoteCharactersWithNormalQuotes, logger);
	});
};