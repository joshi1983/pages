import { Command } from
'../../../../../../../modules/parsing/Command.js';
import { processTestCases } from
'../../processTestCases.js';
import { simplyByUnwrappingTokens } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplyByUnwrappingTokens.js';

await Command.asyncInit();

export function testSimplyByUnwrappingTokens(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print ln exp :x',
			'to': 'print   :x',
			'logged': true},
		{'code': 'print exp ln :x',
			'to': 'print   :x',
			'logged': true},
		{'code': 'print abs abs :x',
			'to': 'print  abs :x',
			'logged': true},
		{'code': 'print int int :x',
			'to': 'print  int :x',
			'logged': true},
		{'code': 'print ceiling ceiling :x',
			'to': 'print  ceiling :x',
			'logged': true},
		{'code': 'print round ceiling :x',
			'to': 'print  ceiling :x',
			'logged': true},
		{'code': 'print round round :x',
			'to': 'print  round :x',
			'logged': true},
	];
	processTestCases(cases, simplyByUnwrappingTokens, logger);
};