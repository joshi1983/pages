import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateProcessingToWebLogo } from
'../../../../modules/parsing/processing/translation-to-weblogo/translateProcessingToWebLogo.js';

export function testTranslateComments(logger) {
	const cases = [
		{'in': '//', 'out': ';'},
		{'in': '/**/', 'out': ';'},
		{'in': '/* comment */', 'out': '; comment'},
		{'in': '/* comment\nanother line of comment */',
		'out': '; comment\n;another line of comment'},
	];
	testInOutPairs(cases, translateProcessingToWebLogo, logger);
};