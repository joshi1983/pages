import { analyzeQuality } from
'../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { asyncInit as asyncInitCreateParameterizedGroups } from
'../../modules/parsing/createParameterizedGroups.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from
'../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { translateJSProcessingToWebLogo } from
'../../modules/parsing/processing/js-processing/translation-to-weblogo/translateJSProcessingToWebLogo.js';

let processingCode;
processingCode = `true && false`;
const validateCode = undefined;

await asyncInitCreateParameterizedGroups();

initGenericParsing(ParseTreeTokenType, parse, processingCode, analyzeQuality,
	validateCode, translateJSProcessingToWebLogo);