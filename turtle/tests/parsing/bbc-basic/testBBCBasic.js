import { testBBCToQBasicData } from
'./testBBCToQBasicData.js';
import { testIsLikelyBBCBasic } from 
'./testIsLikelyBBCBasic.js';
import { testProcessBasicTo } from './testProcessBasicTo.js';
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
'../../helpers/wrapAndCall.js';

export function testBBCBasic(logger) {
	wrapAndCall([
		testBBCToQBasicData,
		testIsLikelyBBCBasic,
		testProcessBasicTo,
		testProcessKeywords,
		testTestExecuteTranslations,
		testTranslateBBCBasicToQBasicOnExamples,
		testTranslateBBCBasicToQBasicSpecificOutputs,
		testTranslateBBCBasicToWebLogo
	], logger);
};