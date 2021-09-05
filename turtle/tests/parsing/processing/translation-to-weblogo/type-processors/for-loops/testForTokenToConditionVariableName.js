import { forTokenToConditionVariableName } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/forTokenToConditionVariableName.js';
import { processForTokenToSimpleValueTest } from
'../processForTokenToSimpleValueTest.js';

export function testForTokenToConditionVariableName(logger) {
	const cases = [
		{'in': 'for (;;)', 'out': undefined},
		{'in': 'for (;x;)', 'out': undefined},
		{'in': 'for (;x<t;)', 'out': undefined},
		{'in': 'for (;p.x<3;)', 'out': undefined},
		{'in': 'for (;p.x()<3;)', 'out': undefined},
		{'in': 'for (;x()<3;)', 'out': undefined},
		{'in': 'for (int x = 0;x<t;)', 'out': 'x'},
		{'in': 'for (;x < 3;)', 'out': 'x'}
	];
	processForTokenToSimpleValueTest(cases, forTokenToConditionVariableName, logger);
};