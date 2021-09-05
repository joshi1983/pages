import { analyzeQuality } from '../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { translateTurtleToyNetToWebLogo } from
'../../modules/parsing/turtletoy-net/translation-to-weblogo/translateTurtleToyNetToWebLogo.js';

let turtleToyCode;
turtleToyCode = `penUp()`;
const validateCode = undefined;

initGenericParsing(ParseTreeTokenType, parse, turtleToyCode, analyzeQuality,
	validateCode, translateTurtleToyNetToWebLogo);