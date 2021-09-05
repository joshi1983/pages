import { analyzeQuality } from
'../../modules/parsing/pov-ray/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { BufferedParseLogger } from '../../modules/parsing/loggers/BufferedParseLogger.js';
import { CachedParseTree } from '../../modules/parsing/pov-ray/parsing/parse-tree-analysis/CachedParseTree.js';
import { fetchText } from '../../modules/fetchText.js';
import { parse } from '../../modules/parsing/pov-ray/parse.js';
import { parseTreeTokenToElement } from '../../modules/debugging/parse-tree-explorer/parseTreeTokenToElement.js';
import { ParseTreeTokenType } from '../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { ready } from '../../modules/ready.js';
import { sanitize } from '../../modules/parsing/pov-ray/translation-to-weblogo/sanitization/sanitize.js';

let code = await fetchText('tests/data/pov-ray/tetrahedron_vectors_1.txt');
/*code = `#local Sky_Dimmer = 0.25; 

light_source{<1500,2500,-2500> color White*0.9*Sky_Dimmer media_interaction off}`;
*//*

*/
let qualityMessagesContainer;
let lineNumbersContainer;
let parseTreeContainer;
let sanitizeInput;
let isSanitizing;

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
	const parseResult = parse(code);
	if (isSanitizing)
		sanitize(parseResult.root);
	refreshLineNumbers(code);
	refereshQualityMessageContainerForParseTree(parseResult.root);
	refreshParseTree(parseResult.root);
}

function refreshIsSanitizing(textarea) {
	return function() {
		isSanitizing = sanitizeInput.checked;
		refreshOutputsForCode(textarea.value);
	};
}

function init() {
	const textarea = document.querySelector('textarea');
	qualityMessagesContainer = document.getElementById('quality-messages');
	lineNumbersContainer = document.getElementById('code-input-line-numbers');
	parseTreeContainer = document.getElementById('parse-tree');
	sanitizeInput = document.getElementById('sanitize');
	sanitizeInput.addEventListener('click', refreshIsSanitizing(textarea));
	function refreshOutputs() {
		refreshOutputsForCode(textarea.value);
	}
	refreshIsSanitizing(textarea)();
	textarea.addEventListener('input', refreshOutputs);
	textarea.value = code;
	refreshOutputs();
}

ready(init);