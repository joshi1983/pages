import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/translateToWebLogo.js';

export function processTranslateTestCases(cases, logger) {
	testInOutPairs(cases, translateToWebLogo, logger);
};