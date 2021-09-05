import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../modules/parsing/basic/micro-a/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translateMicroABasicToWebLogo } from
'../../../modules/parsing/basic/micro-a/translation-to-weblogo/translateMicroABasicToWebLogo.js';

let microABasicCode;
microABasicCode = `func f()
endFn`;

function microAParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

initGenericParsing(ParseTreeTokenType, microAParse, microABasicCode, undefined,
	undefined, translateMicroABasicToWebLogo);
