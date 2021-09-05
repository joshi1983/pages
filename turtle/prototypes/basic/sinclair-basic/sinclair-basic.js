import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../modules/parsing/basic/sinclair-basic/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translateSinclairBasicToWebLogo } from
'../../../modules/parsing/basic/sinclair-basic/translation-to-weblogo/translateSinclairBasicToWebLogo.js';

let sinclairBasicCode;
sinclairBasicCode = ``;

function sinclairBasicParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

initGenericParsing(ParseTreeTokenType, sinclairBasicParse, sinclairBasicCode, undefined,
	undefined, translateSinclairBasicToWebLogo);
