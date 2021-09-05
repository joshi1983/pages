import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';

export function testParseInvalidCode(logger) {
	const cases = [
	'\\','%','*','+','-','!','@','#','&','(',')','[',']', '<','?',':',
	'#declare'
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo;
		const parseResult = parse(code);
	});
};