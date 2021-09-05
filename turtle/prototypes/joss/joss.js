import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from
'../../modules/parsing/other-languages/joss/parsing/parse.js';
import { ParseTreeTokenType } from
'../../modules/parsing/other-languages/joss/ParseTreeTokenType.js';
import { translateJossToWebLogo } from
'../../modules/parsing/other-languages/joss/translation-to-weblogo/translateJossToWebLogo.js';
import { validateTokensByType } from
'../../modules/parsing/other-languages/joss/parsing/parse-tree-analysis/validation/validateTokensByType.js';

let jossCode;
jossCode = `Set x=3.`;

initGenericParsing(ParseTreeTokenType, parse, jossCode,
	validateTokensByType, undefined, translateJossToWebLogo);