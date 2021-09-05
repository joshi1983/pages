import { analyzeCodeQuality } from '../parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { Code } from './code-editor/Code.js';
import { CommandBoxMessages } from './CommandBoxMessages.js';
import { CommandBoxParseLogger } from '../parsing/loggers/CommandBoxParseLogger.js';
import { compile } from '../parsing/compile.js';
import { compositeAction } from './command-input/compositeAction.js';
import { Keys } from './Keys.js';
import { fixCode } from './code-editor/code-fixer/fixCode.js';
import { LogoParser } from '../parsing/LogoParser.js';
import { LogoProgramExecuter } from '../parsing/execution/LogoProgramExecuter.js';
import { ParseLogger } from '../parsing/loggers/ParseLogger.js';
import { PastableCodeDispatcher } from '../help/processPastableCode.js';
import { Settings } from '../Settings.js';
const input = document.getElementById('command-input');
const runButton = document.getElementById('command-input-run');
const executer = Settings.executer;

function tryRunCode() {
	const c = input.value;
	CommandBoxMessages.addCodeSnippet(c);
	if (!compositeAction(c)) {
		executer.startContinuousExecution();
		CommandBoxParseLogger.resetErrorCounter();
		let proceduresMap = new Map();
		if (Code.latestProgram)
			proceduresMap = Code.latestProgram.procedures;
		const tree = LogoParser.getParseTree(c, CommandBoxParseLogger, proceduresMap);
		const initialVariables = executer.executionContext === undefined ? new Map() : executer.executionContext.globalVariables;
		analyzeCodeQuality(tree, CommandBoxParseLogger, proceduresMap, initialVariables, false);
		if (CommandBoxParseLogger.hasLoggedErrors()) {
			const fixed = fixCode(c, new ParseLogger(), proceduresMap);
			if (fixed !== c) {
				CommandBoxParseLogger.tip(`Try this instead: <code class="commander-pastable">${fixed}</code>`, tree, true);
			}
		}
		else {
			const program = compile(c, tree, CommandBoxParseLogger, proceduresMap, {'translateToJavaScript': false}, initialVariables);
			if (!CommandBoxParseLogger.hasLoggedErrors()) {
				executer.setProgram(program);
			}
		}
	}
	input.value = '';
}

input.addEventListener('keydown', function(event) {
	if (Keys.isEnterKey(event)) { // enter key pressed.
		tryRunCode();
	}
});

runButton.addEventListener('click', tryRunCode);

input.addEventListener('focus', function() {
	CommandBoxMessages.clearCursoredEffect();
});

function codeSnippetSelected(event) {
	input.value = event.details.s;
	input.focus();
}

CommandBoxMessages.addEventListener('codeSnippetSelected', codeSnippetSelected);
PastableCodeDispatcher.addEventListener('codeSnippetSelected', codeSnippetSelected);