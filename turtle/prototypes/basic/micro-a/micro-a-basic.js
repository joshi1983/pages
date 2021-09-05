import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { ready } from
'../../../modules/ready.js';
import { scan } from
'../../../modules/parsing/basic/micro-a/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translateMicroABasicToQBasic } from
'../../../modules/parsing/basic/micro-a/translation-to-weblogo/translateMicroABasicToQBasic.js';
import { translateMicroABasicToWebLogo } from
'../../../modules/parsing/basic/micro-a/translation-to-weblogo/translateMicroABasicToWebLogo.js';

let microABasicCode;
microABasicCode = `func f()
endFn`;
let translationTarget;

function microAParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

function translate(code) {
	if (translationTarget.value === 'WebLogo')
		return translateMicroABasicToWebLogo(code);
	else
		return translateMicroABasicToQBasic(code);
}

function init() {
	translationTarget = document.getElementById('translation-target');
	const genericObject = initGenericParsing(ParseTreeTokenType, microAParse, microABasicCode, undefined,
	undefined, translate);

	translationTarget.addEventListener('change', genericObject.refreshOutputs);
}

ready(init);