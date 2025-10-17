import { analyzeQuality } from
'../../modules/parsing/python-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { newTranslatePythonCodeToWebLogo } from '../../modules/parsing/python-parsing/newTranslatePythonCodeToWebLogo.js';
import { parse } from '../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from '../../modules/parsing/python-parsing/ParseTreeTokenType.js';

let pythonCode;
pythonCode = `def f(arg1, *argv):
	print(arg1)

f(0, 1)`;

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