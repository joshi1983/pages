import { BufferedParseLogger } from
'../../loggers/BufferedParseLogger.js';
import { callDemoProcedureFixer } from
'./callDemoProcedureFixer.js';
import { FixLogger } from '../../../components/code-editor/code-fixer/FixLogger.js';
import { isApplicableTo, processToken } from
'./type-processors/processToken.js';
import { runAllFixers } from
'../../../components/code-editor/code-fixer/runAllFixers.js';
import { translateToWebLogo as translateJSToWebLogo } from
'../../js-parsing/translation-to-weblogo/translateToWebLogo.js';
import { wrappedFix } from '../../../components/code-editor/code-fixer/wrappedFix.js';

const compositeFixer = runAllFixers([
	callDemoProcedureFixer
]);

function shouldUseCustomProcessTokenForToken(token) {
	return isApplicableTo(token);
}

function fix(webLogoCode) {
	const parseLogger = new BufferedParseLogger();
	const fixLogger = new FixLogger(parseLogger);
	const proceduresMap = new Map();
	const tree = undefined;
	return wrappedFix(webLogoCode, compositeFixer, fixLogger, proceduresMap, tree);
}

export function translateTurtleGraphicsFunToWebLogo(code) {
	const options = {
		'shouldUseCustomProcessTokenForToken': shouldUseCustomProcessTokenForToken,
		'processToken': processToken,
		'tokenProcessMap': new Map()
	};
	const webLogoCode = fix(translateJSToWebLogo(code, options));
	return webLogoCode;
};