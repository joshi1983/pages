import { processFixerTestCases } from
'./processFixerTestCases.js';
import { simplifySwitches } from
'../../../../../modules/parsing/processing/translation-to-weblogo/simplifying/simplifySwitches.js';

export function testSimplifySwitches(logger) {
	const cases = [
		{'code': 'switch (1) { }',
		'to': ''
		},
		{'code': 'switch (1) { default: println("hello");}',
		'to': 'switch (1) { default: println("hello");}'
		},
		{'code': 'switch (1) { case 1: default: println("hello");}',
		'to': 'switch (1) { default: println("hello");}'
		},
		{'code': 'switch (1) { case 0: println("hi"); default: }',
		'to': 'switch (1) { case 0: println("hi"); }'
		},
		{'code': 'switch (1) { case 0: println("hi"); case 1: }',
		'to': 'switch (1) { case 0: println("hi"); }'
		},
		{'code': 'switch 1 { case 0: println("hi"); case 1: }',
		'to': 'switch (1) { case 0: println("hi"); }'
		},
		{'code': 'switch 1 { case 0: println("hi"); }',
		'to': 'switch (1) { case 0: println("hi"); }'
		},
		{'code': 'switch (1) { case 0: case 1: }',
		'to': ''
		},
		{'code': 'switch (1) { case 0: case 1: default: }',
		'to': ''
		}
	];
	processFixerTestCases(cases, simplifySwitches, logger);
};