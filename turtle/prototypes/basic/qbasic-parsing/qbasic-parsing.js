import { analyzeQuality } from
'../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { translateQBASICToWebLogo } from
'../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

let qbasicCode;
qbasicCode = `TYPE TestType
    dataElement AS _BYTE
END TYPE

DIM a(4) AS TestType`;

initGenericParsing(ParseTreeTokenType, parse, qbasicCode, analyzeQuality, undefined, translateQBASICToWebLogo);