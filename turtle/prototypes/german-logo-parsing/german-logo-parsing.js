import { BufferedParseLogger } from
'../../modules/parsing/loggers/BufferedParseLogger.js';
import { germanLogoToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/german-logo/germanLogoToWebLogo.js';
import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { LogoParser } from
'../../modules/parsing/LogoParser.js';
import { parseTreeTokenToElement } from
'../../modules/debugging/parse-tree-explorer/parseTreeTokenToElement.js';
import { ParseTreeTokenType } from
'../../modules/parsing/ParseTreeTokenType.js';
import { ready } from
'../../modules/ready.js';
import { refreshLineNumbers } from '../helpers/refreshLineNumbers.js';

const initialCode = `; Copied from: https://archive.org/details/logo-lern-und-arbeitsbuch/page/31/mode/2up
PR VERDOPPLUNG :X
	RUECKGABE 2 * :X
ENDE

SETZE "X 18 + VERDOPPLUNG 19
WERT "X`;

function init() {
	const lineNumberContainer = document.getElementById('code-input-line-numbers');
	const parseTreeContainer = document.getElementById('parse-tree-explorer');
	const translated = document.getElementById('code-translated');
	const input = document.getElementById('input');
	input.value = initialCode;

	function refreshCodeOutputs() {
		const parseLogger = new BufferedParseLogger();
		let code = input.value;
		code = germanLogoToWebLogo(code);
		translated.innerText = code;
		const tree = LogoParser.getParseTree(code, parseLogger);

		refreshLineNumbers(lineNumberContainer, code);
		parseTreeContainer.innerText = '';
		if (tree !== undefined)
			parseTreeContainer.appendChild(parseTreeTokenToElement(tree, ParseTreeTokenType));
	}
	input.addEventListener('keyup', refreshCodeOutputs);
	input.addEventListener('input', refreshCodeOutputs);
}

ready(init);