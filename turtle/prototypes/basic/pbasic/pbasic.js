import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../modules/parsing/basic/pbasic/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translatePBasicToWebLogo } from
'../../../modules/parsing/basic/pbasic/translation-to-weblogo/translatePBasicToWebLogo.js';

let pBasicCode;
pBasicCode = `func f() {}`;

function pBasicParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

initGenericParsing(ParseTreeTokenType, pBasicParse, pBasicCode, undefined,
	undefined, translatePBasicToWebLogo);
