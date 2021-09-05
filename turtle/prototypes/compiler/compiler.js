import { analyzeCodeQuality } from '../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { bindIntermediateCodeExplorer } from '../../modules/debugging/intermediate-code-explorer/bindIntermediateCodeExplorer.js';
import { BufferedParseLogger } from '../../modules/parsing/loggers/BufferedParseLogger.js';
import { compile } from '../../modules/parsing/compile.js';
import { compileOptionsArray } from '../../tests/parsing/execution/compileOptionsArray.js';
import { fetchText } from '../../modules/fetchText.js';
import { getProceduresMap } from '../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { messageToDivNoProcessLinks } from '../../modules/components/messageToDivNoProcessLinks.js';
import { showCompilerOptionsReport } from './showCompilerOptionsReport.js';
import { showExecutionReport } from './showExecutionReport.js';

let webLogoCode = `make "oldPos pos
make "size 100 * 0.5
make "bottomLeft pos
jumpForward 100
make "lines [ [ :oldPos :bottomLeft ] [ :bottomLeft pos ] ]
jumpTo :oldPos
jumpForward 5
right 90

make "result -1
repeat count :lines [
	make "line item repcount :lines
	make "len distanceToLine first :line last :line
	print :len
	print and :len > 0 ( or :result < 0 :len < :result )
	if and :len > 0 ( or :result < 0 :len < :result ) [
		print 'in if statement'
		make "result :len
	]
]

print :result`;

let instructionsContainer;
let lineNumbersContainer;
let compileOptionsSelect;
let errorMessages;

function refreshLineNumbers(code) {
	const numLines = code.split('\n').length;
	lineNumbersContainer.innerText = '';
	for (let i = 0; i < numLines;i++) {
		const lineNumberDiv = document.createElement('div');
		lineNumberDiv.innerText = `${i}`;
		lineNumbersContainer.appendChild(lineNumberDiv);
	}
}

function refreshOutputsForCode(code) {
	const parseLogger = new BufferedParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (!parseLogger.hasLoggedErrors()) {
		const extra = new Map();
		const proceduresMap = getProceduresMap(tree, extra);
		const initialVariablesMap = new Map();
		analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, {'isCompleteProgram': true});
	}
	errorMessages.innerText = '';
	errorMessages.classList.remove('error');
	if (parseLogger.hasLoggedErrors()) {
		errorMessages.classList.add('error');
		parseLogger.getMessages().forEach(function(msg) {
			const row = document.createElement('div');
			const msgDiv = messageToDivNoProcessLinks(msg.msg, msg.type, msg.isHTML);
			msgDiv.classList.add('msg');
			const lineNum = document.createElement('div');
			lineNum.innerText = '' + msg.token.lineIndex;
			lineNum.classList.add('line-number');
			row.appendChild(lineNum);
			row.appendChild(msgDiv);
			errorMessages.appendChild(row);
		});
	}
	else {
		const index = parseInt(compileOptionsSelect.value);
		const compileOptions = compileOptionsArray[index];
		const extraProcedures = new Map();
		const initialVariables = new Map();
		const logoProgram = compile(code, tree, parseLogger, extraProcedures, compileOptions, initialVariables);
		refreshLineNumbers(code);
		bindIntermediateCodeExplorer(logoProgram);
	}
}

function fillCompileOptions() {
	let lastOption;
	compileOptionsArray.forEach(function(compileOptions, index) {
		const option = document.createElement('option');
		option.value = index;
		option.innerText = compileOptions.name;
		compileOptionsSelect.appendChild(option);
		lastOption = option;
	});
	lastOption.selected = true;
}

function bindShowExecutionReport() {
	const button = document.getElementById('show-execution-report');
	const textarea = document.querySelector('textarea');
	button.addEventListener('click', function() {
		showExecutionReport(textarea.value);
	});
}

function bindShowCompilerOptions() {
	const button = document.getElementById('compile-options-report');
	const textarea = document.querySelector('textarea');
	button.addEventListener('click', function() {
		showCompilerOptionsReport(textarea.value);
	});
}

function init() {
	const textarea = document.querySelector('textarea');
	bindShowExecutionReport();
	bindShowCompilerOptions();
	instructionsContainer = document.getElementById('instructions-container');
	lineNumbersContainer = document.getElementById('code-input-line-numbers');
	compileOptionsSelect = document.getElementById('compile-options');
	errorMessages = document.getElementById('error-messages');
	fillCompileOptions();
	function refreshOutputs() {
		refreshOutputsForCode(textarea.value);
	}
	textarea.addEventListener('input', refreshOutputs);
	textarea.addEventListener('keyup', refreshOutputs);
	textarea.value = webLogoCode;
	compileOptionsSelect.addEventListener('change', refreshOutputs);
	refreshOutputs();
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();