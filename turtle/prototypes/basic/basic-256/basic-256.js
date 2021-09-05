import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../modules/parsing/basic/basic-256/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translateBasic256ToWebLogo } from
'../../../modules/parsing/basic/basic-256/translation-to-weblogo/translateBasic256ToWebLogo.js';

let basic256Code;
basic256Code = `pause 0.1`;

function basic256Parse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

initGenericParsing(ParseTreeTokenType, basic256Parse, basic256Code, undefined,
	undefined, translateBasic256ToWebLogo);
