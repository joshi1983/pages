import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { translateToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateToWebLogo.js';

export function testTranslateToWebLogoWithProcedures(logger) {
	const cases = [
		{'in': 'randomReal(1, 3)', 'outContains': 'codeheartTsRandomReal 1 3'},
		{'in': 'randomInteger(1, 3)', 'outContains': 'codeheartTsRandomInteger 1 3'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.in}`, logger);
		const result = translateToWebLogo(caseInfo.in);
		if (result.indexOf(caseInfo.outContains) === -1)
			plogger(`Expected to find ${caseInfo.outContains} but not found in ${result}`);
	});
};