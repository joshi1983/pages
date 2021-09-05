import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/kojo/ParseTreeTokenType.js';

let kojoCode;
kojoCode = `clear`;
const validateTokensByType = undefined;

initGenericParsing(ParseTreeTokenType, parse, kojoCode, validateTokensByType);