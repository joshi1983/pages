import { isLikelyASMTurtle } from
'../../../parsing/asm-turtle/isLikelyASMTurtle.js';
import { isLikelyCanvas2D } from
'./fixers/canvas-2d/isLikelyCanvas2D.js';
import { isLikelyCodeHeartTurtleScript } from
'./fixers/codeheart-turtlescript/isLikelyCodeHeartTurtleScript.js';
import { isLikelyFMSLogo } from
'../../../parsing/fms-logo/isLikelyFMSLogo.js';
import { isLikelyKTurtle } from
'../../../parsing/kturtle/isLikelyKTurtle.js';
import { isLikelyLogo3D } from
'./fixers/logo-3d/isLikelyLogo3D.js';
import { isLikelyLogoInterpreter } from
'./fixers/logo-interpreter/isLikelyLogoInterpreter.js';
import { isLikelyPapert } from
'./fixers/papert/isLikelyPapert.js';
import { isLikelyPovRay } from
'../../../parsing/pov-ray/isLikelyPovRay.js';
import { isLikelyPythonCode } from
'../../../parsing/python-parsing/isLikelyPythonCode.js';
import { isLikelyQBasic } from
'../../../parsing/qbasic/isLikelyQBasic.js';
import { isLikelySonicWebTurtle } from
'../../../parsing/sonic-webturtle/isLikelySonicWebTurtle.js';
import { isLikelyTerrapin } from
'./fixers/terrapin/isLikelyTerrapin.js';
import { logo3DToWebLogo } from './fixers/logo-3d/logo3DToWebLogo.js';
import { logoInterpreterToWebLogo } from './fixers/logo-interpreter/logoInterpreterToWebLogo.js';
import { papertToWebLogo } from './fixers/papert/papertToWebLogo.js';
import { terrapinToWebLogo } from './fixers/terrapin/terrapinToWebLogo.js';
import { translate as translateASMTurtle } from
'../../../parsing/asm-turtle/translation-to-weblogo/translate.js';
import { translate as translateFMSLogo } from
'../../../parsing/fms-logo/translation-to-weblogo/translate.js';
import { translate as translateKTurtle } from
'../../../parsing/kturtle/translation-to-weblogo/translate.js';
import { translate as translatePovRay } from
'../../../parsing/pov-ray/translation-to-weblogo/translate.js';
import { translate as translateQBasic } from
'../../../parsing/qbasic/translation-to-weblogo/translate.js';
import { translate as translateSonicWebTurtle } from
'../../../parsing/sonic-webturtle/translation-to-weblogo/translate.js';
import { translateToWebLogo as translateCanvas2DToWebLogo } from
'./fixers/canvas-2d/translateToWebLogo.js';
import { translateToWebLogo as translateCodeHeartTurtleScriptToWebLogo } from
'./fixers/codeheart-turtlescript/translateToWebLogo.js';
import { asyncInit, translatePythonCodeToWebLogo } from
'../../../parsing/python-parsing/translatePythonCodeToWebLogo.js';

let isPythonParserLoaded = false;
asyncInit().then(() => isPythonParserLoaded = true);

const translatorPairs = new Map([
	[isLikelyASMTurtle, [translateASMTurtle, false]],
	[isLikelyCanvas2D, [translateCanvas2DToWebLogo, false]],
	[isLikelyFMSLogo, [translateFMSLogo, false]],
	[isLikelyLogo3D, [logo3DToWebLogo, true]],
	[isLikelyLogoInterpreter, [logoInterpreterToWebLogo, false]],
	[isLikelyPapert, [papertToWebLogo, true]],
	[isLikelyKTurtle, [translateKTurtle, false]],
	[isLikelyCodeHeartTurtleScript, [translateCodeHeartTurtleScriptToWebLogo, false]],
	[isLikelyPovRay, [translatePovRay, false]],
	[isLikelyQBasic, [translateQBasic, false]],
	[isLikelySonicWebTurtle, [translateSonicWebTurtle, false]],
	[isLikelyTerrapin, [terrapinToWebLogo, false]],
]);
const defaultResult = [(code) => code, false];

export function codeToTranslator(code) {
	let result = defaultResult;
	if (isLikelyPythonCode(code) && isPythonParserLoaded) {
		result = [translatePythonCodeToWebLogo, false];
	}
	for (const [isFunc, resultPair] of translatorPairs) {
		if (isFunc(code)) {
			/*
			These translators can make a lot of changes to the code.
			It is better to make no changes than make the wrong changes.
			For this reason, if more than 1 translator is matched, do nothing.

			Ideally, only 1 category or classification will be matched so we
			can be pretty confident that the changes are appropriate.
			*/
			if (result !== defaultResult)
				return defaultResult;
			result = resultPair;
		}
	}
	return result;
};