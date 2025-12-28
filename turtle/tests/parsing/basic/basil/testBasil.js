//import { testIsLikelyBasilBasic } from './testIsLikelyBasilBasic.js';
import { testScanning } from './scanning/testScanning.js';
/*import { testTranslateVariousExamples } from
'./translation-to-weblogo/testTranslateVariousExamples.js';*/
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testBasil(logger) {
	wrapAndCall([
		//testIsLikelyBasilBasic,
		testScanning,
		//testTranslateVariousExamples
	], logger);
};