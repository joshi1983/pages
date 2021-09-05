import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/other-languages/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/other-languages/basic/qbasic/ParseTreeTokenType.js';
import { ready } from
'../../../modules/ready.js';
import { scan } from
'../../../modules/parsing/other-languages/basic/htbasic/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/other-languages/basic/helpers/scanTokensToCode.js';
import { translateHTBasicToQBasic } from
'../../../modules/parsing/other-languages/basic/htbasic/translation-to-weblogo/translateHTBasicToQBasic.js';
import { translateHTBasicToWebLogo } from
'../../../modules/parsing/other-languages/basic/htbasic/translation-to-weblogo/translateHTBasicToWebLogo.js';

let code = `print lgt 10`;
let translationTarget;

function htbasicParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

function translate(code) {
	if (translationTarget.value === 'WebLogo')
		return translateHTBasicToWebLogo(code);
	else
		return translateHTBasicToQBasic(code);
}

function init() {
	translationTarget = document.getElementById('translation-target');
	const genericObject = initGenericParsing(ParseTreeTokenType, htbasicParse, code, undefined,
	undefined, translate);

	translationTarget.addEventListener('change', genericObject.refreshOutputs);
}

ready(init);