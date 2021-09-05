import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateTrueFalse(logger) {
	const cases = [
	{'in': `print true`,
'out': 'print true'},
	{'in': `print false`,
'out': 'print false'},
	{'in': `let true = 1\nprint true`,
'out': 'make "true1 1\nprint :true1'},
	{'in': `let true = 1\nprint true`,
'out': 'make "true1 1\nprint :true1'}
	];
	testInOutPairs(cases, translate, logger);
};