import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateIfStatements(logger) {
	const cases = [
	{'in': `if false then 
		PRINT "hi"
end if`, 'out': `if false [
	print "hi
]`},
	{'in': `if false then 
		PRINT "hi"
else
	print "bye"
end if`, 'out': `ifelse false [
	print "hi
] [
	print "bye
]`},
	{'in': `if false then 
		PRINT "hi"
elseif true then
	print "bye"
end if`, 'out': `ifelse false [
	print "hi
] [
	if true [
		print "bye
	]
]`},{'in': `if false then 
		PRINT "hi"
elseif false then
	print "bye"
else 
	print "yo"
end if`,
'out': `ifelse false [
	print "hi
] [
	ifelse false [
		print "bye
	] [
		print "yo
	]
]`}
	];
	testInOutPairs(cases, translate, logger);
};