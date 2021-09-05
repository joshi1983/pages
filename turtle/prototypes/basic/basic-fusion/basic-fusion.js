import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/other-languages/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/other-languages/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../modules/parsing/other-languages/basic/basic-fusion/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/other-languages/basic/helpers/scanTokensToCode.js';
import { translateBasicFusionToWebLogo } from
'../../../modules/parsing/other-languages/basic/basic-fusion/translation-to-weblogo/translateBasicFusionToWebLogo.js';

let basicFusionCode;
basicFusionCode = `fastgraphics`;

function basicFusionParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

initGenericParsing(ParseTreeTokenType, basicFusionParse, basicFusionCode, undefined,
	undefined, translateBasicFusionToWebLogo);
