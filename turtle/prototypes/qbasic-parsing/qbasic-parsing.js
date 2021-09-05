import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/qbasic/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { analyzeQuality } from
'../../modules/parsing/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';

let qbasicCode;
qbasicCode = `print "hi";x`;

initGenericParsing(ParseTreeTokenType, parse, qbasicCode, analyzeQuality);