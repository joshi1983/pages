import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateComments(logger) {
	const cases = [
		{'in': '//', 'out': ';'},
		{'in': '/**/', 'out': ';'},
		{'in': '/* comment */', 'out': '; comment'},
		{'in': '/* comment\nanother line of comment */',
		'out': '; comment\n;another line of comment'},
	];
	testInOutPairs(cases, translate, logger);
};