import { forTokenToStepVariableName } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/forTokenToStepVariableName.js';
import { processForTokenToSimpleValueTest } from
'../processForTokenToSimpleValueTest.js';

export function testForTokenToStepVariableName(logger) {
	const cases = [
		{'in': 'for', 'out': undefined},
		{'in': 'for (', 'out': undefined},
		{'in': 'for (;;)', 'out': undefined},
		{'in': 'for (;x;)', 'out': undefined},
		{'in': 'for (;x<t;)', 'out': undefined},
		{'in': 'for (;x < 3;)', 'out': undefined},
		{'in': 'for (p.x;x < 3;)', 'out': undefined},
		{'in': 'for (p.x=3;x < 3;)', 'out': undefined},
		{'in': 'for (x();x < 3;)', 'out': undefined},
		{'in': 'for (x;x < 3;)', 'out': undefined},
		{'in': 'for (int x;x < 3;)', 'out': undefined},
		{'in': 'for (int y;x < 3;)', 'out': undefined},
		{'in': 'for (x=3;x < 3;)', 'out': undefined},
		{'in': 'for (int x=3;x < 3;)', 'out': undefined},
		{'in': 'for (int z=3;x < 3;)', 'out': undefined},
		{'in': 'for (int z=3;x < 3;p.x++)', 'out': undefined},
		{'in': 'for (int z=3;x < 3;x+=z)', 'out': 'x'},
		{'in': 'for (int z=3;x < 3;x++)', 'out': 'x'},
		{'in': 'for (int z=3;x < 3;y++)', 'out': 'y'},
		{'in': 'for (int z=3;x < 3;x+=3)', 'out': 'x'},
		{'in': 'for (int z=3;x < 3;y+=3)', 'out': 'y'},
	];
	processForTokenToSimpleValueTest(cases, forTokenToStepVariableName, logger);
};