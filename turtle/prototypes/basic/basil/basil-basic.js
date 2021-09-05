import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { ready } from '../../modules/ready.js';
import { scan } from
'../../../modules/parsing/basic/basil/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translateBasilBasicToQBasic } from
'../../../modules/parsing/basic/basil/translation-to-weblogo/translateBasilBasicToQBasic.js';
import { translateBasilBasicToWebLogo } from
'../../../modules/parsing/basic/basil/translation-to-weblogo/translateBasilBasicToWebLogo.js';

let basilBasicCode;
basilBasicCode = `println "hello"`;
let translationTarget;

function basilParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

function translate(code) {
	if (translationTarget.value === 'WebLogo')
		return translateBasilBasicToWebLogo(code);
	else
		return translateBasilBasicToQBasic(code);
}

function init() {
	translationTarget = document.getElementById('translation-target');
	const genericObject = initGenericParsing(ParseTreeTokenType, basilParse, basilBasicCode, undefined,
	undefined, translate);
	translationTarget.addEventListener('change', genericObject.refreshOutputs);
}

ready(init);