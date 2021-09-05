import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/other-languages/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/other-languages/basic/qbasic/ParseTreeTokenType.js';
import { ready } from
'../../../modules/ready.js';
import { scan } from
'../../../modules/parsing/other-languages/basic/liberty-basic/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/other-languages/basic/helpers/scanTokensToCode.js';
import { translateLibertyBasicToQBasic } from
'../../../modules/parsing/other-languages/basic/liberty-basic/translation-to-weblogo/translateLibertyBasicToQBasic.js';
import { translateLibertyBasicToWebLogo } from
'../../../modules/parsing/other-languages/basic/liberty-basic/translation-to-weblogo/translateLibertyBasicToWebLogo.js';

let code = `print lgt 10`;
let translationTarget;

function libertyBasicParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

function translate(code) {
	if (translationTarget.value === 'WebLogo')
		return translateLibertyBasicToWebLogo(code);
	else
		return translateLibertyBasicToQBasic(code);
}

function init() {
	translationTarget = document.getElementById('translation-target');
	const genericObject = initGenericParsing(ParseTreeTokenType, libertyBasicParse, code, undefined,
	undefined, translate);

	translationTarget.addEventListener('change', genericObject.refreshOutputs);
}

ready(init);