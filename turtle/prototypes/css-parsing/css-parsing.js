import { analyzeQuality } from
'../../modules/parsing/css/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/css/ParseTreeTokenType.js';

let code = `.prefixed-container {  } `;
initGenericParsing(ParseTreeTokenType, parse, code, analyzeQuality);