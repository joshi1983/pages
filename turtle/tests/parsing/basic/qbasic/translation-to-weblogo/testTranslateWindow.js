import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateWindow(logger) {
	const cases = [
		{'in': 'WINDOW SCREEN(-190, -200)-(190, 200)', 'out': ''},
		{'in': 'WINDOW (-620 * 4 / 3, -620)-(620 * 4 / 3, 620)', 'out': ''},
		{'in': 'WINDOW (-4, 0)-(6, 10)', 'out': ''}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};