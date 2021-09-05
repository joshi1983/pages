import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { scan } from
'../../../modules/parsing/basic/basic-fusion/scanning/scan.js';
import { scanTokensToCode } from
'../../../modules/parsing/basic/helpers/scanTokensToCode.js';
import { translateBasicFusionToWebLogo } from
'../../../modules/parsing/basic/basic-fusion/translation-to-weblogo/translateBasicFusionToWebLogo.js';

let basicFusionCode;
basicFusionCode = `fastgraphics`;

function basicFusionParse(code) {
	const tokens = scan(code);
	const s = scanTokensToCode(tokens);
	return parse(s);
}

initGenericParsing(ParseTreeTokenType, basicFusionParse, basicFusionCode, undefined,
	undefined, translateBasicFusionToWebLogo);
