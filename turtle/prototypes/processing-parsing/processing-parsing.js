import { analyzeQuality } from
'../../modules/parsing/processing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from
'../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../modules/parsing/processing/ParseTreeTokenType.js';

let processingCode;
processingCode = `true && false`;

initGenericParsing(ParseTreeTokenType, parse, processingCode, analyzeQuality);