import { processTestCase } from './processTestCase.js';
import { replaceSpecialQuoteCharactersWithNormalQuotes } from '../../../../../modules/components/code-editor/code-fixer/fixers/replaceSpecialQuoteCharactersWithNormalQuotes.js';

export function testReplaceSpecialQuoteCharactersWithNormalQuotes(logger) {
	const cases = [
		{'code': 'print "hi', 'logged': false},
		{'code': 'print “hi', 'to': 'print "hi', 'logged': true},
		{'code': 'print ”hi', 'to': 'print "hi', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, replaceSpecialQuoteCharactersWithNormalQuotes, logger);
	});
};