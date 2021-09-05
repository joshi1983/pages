import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateToWebLogo.js';

export function processTranslateTestCases(cases, logger) {
	cases.forEach(function(caseInfo) {
		caseInfo.out = ('setPenSize 0\nsetLineCap "round\n' + caseInfo.out).trim();
	});
	testInOutPairs(cases, translateToWebLogo, logger);
};