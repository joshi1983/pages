import { processFixerTestCases } from
'./processFixerTestCases.js';
import { simplifyConditions } from
'../../../../../modules/parsing/processing/translation-to-weblogo/simplifying/simplifyConditions.js';

export function testSimplifyConditions(logger) {
	const cases = [
		{'code': 'if x { }',
		'to': 'if (x) { }'
		},
		{'code': 'while x { }',
		'to': 'while (x) { }'
		},
	];
	processFixerTestCases(cases, simplifyConditions, logger);
};