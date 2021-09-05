import { parse } from
'../../../modules/parsing/sonic-webturtle/parse.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { sonicWebTurtleExamples } from
'../../helpers/parsing/sonicWebTurtleExamples.js';

export function testParseExamples(logger) {
	const cases = [];
	sonicWebTurtleExamples.forEach(function(content) {
		cases.push(content);
	});
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo;
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const parseResult = parse(code);
		if (typeof parseResult !== 'object')
			plogger(`parse expected to return an object but got ${parseResult}`);
	});
};