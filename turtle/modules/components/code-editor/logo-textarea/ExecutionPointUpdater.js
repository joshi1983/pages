import { Breakpoints } from './Breakpoints.js';
import { Code } from '../Code.js';
import { EditorLocalStorage } from '../EditorLocalStorage.js';
import { LineNumbers } from './LineNumbers.js';
import { Settings } from '../../../Settings.js';
import { ToastMessages } from '../../ToastMessages.js';
const executer = Settings.executer;
let t;
let lineNumbers;

function getCurrentLineIndex() {
	const context = executer.executionContext;

	/*
	If the user modified the source code since the currently executing program was compiled, 
	we must stop showing the execution point.

	The changes most-likely changed how the code would behave or what each line does 
	so continuing to highlight the original lines associated with executing 
	instructions would be confusing.
	*/
	if (context.logoProgram.code !== Code.getSourceCode())
		return -1; // indicate to not highlight any line.
	const instruction = context.getNextInstruction();
	if (instruction === undefined)
		return -1;
	else
		return instruction.parseTreeToken.lineIndex;
}

function updateExecutionPoint() {
	if (lineNumbers !== undefined) {
		// filter the line numbers to ones that can be safely set.
		const breakPointLineNumbers = new Set(Array.from(
			Breakpoints.getBreakpointLineIndexSet(executer, Code.getCurrentProgram())).
				filter(lineIndex => lineIndex < lineNumbers.lines.length));
		lineNumbers.setBreakpointLines(breakPointLineNumbers);
		lineNumbers.setExecutingLine(getCurrentLineIndex());
	}
}

function startTimer() {
	if (t === undefined) {
		t = setInterval(updateExecutionPoint, 60);
	}
}

function stopTimer() {
	if (t !== undefined) {
		updateExecutionPoint();
		clearInterval(t);
		t = undefined;
	}
}

executer.addEventListener('execution-stopped', stopTimer);
executer.addEventListener('execution-started', startTimer);

class PrivateExecutionPointUpdater {
	setLineNumbers(_lineNumbers) {
		if (!(_lineNumbers instanceof LineNumbers))
			throw new Error('_lineNumbers must be an instance of LineNumbers');
		if (lineNumbers !== _lineNumbers) {
			lineNumbers = _lineNumbers;
			lineNumbers.addEventListener('line-number-click', function(event) {
				const lineNumber = event.details.line;
				if (!lineNumber.hasMessage()) {
					if (lineNumber.hasBreakpoint)
						Breakpoints.removeBreakpointsAt(executer, lineNumber.index);
					else {
						const logoProgram = Code.getCurrentProgram();
						if (logoProgram === undefined)
							ToastMessages.warn('You must fix coding errors before adding line breaks', false);
						else {
							Breakpoints.addBreakpointNear(executer, lineNumber.index, logoProgram);
							EditorLocalStorage.breakpointsUsed();
						}
					}
					updateExecutionPoint();
				}
			});
		}
	}
};

const ExecutionPointUpdater = new PrivateExecutionPointUpdater();
export { ExecutionPointUpdater };