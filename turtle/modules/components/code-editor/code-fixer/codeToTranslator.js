import { isLikely0L } from
'../../../parsing/l-systems/0L/isLikely0L.js';
import { isLikelyAmosBasic } from
'../../../parsing/basic/amos-basic/isLikelyAmosBasic.js';
import { isLikelyAppleSoftBasic } from
'../../../parsing/basic/applesoft-basic/isLikelyAppleSoftBasic.js';
import { isLikelyASMTurtle } from
'../../../parsing/asm-turtle/isLikelyASMTurtle.js';
import { isLikelyBasilBasic } from
'../../../parsing/basic/basil/isLikelyBasilBasic.js';
import { isLikelyBBCBasic } from
'../../../parsing/basic/bbc-basic/isLikelyBBCBasic.js';
import { isLikelyCanvas2D } from
'./fixers/canvas-2d/isLikelyCanvas2D.js';
import { isLikelyCGJennings } from
'../../../parsing/l-systems/cgjennings/isLikelyCGJennings.js';
import { isLikelyCheerfulNetherlandsLogo } from
'./fixers/cheerful-netherlands-logo/isLikelyCheerfulNetherlandsLogo.js';
import { isLikelyCodeHeartTurtleScript } from
'./fixers/codeheart-turtlescript/isLikelyCodeHeartTurtleScript.js';
import { isLikelyCommodoreBasic } from
'../../../parsing/basic/commodore-basic/isLikelyCommodoreBasic.js';
import { isLikelyFMSLogo } from
'../../../parsing/fms-logo/isLikelyFMSLogo.js';
import { isLikelyFractInt } from
'../../../parsing/l-systems/fractint/isLikelyFractInt.js';
import { isLikelyJavaScriptProcessing } from
'../../../parsing/processing/js-processing/isLikelyJavaScriptProcessing.js';
import { isLikelyKTurtle } from
'../../../parsing/kturtle/isLikelyKTurtle.js';
import { isLikelyLogo3D } from
'./fixers/logo-3d/isLikelyLogo3D.js';
import { isLikelyLogoInterpreter } from
'./fixers/logo-interpreter/isLikelyLogoInterpreter.js';
import { isLikelyMicroABasic } from
'../../../parsing/basic/micro-a/isLikelyMicroABasic.js';
import { isLikelyPapert } from
'./fixers/papert/isLikelyPapert.js';
import { isLikelyPovRay } from
'../../../parsing/pov-ray/isLikelyPovRay.js';
import { isLikelyProcessing } from
'../../../parsing/processing/isLikelyProcessing.js';
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
import { isLikelyTexasInstruments99_4a } from
'../../../parsing/basic/texas-instruments-99-4a/isLikelyTexasInstruments99_4a.js';
import { isLikelyTerrapin } from
'./fixers/terrapin/isLikelyTerrapin.js';
import { logo3DToWebLogo } from './fixers/logo-3d/logo3DToWebLogo.js';
import { logoInterpreterToWebLogo } from './fixers/logo-interpreter/logoInterpreterToWebLogo.js';
import { papertToWebLogo } from './fixers/papert/papertToWebLogo.js';
import { StringUtils } from '../../../StringUtils.js';
import { terrapinToWebLogo } from './fixers/terrapin/terrapinToWebLogo.js';
import { translate0LToWebLogo } from
'../../../parsing/l-systems/0L/translation-to-weblogo/translate0LToWebLogo.js';
import { translateAppleSoftBasicToWebLogo } from
'../../../parsing/basic/applesoft-basic/translation-to-weblogo/translateAppleSoftBasicToWebLogo.js';
import { translate as translateASMTurtle } from
'../../../parsing/asm-turtle/translation-to-weblogo/translate.js';
import { translateBasilBasicToWebLogo } from
'../../../parsing/basic/basil/translation-to-weblogo/translateBasilBasicToWebLogo.js';
import { translateCGJenningsToWebLogo } from
'../../../parsing/l-systems/cgjennings/translation-to-weblogo/translateCGJenningsToWebLogo.js';
import { translateCheerfulToWebLogo } from
'./fixers/cheerful-netherlands-logo/translateCheerfulToWebLogo.js';
import { translateCommodoreBasicToWebLogo } from
'../../../parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToWebLogo.js';
import { translate as translateFMSLogo } from
'../../../parsing/fms-logo/translation-to-weblogo/translate.js';
import { translateFractIntToWebLogo } from
'../../../parsing/l-systems/fractint/translation-to-weblogo/translateFractIntToWebLogo.js';
import { translate as translateKTurtle } from
'../../../parsing/kturtle/translation-to-weblogo/translate.js';
import { translateMicroABasicToWebLogo } from
'../../../parsing/basic/micro-a/translation-to-weblogo/translateMicroABasicToWebLogo.js';
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
import { translateAmosBasicToWebLogo } from
'../../../parsing/basic/amos-basic/translation-to-weblogo/translateAmosBasicToWebLogo.js';
import { translateBBCBasicToWebLogo } from
'../../../parsing/basic/bbc-basic/translation-to-weblogo/translateBBCBasicToWebLogo.js';
import { translateJSProcessingToWebLogo } from
'../../../parsing/processing/js-processing/translation-to-weblogo/translateJSProcessingToWebLogo.js';
import { translateProcessingToWebLogo } from
'../../../parsing/processing/translation-to-weblogo/translateProcessingToWebLogo.js';
import { translateSinclairBasicToWebLogo } from
'../../../parsing/basic/sinclair-basic/translation-to-weblogo/translateSinclairBasicToWebLogo.js';
import { translateTektronix405XBasicToWebLogo } from
'../../../parsing/basic/tektronix-405x-basic/translation-to-weblogo/translateTektronix405XBasicToWebLogo.js';
import { translateTI99BasicToWebLogo } from
'../../../parsing/basic/texas-instruments-99-4a/translation-to-weblogo/translateTI99BasicToWebLogo.js';
import { translateTurtleBlocksToWebLogo } from
'../../../parsing/sugarlabs-turtle-blocks/translation-to-weblogo/translateTurtleBlocksToWebLogo.js';
import { newTranslatePythonCodeToWebLogo } from
'../../../parsing/python-parsing/newTranslatePythonCodeToWebLogo.js';

