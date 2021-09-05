import { processFixerTestCases } from
'./processFixerTestCases.js';
import { simplifyBreaks } from
'../../../../../modules/parsing/processing/translation-to-weblogo/simplifying/simplifyBreaks.js';

export function testSimplifyBreaks(logger) {
	const cases = [
		{'code': 'while true {}',
		'to': 'while true {}'
		},
		{'code': 'while (true) {}',
		'to': 'while (true) {}'
		},
		{'code': 'while true {break;}',
		'to': 'while true {break;}'
		},
		{'code': 'while true {break;println("hi");}',
		'to': 'while true {break;}'
		},
		{'code': 'while true {break;println("hi");println("yo");}',
		'to': 'while true {break;}'
		},
	];
	processFixerTestCases(cases, simplifyBreaks, logger);
};