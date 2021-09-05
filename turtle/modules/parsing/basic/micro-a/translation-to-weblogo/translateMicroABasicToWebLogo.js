import { fixFunctionCallsForMicroAInternalFunctions } from
'./fixFunctionCallsForMicroAInternalFunctions.js';
import { isApplicableTo, processFunctionCall } from
'./type-processors/processFunctionCall.js';
import { translateMicroABasicToQBasic } from
'./translateMicroABasicToQBasic.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateMicroABasicToWebLogo(code) {
	const qbasicCode = translateMicroABasicToQBasic(code);
	const options = {
		'shouldUseCustomProcessTokenForToken': isApplicableTo,
		'processToken': processFunctionCall,
		'qbasicParseTreeFixer': fixFunctionCallsForMicroAInternalFunctions
	};
	return translateQBASICToWebLogo(qbasicCode, options);
};