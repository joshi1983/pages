import { analyzeQuality } from '../../modules/parsing/other-languages/js-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/other-languages/js-parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/other-languages/js-parsing/ParseTreeTokenType.js';
import { translateTurtleToyNetToWebLogo } from
'../../modules/parsing/other-languages/turtletoy-net/translation-to-weblogo/translateTurtleToyNetToWebLogo.js';

let turtleToyCode;
turtleToyCode = `penUp()`;
const validateCode = undefined;

initGenericParsing(ParseTreeTokenType, parse, turtleToyCode, analyzeQuality,
	validateCode, translateTurtleToyNetToWebLogo);