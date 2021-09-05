import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateIfStatements(logger) {
	const cases = [
	{'in': `if false then 
		PRINT "hi"
end if`, 'out': ''},
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
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};