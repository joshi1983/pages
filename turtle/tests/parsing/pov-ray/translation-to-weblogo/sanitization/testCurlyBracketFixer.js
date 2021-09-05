import { curlyBracketFixer } from
'../../../../../modules/parsing/pov-ray/translation-to-weblogo/sanitization/curlyBracketFixer.js';
import { processFixerTests } from './processFixerTests.js';

export function testCurlyBracketFixer(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': '{}', 'changed': false},
	{'in': '}', 'changed': false},
	{'in': '{x+4}', 'changed': false},
	{'in': '{', 'out': '{}'},
	{'in': '[]{', 'out': '[]{}'},
	{'in': '{x', 'out': '{x}'},
	{'in': '{x+4', 'out': '{x+4}'},
	];
	processFixerTests(cases, curlyBracketFixer, logger);
};