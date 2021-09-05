import { processTestCase } from './processTestCase.js';
import { defineFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/defineFixer.js';

export function testDefineFixer(logger) {
	const cases = [
		{'code': 'print "Define', 'to': 'print "Define', 'logged': false},
		{'code': 'Define "p [ [size] [ fd :size ]]', 'to': 'to p  :size \n fd :size end', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, defineFixer, logger);
	});
};