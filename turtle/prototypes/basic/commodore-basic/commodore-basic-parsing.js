import { analyzeQuality } from
'../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { insertSpaces, translateCommodoreBasicToQBasic } from
'../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToQBasic.js';
import { translateCommodoreBasicToWebLogo } from
'../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToWebLogo.js';

let commodoreBasicCode;
commodoreBasicCode = `w=5:mx=319:my=200
for x=0 to mx step w
 line,x,0,mx-x,my:ifx<=my then line,0,x,mx,my-x
next`;
let translationTarget = document.getElementById('translation-target');

function commodoreBasicParse(code) {
	const result = parse(code);
	return result;
}

function translate(code) {
	if (translationTarget.value === 'insert-spaces') {
		return insertSpaces(code);
	}
	else if (translationTarget.value === 'WebLogo')
		return translateCommodoreBasicToWebLogo(code);
	else
		return translateCommodoreBasicToQBasic(code);
}

const genericObject = initGenericParsing(ParseTreeTokenType, commodoreBasicParse, commodoreBasicCode, analyzeQuality,
	undefined, translate);

translationTarget.addEventListener('change', genericObject.refreshOutputs);