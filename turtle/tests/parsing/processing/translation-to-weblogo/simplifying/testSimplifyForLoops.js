import { processFixerTestCases } from
'./processFixerTestCases.js';
import { simplifyForLoops } from
'../../../../../modules/parsing/processing/translation-to-weblogo/simplifying/simplifyForLoops.js';

export function testSimplifyForLoops(logger) {
	const cases = [
		{'code': 'for',
		'to': 'for'
		},
		{'code': 'for {}',
		'to': 'for {}'
		},
		{'code': 'for (;) {}',
		'to': 'for (;;) {}'
		},
		{'code': 'for (;true;) {}',
		'to': 'for (;true;) {}' // no change because no change needed.
		},
		{'code': 'for (int x = 0;x<3;x++) {}',
		'to': 'for (int x = 0;x<3;x++) {}' // no change because no change needed.
		},
		{'code': 'for (;;;) {}',
		'to': 'for (;;) {}'
		},
		{'code': 'for (;;;;;;) {}',
		'to': 'for (;;) {}'
		},
		{'code': 'for (;; {}',
		'to': 'for (;;) {}'
		},
		{'code': 'for ;; {}',
		'to': 'for (;;) {}'
		},
		{'code': 'for ; {}',
		'to': 'for (;;) {}'
		},
	];
	processFixerTestCases(cases, simplifyForLoops, logger);
};