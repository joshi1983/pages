import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from
'../../modules/parsing/other-languages/kturtle/parse.js';
import { ParseTreeTokenType } from
'../../modules/parsing/other-languages/kturtle/ParseTreeTokenType.js';
import { validateTokensByType } from
'../../modules/parsing/other-languages/kturtle/parsing/parse-tree-analysis/validation/validateTokensByType.js';

let kturtleCode;
kturtleCode = `true and (false and 3 < 4)`;

initGenericParsing(ParseTreeTokenType, parse, kturtleCode, validateTokensByType);