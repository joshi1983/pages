import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslateIf(logger) {
	const cases = [
		{
			'in': `if x < 2 then
	put "hi"
end if`, 'out': `if :x < 2 [
	print "hi
]`
		},{
			'in': `if x < 2 then
	put "hi"
else
	put "else-message"
end if`, 'out': `ifelse :x < 2 [
	print "hi
] [
	print "else-message
]`
		},{
			'in': `if x < 2 then
	put "hi"
elsif y > 3 then
	put "elsif-message"
end if`, 'out': `ifelse :x < 2 [
	print "hi
] [
	if :y > 3 [
		print "elsif-message
	]
]`
		},{
			'in': `if x < 2 then
	put "hi"
elsif y > 3 then
	put "elsif-message"
else
	put "else-message"
end if`, 'out': `ifelse :x < 2 [
	print "hi
] [
	ifelse :y > 3 [
		print "elsif-message
	] [
		print "else-message
	]
]`
		},
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};