import { processFixerTestCases } from
'./processFixerTestCases.js';
import { simplifyReturns } from
'../../../../../modules/parsing/processing/translation-to-weblogo/simplifying/simplifyReturns.js';

export function testSimplifyReturns(logger) {
	const cases = [
		{'code': 'void f() {return;}',
		'to': 'void f() {}'
		},
		{'code': 'void f() {return;println("hi")}',
		'to': 'void f() {}'
		},
		{'code': 'int f() {return 3;println("hi")}',
		'to': 'int f() {return 3;}'
		},
	];
	processFixerTestCases(cases, simplifyReturns, logger);
};