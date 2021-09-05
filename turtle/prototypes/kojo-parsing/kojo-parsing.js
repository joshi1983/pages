import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/kojo/ParseTreeTokenType.js';
import { translateKojoToWebLogo } from '../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { validateTokensByType } from '../../modules/parsing/kojo/parsing/parse-tree-analysis/validation/validateTokensByType.js';

let kojoCode;
kojoCode = `clear`;

initGenericParsing(ParseTreeTokenType, parse, kojoCode, validateTokensByType, undefined, translateKojoToWebLogo);