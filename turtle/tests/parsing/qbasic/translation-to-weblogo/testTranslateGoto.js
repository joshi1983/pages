import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateGoto(logger) {
	const cases = [
	{'in': `label:
	print "hi"
	goto label`,
	'out': `forever [
	print "hi
]`}
	];
	testInOutPairs(cases, translate, logger);
};