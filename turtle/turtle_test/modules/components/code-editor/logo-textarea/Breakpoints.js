import { Breakpoint } from '../../../parsing/execution/Breakpoint.js';

export class Breakpoints {
	static addBreakpointNear(executer, lineIndex, program) {
		if (program === undefined)
			program = executer.executionContext.logoProgram;
		const instructionTuples = program.getAllInstructionsWithProcedureNames();
		let closestLine = -1;
		let bestIndex;
		for (let i = 0; i < instructionTuples.length; i++) {
			const tuple = instructionTuples[i];
			if (tuple[2].parseTreeToken.lineIndex >= lineIndex) {
				if (bestIndex === undefined || closestLine > tuple[2].parseTreeToken.lineIndex) {
					closestLine = tuple[2].parseTreeToken.lineIndex;
					bestIndex = i;
					if (closestLine === lineIndex)
						break; // can't get closer than an exact match.
				}
			}
		}
		if (bestIndex !== undefined) {
			const tuple = instructionTuples[bestIndex];
			const breakpoint = new Breakpoint(tuple[1], tuple[0], undefined);
			executer.addBreakpoint(breakpoint);
		}
	}

	static getBreakpointLineIndexSet(executer, program) {
		if (program === undefined)
			program = executer.executionContext.logoProgram;
		const result = new Set();
		const instructionTuples = program.getAllInstructionsWithProcedureNames();
		for (let breakpointArray of executer.breakpoints.values()) {
			breakpointArray.forEach(function(breakpoint) {
				const lineNumber = breakpoint.getLineNumber(instructionTuples);
				if (lineNumber >= 0)
					result.add(lineNumber);
			});
		}
		return result;
	}

	static removeBreakpointsAt(executer, lineIndex, program) {
		if (program === undefined)
			program = executer.executionContext.logoProgram;
		const procedure = program.getProcedureAtLine(lineIndex);
		let instructionTuples = program.getAllInstructionsWithProcedureNames();
		const breakpoints = executer.breakpoints;
		const breakpointsToDelete = [];
		for (let breakpointsArray of breakpoints.values()) {
			for (let i = 0; i < breakpointsArray.length; i++) {
				const breakpoint = breakpointsArray[i];
				const lineNumber = breakpoint.getLineNumber(instructionTuples);
				if (lineNumber === lineIndex) {
					breakpointsToDelete.push(breakpoint);
				}
			}
		}
		breakpointsToDelete.forEach(breakpoint => executer.removeBreakpoint(breakpoint));
	}
};