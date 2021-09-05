import { analyzeQuality } from
'../../modules/parsing/css/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { BufferedParseLogger } from '../../modules/parsing/loggers/BufferedParseLogger.js';
import { fetchText } from '../../modules/fetchText.js';
import { parse } from '../../modules/parsing/css/parse.js';
import { parseTreeTokenToElement } from '../../modules/debugging/parse-tree-explorer/parseTreeTokenToElement.js';
import { ParseTreeTokenType } from '../../modules/parsing/css/ParseTreeTokenType.js';

let code = `.prefixed-container {  } `;
let qualityMessagesContainer;
let lineNumbersContainer;
let parseTreeContainer;
let isCompleteSheet = false;

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
	analyzeQuality(root, logger);
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
	let settings;
	if (isCompleteSheet)
		settings = {};
	const parseResult = parse(code, settings);
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
	function bindCompleteSheetCheckbox() {
		const input = document.getElementById('is-complete-css-sheet');
		function checkboxChanged() {
			isCompleteSheet = input.checked;
			refreshOutputs();
		}
		input.addEventListener('change', checkboxChanged);
		checkboxChanged();
	}
	textarea.addEventListener('input', refreshOutputs);
	textarea.value = code;
	bindCompleteSheetCheckbox();
	refreshOutputs();
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();