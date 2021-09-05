import { analyzeQuality } from '../../modules/parsing/other-languages/js-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/other-languages/js-parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/other-languages/js-parsing/ParseTreeTokenType.js';
import { translateTurtleGraphicsFunToWebLogo } from
'../../modules/parsing/other-languages/turtle-graphics-fun/translation-to-weblogo/translateTurtleGraphicsFunToWebLogo.js';

let turtleGFCode;
turtleGFCode = `penUp()`;
const validateCode = undefined;

initGenericParsing(ParseTreeTokenType, parse, turtleGFCode, analyzeQuality,
	validateCode, translateTurtleGraphicsFunToWebLogo);