import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { translate } from '../../../../modules/parsing/kturtle/translation-to-weblogo/translate.js';

export function testTranslateWithProcedures(logger) {
	const cases = [
	{'in': 'print random 10,20', 'outContains': 'kturtleRandom 10 20'},
	{'in': 'clear', 'outContains': 'kturtleClear'},
	{'in': 'ccl', 'outContains': 'kturtleClear'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`case ${index}, in: ${caseInfo.in}`, logger);
		const result = translate(caseInfo.in);
		if (caseInfo.outContains !== undefined && result.indexOf(caseInfo.outContains) === -1)
			plogger(`Expected to find ${caseInfo.outContains} but did not in ${result}`);
	});
};