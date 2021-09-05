import { processTestCases } from
'../../../../components/code-editor/code-fixer/fixers/processTestCases.js';
import { removeUnwantedForevers } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/removeUnwantedForevers.js';

export function testRemoveUnwantedForevers(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'forever [break]', 'logged': false},
		{'code': 'forever []', 'to': ' ', 'logged': true},
		{'code': 'forever [print "hi]', 'to': ' print "hi', 'logged': true},
	];
	processTestCases(cases, removeUnwantedForevers, logger);
};