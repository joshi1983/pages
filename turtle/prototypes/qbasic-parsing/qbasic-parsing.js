import { analyzeQuality } from
'../../modules/parsing/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/qbasic/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { translate } from
'../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

let qbasicCode;
qbasicCode = `TYPE TestType
    dataElement AS _BYTE
END TYPE

DIM a(4) AS TestType`;

initGenericParsing(ParseTreeTokenType, parse, qbasicCode, analyzeQuality, undefined, translate);