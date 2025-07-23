import { isLikelyASMTurtle } from
'../../../parsing/asm-turtle/isLikelyASMTurtle.js';
import { isLikelyBBCBasic } from
'../../../parsing/basic/bbc-basic/isLikelyBBCBasic.js';
import { isLikelyCanvas2D } from
'./fixers/canvas-2d/isLikelyCanvas2D.js';
import { isLikelyCheerfulNetherlandsLogo } from
'./fixers/cheerful-netherlands-logo/isLikelyCheerfulNetherlandsLogo.js';
import { isLikelyCodeHeartTurtleScript } from
'./fixers/codeheart-turtlescript/isLikelyCodeHeartTurtleScript.js';
import { isLikelyCommodoreBasic } from
'../../../parsing/basic/commodore-basic/isLikelyCommodoreBasic.js';
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
'../../../parsing/basic/qbasic/isLikelyQBasic.js';
import { isLikelySinclairBasic } from
'../../../parsing/basic/sinclair-basic/isLikelySinclairBasic.js';
import { isLikelySonicWebTurtle } from
'../../../parsing/sonic-webturtle/isLikelySonicWebTurtle.js';
import { isLikelySugarLabsTurtleBlocks } from
'../../../parsing/sugarlabs-turtle-blocks/isLikelySugarLabsTurtleBlocks.js';
import { isLikelyTektronix405XBasic } from
'../../../parsing/basic/tektronix-405x-basic/isLikelyTektronix405XBasic.js';
import { isLikelyTerrapin } from
'./fixers/terrapin/isLikelyTerrapin.js';
import { logo3DToWebLogo } from './fixers/logo-3d/logo3DToWebLogo.js';
import { logoInterpreterToWebLogo } from './fixers/logo-interpreter/logoInterpreterToWebLogo.js';
import { papertToWebLogo } from './fixers/papert/papertToWebLogo.js';
import { StringUtils } from '../../../StringUtils.js';
import { terrapinToWebLogo } from './fixers/terrapin/terrapinToWebLogo.js';
import { translate as translateASMTurtle } from
'../../../parsing/asm-turtle/translation-to-weblogo/translate.js';
import { translateCheerfulToWebLogo } from
'./fixers/cheerful-netherlands-logo/translateCheerfulToWebLogo.js';
import { translateCommodoreBasicToWebLogo } from
'../../../parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToWebLogo.js';
import { translate as translateFMSLogo } from
'../../../parsing/fms-logo/translation-to-weblogo/translate.js';
import { translate as translateKTurtle } from
'../../../parsing/kturtle/translation-to-weblogo/translate.js';
import { translate as translatePovRay } from
'../../../parsing/pov-ray/translation-to-weblogo/translate.js';
import { translateQBASICToWebLogo } from
'../../../parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';
import { translate as translateSonicWebTurtle } from
'../../../parsing/sonic-webturtle/translation-to-weblogo/translate.js';
import { translateToWebLogo as translateCanvas2DToWebLogo } from
'./fixers/canvas-2d/translateToWebLogo.js';
import { translateToWebLogo as translateCodeHeartTurtleScriptToWebLogo } from
'./fixers/codeheart-turtlescript/translateToWebLogo.js';
import { translateBBCBasicToWebLogo } from
'../../../parsing/basic/bbc-basic/translation-to-weblogo/translateBBCBasicToWebLogo.js';
import { translateSinclairBasicToWebLogo } from
'../../../parsing/basic/sinclair-basic/translation-to-weblogo/translateSinclairBasicToWebLogo.js';
import { translateTektronix405XBasicToWebLogo } from
'../../../parsing/basic/tektronix-405x-basic/translation-to-weblogo/translateTektronix405XBasicToWebLogo.js';
import { translateTurtleBlocksToWebLogo } from
'../../../parsing/sugarlabs-turtle-blocks/translation-to-weblogo/translateTurtleBlocksToWebLogo.js';
import { newTranslatePythonCodeToWebLogo } from
'../../../parsing/python-parsing/newTranslatePythonCodeToWebLogo.js';

const translatorPairs = new Map([
	[isLikelyASMTurtle, [translateASMTurtle, false]],
	[isLikelyBBCBasic, [translateBBCBasicToWebLogo, false]],
	[isLikelyCanvas2D, [translateCanvas2DToWebLogo, false]],
	[isLikelyCheerfulNetherlandsLogo, [translateCheerfulToWebLogo, false]],
	[isLikelyCommodoreBasic, [translateCommodoreBasicToWebLogo, false]],
	[isLikelyFMSLogo, [translateFMSLogo, false]],
	[isLikelyLogo3D, [logo3DToWebLogo, true]],
	[isLikelyLogoInterpreter, [logoInterpreterToWebLogo, false]],
	[isLikelyPapert, [papertToWebLogo, true]],
	[isLikelyKTurtle, [translateKTurtle, false]],
	[isLikelyCodeHeartTurtleScript, [translateCodeHeartTurtleScriptToWebLogo, false]],
	[isLikelyPovRay, [translatePovRay, false]],
	[isLikelySinclairBasic, [translateSinclairBasicToWebLogo, false]],
	[isLikelyQBasic, [translateQBASICToWebLogo, false]],
	[isLikelySonicWebTurtle, [translateSonicWebTurtle, false]],
	[isLikelySugarLabsTurtleBlocks, [translateTurtleBlocksToWebLogo, false]],
	[isLikelyTektronix405XBasic, [translateTektronix405XBasicToWebLogo, false]],
	[isLikelyTerrapin, [terrapinToWebLogo, false]],
]);
const defaultResult = [(code) => code, false];

export function codeToTranslator(code) {
	code = StringUtils.sanitizeLineBreaks(code);
	let startTime = Date.now();
	let result = defaultResult;
	if (isLikelyPythonCode(code)) {
		result = [newTranslatePythonCodeToWebLogo, false];
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
			if (result !== defaultResult) {
				console.log(`delay is ${Date.now() - startTime}ms`);
				return defaultResult;
			}
			result = resultPair;
		}
	}
	console.log(`delay is ${Date.now() - startTime}ms`);
	return result;
};