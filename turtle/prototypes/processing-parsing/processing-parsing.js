import { analyzeQuality } from
'../../modules/parsing/processing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { asyncInit as asyncInitCreateParameterizedGroups } from
'../../modules/parsing/createParameterizedGroups.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from
'../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../modules/parsing/processing/ParseTreeTokenType.js';
import { translateProcessingToWebLogo } from
'../../modules/parsing/processing/translation-to-weblogo/translateProcessingToWebLogo.js';

let processingCode;
processingCode = `true && false`;
const validateCode = undefined;

await asyncInitCreateParameterizedGroups();

initGenericParsing(ParseTreeTokenType, parse, processingCode, analyzeQuality,
	validateCode, translateProcessingToWebLogo);