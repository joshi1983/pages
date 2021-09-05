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
]`},{'in': `label:
	print "hi"
	goto labelafter
	goto label
labelafter:`,
	'out': `forever [
	print "hi
	break
]`},{'in': `goto label
label:`,
	'out': ''}
	];
	testInOutPairs(cases, translate, logger);
};