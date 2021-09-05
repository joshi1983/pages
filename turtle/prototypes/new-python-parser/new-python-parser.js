import { analyzeQuality } from
'../../modules/parsing/python-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { newTranslatePythonCodeToWebLogo } from '../../modules/parsing/python-parsing/newTranslatePythonCodeToWebLogo.js';
import { parse } from '../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/python-parsing/ParseTreeTokenType.js';

let pythonCode;
pythonCode = `for _ in range(4):
	print(_)

print("after loop and printing 1 time")`;

let sanitizeScanTokens;

function parseWithSanitizationCheckValue(code) {
	if (sanitizeScanTokens === undefined)
		return parse(code);
	else
		return parse(code, sanitizeScanTokens.checked);
}

const genericInfo = initGenericParsing(ParseTreeTokenType, parseWithSanitizationCheckValue, pythonCode, 
	analyzeQuality, undefined, newTranslatePythonCodeToWebLogo);
	
function init() {
	sanitizeScanTokens = document.getElementById('sanitizeScanTokens');
	sanitizeScanTokens.addEventListener('input', genericInfo.refreshOutputs);
}

init();