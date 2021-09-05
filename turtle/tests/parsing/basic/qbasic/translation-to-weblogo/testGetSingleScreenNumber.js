import { getSingleScreenNumber } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/getSingleScreenNumber.js';
import { parse } from
'../../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testGetSingleScreenNumber(logger) {
	const cases = [
		{'code': '', 'out': 0},
		{'code': `screen 4`, 'out': 4},
		{'code': `screen 12`, 'out': 12},
		{'code': `screen 12\nscreen 4`, 'out': undefined},
		{'code': 'RANDOMIZE TIMER\nscreen INT(RND * 15)', 'out': undefined},
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const result = getSingleScreenNumber(parseResult.root);
		if (result !== caseInfo.out) {
			const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
			plogger(`Expected ${caseInfo.out} but found ${result}`);
		}
	});
};