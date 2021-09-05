import { AlphaColour } from
'../../modules/AlphaColour.js';
import { analyzeCodeQuality } from
'../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { BufferedParseLogger } from
'../../modules/parsing/loggers/BufferedParseLogger.js';
import { Colour } from
'../../modules/Colour.js';
import { compile } from
'../../modules/parsing/compile.js';
import { compileOptionsArray } from
'../../tests/parsing/execution/compileOptionsArray.js';
import { fetchText } from
'../../modules/fetchText.js';
import { getProceduresMap } from
'../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { GraphicsScreen } from
'../../modules/components/GraphicsScreen.js';
import { LogoParser } from
'../../modules/parsing/LogoParser.js';
import { LogoProgramExecuter } from
'../../modules/parsing/execution/LogoProgramExecuter.js';
import { messageToDivNoProcessLinks } from
'../../modules/components/messageToDivNoProcessLinks.js';
import { Turtle } from
'../../modules/command-groups/Turtle.js';
import { Vector2DDrawing } from
'../../modules/drawing/vector/Vector2DDrawing.js';
await AlphaColour.asyncInit();
await LogoParser.asyncInit();

const initialCode = await fetchText('prototypes/bounding-box/initial-code.txt');
const codeInput = document.getElementById('input');
const lineNumbersContainer = document.getElementById('code-input-line-numbers');
const errorMessages = document.getElementById('error-messages');
const didNotHaltElement = document.getElementById('did-not-halt-message');

function refreshLineNumbers() {
	const code = codeInput.value;
	const numLines = code.split('\n').length;
	lineNumbersContainer.innerText = '';
	for (let i = 0; i < numLines;i++) {
		const lineNumberDiv = document.createElement('div');
		lineNumberDiv.innerText = `${i}`;
		lineNumbersContainer.appendChild(lineNumberDiv);
	}
}

function refreshOutputsForCode() {
	const code = codeInput.value;
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
		const compileOptions = compileOptionsArray[compileOptionsArray.length - 1];
		const extraProcedures = new Map();
		const initialVariables = new Map();
		const logoProgram = compile(code, tree, parseLogger, extraProcedures, compileOptions, initialVariables);
		const settings = {
			'animationDurationSeconds': 10,
			'animationTime': 0
		};
		const drawing = new Vector2DDrawing();
		const turtle = new Turtle(settings, drawing);
		const executer = new LogoProgramExecuter(turtle, logoProgram);
		const numInstructions = 5000;
		executer.addEventListener('exception', function(eventDetails) {
			const messageDiv = document.createElement('div');
			messageDiv.innerText = `An runtime exception was thrown.  Message: ${eventDetails.details.msg}`;
			errorMessages.appendChild(messageDiv);
		});
		executer.executeInstructionsSync(numInstructions);
		if (executer.isPausedOrHalted())
			didNotHaltElement.classList.add('hidden');
		else
			didNotHaltElement.classList.remove('hidden');
		GraphicsScreen.drawing = drawing;
		const box = drawing.getBoundingBox();
		turtle.setFillColor(new AlphaColour('#8f00'));
		turtle.setPenSize(1);
		turtle.setPenColor(new Colour('#f00'));
		turtle.jumpTo([box.getAverageX(), box.getAverageY()]);
		turtle.rect(box.max.getX() - box.min.getX(), box.max.getY() - box.min.getY());
		GraphicsScreen.redraw();
		executer.disconnect();
		refreshLineNumbers();
	}
}

function refreshDrawing() {
	// compile the program.
	refreshOutputsForCode();
}

function init() {
	codeInput.value = initialCode;
	codeInput.addEventListener('input', refreshDrawing);
	refreshDrawing();
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();