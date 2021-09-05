import { testExecuteTranslations } from
'./testExecuteTranslations.js';
import { testProcessBasicTo } from './testProcessBasicTo.js';
import { testProcessGoto } from './testProcessGoto.js';
import { testProcessKeywords  } from
'./testProcessKeywords.js';
import { testTranslateBBCBasicQBasicToWebLogo } from
'./testTranslateBBCBasicQBasicToWebLogo.js';
import { testTranslateBBCBasicToQBasicOnExamples } from
'./testTranslateBBCBasicToQBasicOnExamples.js';
import { testTranslateBBCBasicToQBasicSpecificOutputs } from
'./testTranslateBBCBasicToQBasicSpecificOutputs.js';
import { testTranslateBBCBasicToWebLogo } from
'./testTranslateBBCBasicToWebLogo.js';
import { testTranslateExecuteAssignments } from
'./testTranslateExecuteAssignments.js';
import { testTranslateExecuteIf } from
'./testTranslateExecuteIf.js';
import { testTranslateExecuteOperators } from
'./testTranslateExecuteOperators.js';
import { wrapAndCall } from 
'../../../helpers/wrapAndCall.js';

export function testTranslateToWebLogo(logger) {
	wrapAndCall([
		testExecuteTranslations,
		testProcessBasicTo,
		testProcessGoto,
		testProcessKeywords,
		testTranslateBBCBasicQBasicToWebLogo,
		testTranslateBBCBasicToQBasicOnExamples,
		testTranslateBBCBasicToQBasicSpecificOutputs,
		testTranslateBBCBasicToWebLogo,
		testTranslateExecuteAssignments,
		testTranslateExecuteIf,
		testTranslateExecuteOperators
	], logger);
};