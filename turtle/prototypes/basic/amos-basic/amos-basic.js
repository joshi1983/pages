import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../modules/parsing/basic/amos-basic/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translateAmosBasicToWebLogo } from
'../../../modules/parsing/basic/amos-basic/translation-to-weblogo/translateAmosBasicToWebLogo.js';

let amosBasicCode;
amosBasicCode = `add x,2`;

function amosParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

initGenericParsing(ParseTreeTokenType, amosParse, amosBasicCode, undefined,
	undefined, translateAmosBasicToWebLogo);
