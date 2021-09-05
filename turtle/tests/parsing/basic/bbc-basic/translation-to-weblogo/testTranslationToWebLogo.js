import { testExecuteStringLiterals } from
'./testExecuteStringLiterals.js';
import { testExecuteTranslations } from
'./testExecuteTranslations.js';
import { testInsertSpaces } from
'./testInsertSpaces.js';
import { testProcessBasicTo } from './testProcessBasicTo.js';
import { testProcessKeywords  } from
'./testProcessKeywords.js';
import { testScanTokenProcessors } from
'./scantoken-processors/testScanTokenProcessors.js';
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
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecuteStringLiterals,
		testExecuteTranslations,
		testInsertSpaces,
		testProcessBasicTo,
		testProcessKeywords,
		testScanTokenProcessors,
		testTranslateBBCBasicQBasicToWebLogo,
		testTranslateBBCBasicToQBasicOnExamples,
		testTranslateBBCBasicToQBasicSpecificOutputs,
		testTranslateBBCBasicToWebLogo,
		testTranslateExecuteAssignments,
		testTranslateExecuteIf,
		testTranslateExecuteOperators
	], logger);
};