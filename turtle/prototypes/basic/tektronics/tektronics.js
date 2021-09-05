import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from
'../../../modules/parsing/other-languages/basic/qbasic/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/other-languages/basic/qbasic/ParseTreeTokenType.js';
import { ready } from
'../../../modules/ready.js';
import { scan } from
'../../../modules/parsing/other-languages/basic/texas-instruments-99-4a/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/other-languages/basic/helpers/scanTokensToCode.js';
import { translateTektronix405XBasicToQBasic } from
'../../../modules/parsing/other-languages/basic/tektronix-405x-basic/translation-to-weblogo/translateTektronix405XBasicToQBasic.js';
import { translateTektronix405XBasicToWebLogo } from
'../../../modules/parsing/other-languages/basic/tektronix-405x-basic/translation-to-weblogo/translateTektronix405XBasicToWebLogo.js';

let tekBasicCode;
tekBasicCode = ``;
let destinationLanguage;

function translate(code) {
	if (destinationLanguage.value.toLowerCase() === 'weblogo')
		return translateTektronix405XBasicToWebLogo(code);
	else
		return translateTektronix405XBasicToQBasic(code);
}

function parseTranslated(code) {
	const translated = translate(code);
	return parse(translated);
}

function initializeTargetLanguageOptions() {
	for (const value of ['QBasic', 'WebLogo']) {
		const option = document.createElement('option');
		option.value = value;
		option.innerText = value;
		destinationLanguage.appendChild(option);
	}
}

function init() {
	const analyzeQuality = undefined;
	destinationLanguage = document.getElementById('destination-language');
	initializeTargetLanguageOptions();
	input = document.getElementById('input');
	const genericObject = initGenericParsing(ParseTreeTokenType, parseTranslated,
	tekBasicCode, analyzeQuality, undefined, translate);
	input.addEventListener('change', genericObject.refreshOutputs);
	destinationLanguage.addEventListener('change', genericObject.refreshOutputs);
}

ready(init);
