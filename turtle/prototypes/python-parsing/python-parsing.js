import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { asyncInit, parse } from '../../modules/parsing/python-parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { translatePythonCodeToWebLogo } from
'../../modules/parsing/python-parsing/translatePythonCodeToWebLogo.js';
await asyncInit();

let pythonCode;
pythonCode = `for _ in range(4):
	print(_)

print("after loop and printing 1 time")`;

initGenericParsing(ParseTreeTokenType, parse, pythonCode, 
	undefined, undefined, translatePythonCodeToWebLogo);