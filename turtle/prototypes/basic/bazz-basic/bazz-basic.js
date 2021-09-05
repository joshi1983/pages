import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../modules/parsing/basic/bazz-basic/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translateBazzBasicToWebLogo } from
'../../../modules/parsing/basic/bazz-basic/translation-to-weblogo/translateBazzBasicToWebLogo.js';

let bazzBasicCode;
bazzBasicCode = `[sub:s]`;

function bazzBasicParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

initGenericParsing(ParseTreeTokenType, bazzBasicParse, bazzBasicCode, undefined,
	undefined, translateBazzBasicToWebLogo);
