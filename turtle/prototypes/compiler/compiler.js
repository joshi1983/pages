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

let webLogoCode = `to backgroundGradient :radius :sunRatio
	localmake "colorStops createPList
	setProperty "colorStops 0 "white
	setProperty "colorStops :sunRatio * 0.8 "yellow
	setProperty "colorStops :sunRatio "orange
	setProperty "colorStops :sunRatio * 1.01 "red
	setProperty "colorStops 1 "#505
	setFillGradient createRadialGradient pos :radius :colorStops
	backgroundVerticalGradient :radius
end

to backgroundVerticalGradient :radius
	localmake "oldPos pos
	localmake "colorStops createPList
	setProperty "colorStops 0 "#0ff8
	setProperty "colorStops 0.4 "#1ff8
	setProperty "colorStops 0.5 "#5ffb
	setProperty "colorStops 0.6 "#1ff8
	setProperty "colorStops 1 "#0ff8
jumpForward 100
	setFillGradient createLinearGradient :oldPos pos :colorStops "pad
	circle :radius
end

to setSkyPenGradient :radius :sunRatio
	localmake "colorStops createPList
	setProperty "colorStops 0 "white
	setProperty "colorStops mix :sunRatio 1 0.5 "yellow
	setProperty "colorStops 1 "red
	setPenGradient createRadialGradient pos :radius :colorStops
end

to drawSunReflection :radius
	localmake "oldPos pos
	localmake "oldHeading heading
	localmake "numLines 32
	localmake "colorStops createPList
	setProperty "colorStops 0 "purple
	setProperty "colorStops 0.3 "purple
	setProperty "colorStops 0.44 "yellow
	setProperty "colorStops 0.5 "white
	setProperty "colorStops 0.56 "yellow
	setProperty "colorStops 0.7 "purple
	setProperty "colorStops 1 "purple
	localmake "fromPos pos
	setFillGradient createLinearGradient :fromPos pos :colorStops "pad
	repeat :numLines [
		localmake "ratio power (repcount - 1) / :numLines 3
		setHeading :oldHeading
		setPos :oldPos
		backward :radius * 0.95 * :ratio
		right 90
		backward :radius * ((0.008 * random 10) - 0.04)
		ellipse :radius * (0.007 - 0.004 * (1 - :ratio)) :radius * (0.2 - 0.18 * :ratio)
	]
end`;

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
		const isCompleteProgram = true;
		analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, isCompleteProgram);
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