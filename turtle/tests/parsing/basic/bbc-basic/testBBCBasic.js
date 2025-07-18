import { testBBCToQBasicData } from
'./testBBCToQBasicData.js';
import { testIsLikelyBBCBasic } from 
'./testIsLikelyBBCBasic.js';
import { testScanning } from
'./scanning/testScanning.js';
import { testTranslateToWebLogo } from
'./translation-to-weblogo/testTranslateToWebLogo.js';
import { wrapAndCall } from 
'../../../helpers/wrapAndCall.js';

export function testBBCBasic(logger) {
	wrapAndCall([
		testBBCToQBasicData,
		testIsLikelyBBCBasic,
		testScanning,
		testTranslateToWebLogo
	], logger);
};