import { testExecDountil } from
'./testExecDountil.js';
import { testExecDowhile } from
'./testExecDowhile.js';
import { testExecFor } from
'./testExecFor.js';
import { testExecForeach } from
'./testExecForeach.js';
import { testExecRepeat } from
'./testExecRepeat.js';
import { testFixers } from
'./fixers/testFixers.js';
import { testTranslateTurtleSpacesToWebLogo } from
'./testTranslateTurtleSpacesToWebLogo.js';
import { testTranslateVariousExamples } from
'./testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecDountil,
		testExecDowhile,
		testExecFor,
		testExecForeach,
		testExecRepeat,
		testFixers,
		testTranslateTurtleSpacesToWebLogo,
		testTranslateVariousExamples
	], logger);
};