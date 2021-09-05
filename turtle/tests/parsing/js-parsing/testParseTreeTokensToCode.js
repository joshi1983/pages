import { flatten } from
'../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../modules/parsing/js-parsing/parse.js';
import { parseTreeTokensToCode } from
'../../../modules/parsing/js-parsing/parseTreeTokensToCode.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testParseTreeTokensToCode(logger) {
	const cases = [
		{'code': 'console.log("hi");', 'out': 'console.log("hi");'},
		{'code': 'console.log\n("hi");', 'out': 'console.log\n("hi");'},
		{'code': 'console.log ( "hi");', 'out': 'console.log ( "hi");'},
		{'code': 'console.log\t\r("hi");', 'out': 'console.log ("hi");'}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const out = parseTreeTokensToCode(allTokens);
		if (out !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${out}`);
	});
};