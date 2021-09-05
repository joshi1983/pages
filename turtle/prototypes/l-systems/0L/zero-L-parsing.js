import { initGenericParsing } from '../../helpers/initGenericParsing.js';
import { parse } from '../../../modules/parsing/l-systems/0L/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/l-systems/0L/ParseTreeTokenType.js';
import { translate0LToWebLogo } from 
'../../../modules/parsing/l-systems/0L/translation-to-weblogo/translate0LToWebLogo.js';

let zeroLCode;
zeroLCode = `Axiom = F`;

initGenericParsing(ParseTreeTokenType, parse, zeroLCode, undefined,
	undefined, translate0LToWebLogo);