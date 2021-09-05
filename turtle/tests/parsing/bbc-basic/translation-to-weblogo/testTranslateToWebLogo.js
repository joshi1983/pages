import { testProcessBasicTo } from './testProcessBasicTo.js';
import { testProcessGoto } from './testProcessGoto.js';
import { testProcessKeywords  } from
'./testProcessKeywords.js';
import { testTestExecuteTranslations } from
'./testTestExecuteTranslations.js';
import { testTranslateBBCBasicToQBasicOnExamples } from
'./testTranslateBBCBasicToQBasicOnExamples.js';
import { testTranslateBBCBasicToQBasicSpecificOutputs } from
'./testTranslateBBCBasicToQBasicSpecificOutputs.js';
import { testTranslateBBCBasicToWebLogo } from
'./testTranslateBBCBasicToWebLogo.js';
import { wrapAndCall } from 
'../../../helpers/wrapAndCall.js';

export function testTranslateToWebLogo(logger) {
	wrapAndCall([
		testProcessBasicTo,
		testProcessGoto,
		testProcessKeywords,
		testTestExecuteTranslations,
		testTranslateBBCBasicToQBasicOnExamples,
		testTranslateBBCBasicToQBasicSpecificOutputs,
		testTranslateBBCBasicToWebLogo
	], logger);
};