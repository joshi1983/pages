import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateCodeHeartTurtleScriptToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateCodeHeartTurtleScriptToWebLogo.js';

export function processTranslateTestCases(cases, logger) {
	cases.forEach(function(caseInfo) {
		caseInfo.out = ('setPenSize 0\nsetLineCap "round\n' + caseInfo.out).trim();
	});
	testInOutPairs(cases, translateCodeHeartTurtleScriptToWebLogo, logger);
};