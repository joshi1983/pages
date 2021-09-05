import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

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
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};