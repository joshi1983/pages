import { analyzeQuality } from
'../../modules/parsing/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/qbasic/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { translate } from
'../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

let qbasicCode;
qbasicCode = `TYPE Ant
	x as integer
end TYPE

NumAnts = 30

DIM Ants(1 TO NumAnts) AS Ant`;

initGenericParsing(ParseTreeTokenType, parse, qbasicCode, analyzeQuality, undefined, translate);