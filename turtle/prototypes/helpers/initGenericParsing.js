import { BufferedParseLogger } from '../../modules/parsing/loggers/BufferedParseLogger.js';
import { fetchText } from '../../modules/fetchText.js';
import { parseTreeTokenToElement } from '../../modules/debugging/parse-tree-explorer/parseTreeTokenToElement.js';

export function initGenericParsing(ParseTreeTokenType, parse, code, validateTree) {
	if (validateTree !== undefined && typeof validateTree !== 'function')
		throw new Error(`Either validateTree should be undefined or be a function but got ${validateTree}`);

	let qualityMessagesContainer;
	let lineNumbersContainer;
	let parseTreeContainer;
	let isValidatingAsModule;

	function refreshLineNumbers(code) {
		const numLines = code.split('\n').length;
		lineNumbersContainer.innerText = '';
		for (let i = 0; i < numLines;i++) {
			const lineNumberDiv = document.createElement('div');
			lineNumberDiv.innerText = `${i}`;
			lineNumbersContainer.appendChild(lineNumberDiv);
		}
	}

	function refreshParseTree(tree) {
		const element = parseTreeTokenToElement(tree, ParseTreeTokenType);
		parseTreeContainer.innerText = '';
		parseTreeContainer.appendChild(element);
	}

	function indicateErrorAtLine(lineIndex) {
		const lineNumberDiv = lineNumbersContainer.querySelector(`:scope > div:nth-child(${1 + lineIndex})`);
		if (lineNumberDiv !== null)
			lineNumberDiv.classList.add('error');
	}

	function compareLineNumber(msg1, msg2) {
		return msg1.token.lineIndex - msg2.token.lineIndex;
	}

	function refereshQualityMessageContainerForParseTree(root) {
		const logger = new BufferedParseLogger();
		if (validateTree !== undefined)
			validateTree(root, logger);
		qualityMessagesContainer.innerHTML = '';
		const messages = logger.getMessages();
		messages.sort(compareLineNumber);
		messages.forEach(function(msg) {
			const div = document.createElement('div');
			const msgSpan = document.createElement('span');
			if (msg.isHTML)
				msgSpan.innerHTML = msg.msg;
			else
				msgSpan.innerText = msg.msg;
			const lineNumber = document.createElement('span');
			lineNumber.innerText = `Line ${msg.token.lineIndex}`;
			lineNumber.classList.add('line-number');
			div.appendChild(lineNumber);
			div.appendChild(msgSpan);
			qualityMessagesContainer.appendChild(div);
			indicateErrorAtLine(msg.token.lineIndex);
		});
	}

	function refreshOutputsForCode(code) {
		const parseResult = parse(code);
		refreshLineNumbers(code);
		refereshQualityMessageContainerForParseTree(parseResult.root);
		refreshParseTree(parseResult.root);
	}

	function init() {
		const textarea = document.querySelector('textarea');
		qualityMessagesContainer = document.getElementById('quality-messages');
		lineNumbersContainer = document.getElementById('code-input-line-numbers');
		parseTreeContainer = document.getElementById('parse-tree');
		function refreshOutputs() {
			refreshOutputsForCode(textarea.value);
		}
		textarea.addEventListener('input', refreshOutputs);
		textarea.value = code;
		refreshOutputs();
	}

	if (document.readyState === 'loading')
		document.addEventListener('DOMContentLoaded', init);
	else
		init();
}