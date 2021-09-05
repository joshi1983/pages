import { parse } from
'../../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { shouldIgnoreScreenCalls } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/shouldIgnoreScreenCalls.js';

export function testShouldIgnoreScreenCalls(logger) {
	const cases = [
		{'code': '', 'out': true},
		{'code': 'print "hi"', 'out': true},
		{'code': 'screen 4', 'out': true},
		{'code': 'circle (10, 20), 3', 'out': false},
		{'code': 'pset (10, 20), 3', 'out': false},
		{'code': 'preset (10, 20), 3', 'out': false},
		{'code': 'draw "C3 U10"', 'out': false}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const result = shouldIgnoreScreenCalls(parseResult.root);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${result}`);
	});
};