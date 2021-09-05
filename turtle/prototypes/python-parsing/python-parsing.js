import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { asyncInit, parse } from '../../modules/parsing/python-parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { translatePythonCodeToWebLogo } from
'../../modules/parsing/python-parsing/translatePythonCodeToWebLogo.js';
await asyncInit();

let pythonCode;
pythonCode = `import turtle
turtle.forward(100)`;

initGenericParsing(ParseTreeTokenType, parse, pythonCode, 
	undefined, undefined, translatePythonCodeToWebLogo);