const translatorPairs = new Map([
	[isLikely0L, [translate0LToWebLogo, false]],
	[isLikelyAmosBasic, [translateAmosBasicToWebLogo, false]],
	[isLikelyAppleSoftBasic, [translateAppleSoftBasicToWebLogo, false]],
	[isLikelyASMTurtle, [translateASMTurtle, false]],
	[isLikelyBasilBasic, [translateBasilBasicToWebLogo, false]],
	[isLikelyBBCBasic, [translateBBCBasicToWebLogo, false]],
	[isLikelyCanvas2D, [translateCanvas2DToWebLogo, false]],
	[isLikelyCGJennings, [translateCGJenningsToWebLogo, false]],
	[isLikelyCheerfulNetherlandsLogo, [translateCheerfulToWebLogo, false]],
	[isLikelyCodeHeartTurtleScript, [translateCodeHeartTurtleScriptToWebLogo, false]],
	[isLikelyCommodoreBasic, [translateCommodoreBasicToWebLogo, false]],
	[isLikelyFMSLogo, [translateFMSLogo, false]],
	[isLikelyFractInt, [translateFractIntToWebLogo, false]],
	[isLikelyJavaScriptProcessing, [translateJSProcessingToWebLogo, false]],
	[isLikelyLogo3D, [logo3DToWebLogo, true]],
	[isLikelyLogoInterpreter, [logoInterpreterToWebLogo, false]],
	[isLikelyPapert, [papertToWebLogo, true]],
	[isLikelyKTurtle, [translateKTurtle, false]],
	[isLikelyMicroABasic, [translateMicroABasicToWebLogo, false]],
	[isLikelyPovRay, [translatePovRay, false]],
	[isLikelyProcessing, [translateProcessingToWebLogo, false]],
	[isLikelySinclairBasic, [translateSinclairBasicToWebLogo, false]],
	[isLikelyQBasic, [translateQBASICToWebLogo, false]],
	[isLikelySonicWebTurtle, [translateSonicWebTurtle, false]],
	[isLikelySugarLabsTurtleBlocks, [translateTurtleBlocksToWebLogo, false]],
	[isLikelyTektronix405XBasic, [translateTektronix405XBasicToWebLogo, false]],
	[isLikelyTerrapin, [terrapinToWebLogo, false]],
	[isLikelyTexasInstruments99_4a, [translateTI99BasicToWebLogo, false]],
]);
const defaultResult = [(code) => code, false];

export function codeToTranslator(code) {
	code = StringUtils.sanitizeLineBreaks(code);
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
			if (result !== defaultResult)
				return defaultResult;
			result = resultPair;
		}
	}
	return result;
};