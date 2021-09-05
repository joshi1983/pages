import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

export function testParseInvalidCode(logger) {
	const cases = [
	'\\','%','*','+','-','!','@','#','&','(',')','[',']', '<','?',':',
	'#declare'
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const code = caseInfo;
		const parseResult = parse(code);
		if (typeof parseResult !== 'object')
			plogger(`Despite the code being invalid, expected parse to return an object but got ${parseResult}`);
	});
};