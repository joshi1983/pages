import { BufferedParseLogger } from
'../../modules/parsing/loggers/BufferedParseLogger.js';
import { LogoParser } from
'../../modules/parsing/LogoParser.js';
import { messageToDiv } from '../helpers/messageToDiv.js';
import { parseTreeTokenToElement } from
'../../modules/debugging/parse-tree-explorer/parseTreeTokenToElement.js';
import { ParseTreeTokenType } from
'../../modules/parsing/ParseTreeTokenType.js';
import { ready } from
'../../modules/ready.js';
import { refreshLineNumbers } from '../helpers/refreshLineNumbers.js';

function init() {
	const errorMessages = document.getElementById('error-messages');
	const lineNumberContainer = document.getElementById('code-input-line-numbers');
	const parseTreeContainer = document.getElementById('parse-tree-explorer');
	const input = document.getElementById('input');
	function refreshCodeOutputs() {
		const parseLogger = new BufferedParseLogger();
		const code = input.value;
		const tree = LogoParser.getParseTree(code, parseLogger);
		errorMessages.innerText = '';
		errorMessages.classList.remove('error');
		if (parseLogger.hasLoggedErrors()) {
			errorMessages.classList.add('error');
			parseLogger.getMessages().forEach(function(msg) {
				errorMessages.appendChild(messageToDiv(msg));
			});
		}
		refreshLineNumbers(lineNumberContainer, code);
		parseTreeContainer.innerText = '';
		if (tree !== undefined)
			parseTreeContainer.appendChild(parseTreeTokenToElement(tree, ParseTreeTokenType));
	}
	input.addEventListener('keyup', refreshCodeOutputs);
	input.addEventListener('input', refreshCodeOutputs);
}

ready(init);