import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateSelect(logger) {
	const cases = [
	{
		'in': `select case x
		case 1
			print "yo"
		end select`,
		'out': `if :x = 1 [
	print "yo
]`},{
		'in': `select case x
		case 1,2
			print "yo"
		end select`,
		'out': `if or :x = 1 :x = 2 [
	print "yo
]`},{
		'in': `select case x
		case 1,2,13
			print "yo"
		end select`,
		'out': `if ( or :x = 1 :x = 2 :x = 13 ) [
	print "yo
]`},{
		'in': `select case x
		case 1 to 4
			print "yo"
		end select`,
		'out': `if and :x >= 1 :x <= 4 [
	print "yo
]`}];
	testInOutPairs(cases, translate, logger);
};