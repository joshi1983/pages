import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parse } from '../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/python-parsing/ParseTreeTokenType.js';

let pythonCode;
pythonCode = `import turtle
turtle.forward(100)`;

initGenericParsing(ParseTreeTokenType, parse, pythonCode, 
	undefined, undefined, undefined);