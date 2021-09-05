import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateCommon(logger) {
	const cases = [
		{'in': 'COMMON SHARED x', 'out': ''},
		{'in': 'COMMON SHARED x%, y%, user$, speed!, score&', 'out': ''},
		{'in': 'COMMON x', 'out': ''},
		{'in': 'COMMON x%, y%, user$, speed!, score&', 'out': ''},
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};