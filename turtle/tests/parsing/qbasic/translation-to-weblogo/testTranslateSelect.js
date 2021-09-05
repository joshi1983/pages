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
]`},{
	'in': `select case x
		case 1
			print "yo"
		case 13
			print "hi"
		end select`,
		'out': `ifelse :x = 1 [
	print "yo
] [
	if :x = 13 [
		print "hi
	]
]`},{
	'in': `select case x
		case 1
			print "yo"
		case else
			print "hi"
		end select`,
		'out': `ifelse :x = 1 [
	print "yo
] [
	print "hi
]`},{
	'in': `SELECT CASE r
        CASE IS <= .01
			print "hi"
		end select`,
	'out': `if :r <= .01 [
	print "hi
]`
	},{
	'in': `SELECT CASE r
        CASE IS < .01
			print "hi"
		end select`,
	'out': `if :r < .01 [
	print "hi
]`
	},{
	'in': `SELECT CASE r
        CASE IS = .01
			print "hi"
		end select`,
	'out': `if :r = .01 [
	print "hi
]`
	},{
	'in': `SELECT CASE r
        CASE IS > .01
			print "hi"
		end select`,
	'out': `if :r > .01 [
	print "hi
]`
	},{
	'in': `SELECT CASE r
        CASE IS <> .01
			print "hi"
		end select`,
	'out': `if :r <> .01 [
	print "hi
]`
	}];
	testInOutPairs(cases, translate, logger);
};