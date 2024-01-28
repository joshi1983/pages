import { Breakpoints } from './Breakpoints.js';
import { Code } from '../Code.js';
import { Dialog } from '../../Dialog.js';
import { EditorLocalStorage } from '../EditorLocalStorage.js';
import { LineNumbers } from './LineNumbers.js';
import { MessageTypes } from '../../MessageTypes.js';
import { ParseMessageViewer } from './ParseMessageViewer.js';
import { Settings } from '../../../Settings.js';
import { showMenuDialog } from '../../dialog/showMenuDialog.js';
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

function getCallingLineNumberFromExecutingProcedure(context) {
	return function(executingProcedure) {
		const instructionIndex = executingProcedure.returnInstructionIndex - 1;
		const procedureIndex = context.procedureStack.indexOf(executingProcedure);
		let instruction;
		if (procedureIndex === 0) {
			instruction = context.logoProgram.instructions[instructionIndex];
		}
		else {
			const callingProcedure = context.procedureStack[procedureIndex - 1].procedure;
			instruction = callingProcedure.instructions[instructionIndex];
		}
		return instruction.parseTreeToken.lineIndex;
	};
}

function getCurrentLinesFromCallStack() {
	const context = executer.executionContext;
	if (context.logoProgram.code !== Code.getSourceCode())
		return;
	return context.procedureStack.map(getCallingLineNumberFromExecutingProcedure(context));
}

function updateExecutionPoint() {
	if (lineNumbers !== undefined) {
		// filter the line numbers to ones that can be safely set.
		const breakPointLineNumbers = new Set(Array.from(
			Breakpoints.getBreakpointLineIndexSet(executer, Code.getCurrentProgram())).
				filter(lineIndex => lineIndex < lineNumbers.lines.length));
		lineNumbers.setBreakpointLines(breakPointLineNumbers);
		lineNumbers.setExecutionBranchingLines(getCurrentLinesFromCallStack());
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
				const logoProgram = Code.getCurrentProgram();
				function toggleBreakpoint() {
					if (lineNumber.hasBreakpoint)
						Breakpoints.removeBreakpointsAt(executer, lineNumber.index);
					else {
						if (logoProgram === undefined)
							ToastMessages.warn('You must fix coding errors before adding line breaks', false);
						else {
							Breakpoints.addBreakpointNear(executer, lineNumber.index, logoProgram);
							EditorLocalStorage.breakpointsUsed();
						}
					}
					updateExecutionPoint();
					Dialog.hide();
				}
				function showMessages() {
					ParseMessageViewer.show(lineNumber.messages, lineNumber.index);
				}
				const menuOptions = [];
				if (lineNumber.hasBreakpoint || !lineNumber.hasMessage() || logoProgram !== undefined)
					menuOptions.push({
						'name': (lineNumber.hasBreakpoint ? 'Remove' : 'Add') + ' Breakpoint',
						'className': 'breakpoint',
						'callback': toggleBreakpoint
					});
				if (lineNumber.hasMessage())
					menuOptions.push({
						'name': 'View Messages',
						'iconClassName': MessageTypes.getIconClassNames(lineNumber.mostUrgentMessageType).join(' '),
						'callback': showMessages});
				if (menuOptions.length === 1)
					menuOptions[0].callback();
				else {
					showMenuDialog(`Line ${lineNumber.index}`, `What do you want to do at line ${lineNumber.index}?`, menuOptions);
				}
			});
		}
	}
};

const ExecutionPointUpdater = new PrivateExecutionPointUpdater();
export { ExecutionPointUpdater };