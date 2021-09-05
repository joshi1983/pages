import { analyzeQuality } from
'../../modules/parsing/processing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from
'../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../modules/parsing/processing/ParseTreeTokenType.js';
import { translate } from
'../../modules/parsing/processing/translation-to-weblogo/translate.js';

let processingCode;
processingCode = `true && false`;
const validateCode = undefined;

initGenericParsing(ParseTreeTokenType, parse, processingCode, analyzeQuality, validateCode, translate);