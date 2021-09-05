import { analyzeQuality } from
'../../../modules/parsing/other-languages/pascal/turing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from
'../../../modules/parsing/other-languages/pascal/turing/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { translateTuringToWebLogo } from
'../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

let turingCode;
turingCode = `put "hello world"`;

initGenericParsing(ParseTreeTokenType, parse, turingCode,
	analyzeQuality, undefined, translateTuringToWebLogo);