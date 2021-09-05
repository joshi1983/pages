import { CachedParseTree } from
'../../../parsing/parse-tree-analysis/CachedParseTree.js';
import { Command } from
'../../../parsing/Command.js';
import { CommandCalls } from
'../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getDescendentsOfType } from
'../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getProceduresMap } from
'../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { getStringIndexAfterToken } from
'../../../parsing/generic-parsing-utilities/getStringIndexAfterToken.js';
import { getStringIndexBeforeToken } from
'../../../parsing/generic-parsing-utilities/getStringIndexBeforeToken.js';
import { LogoParser } from
'../../../parsing/LogoParser.js';
import { ParseLogger } from
'../../../parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../parsing/ParseTreeTokenType.js';

function containsOldStateVariable(procedure) {
	return getDescendentsOfType(procedure.getInstructionListToken(), ParseTreeTokenType.STRING_LITERAL).
		some(t => {
			if (t.val.toLowerCase() !== 'oldstate')
				return false;
			const parent = t.parentNode;
			if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
				return false;
			const info = Command.getCommandInfo(parent.val);
			if (info === undefined ||
			(info.primaryName !== 'localmake' && info.primaryName !== 'make'))
				return false;
			return true;
		});
}

function getLastProcHeaderToken(procedure) {
	const start = procedure.getStartToken();
	const parameterList = start.children[1];
	if (parameterList.children.length !== 0) {
		const children = parameterList.children;
		return children[children.length - 1];
	}
	return start.children[0];
}

function getEndOfProcToken(procedure) {
	// look for an output call at the end of the procedure's instruction list.
	const instructionList = procedure.getInstructionListToken();
	const children = instructionList.children;
	const lastChild = children[children.length - 1];
	if (lastChild !== undefined && CommandCalls.tokenMatchesPrimaryName(lastChild, 'output'))
		return lastChild;
	return procedure.getEndToken();
}

export function wrapTurtleState(code, cursorPosition, reportError, reportSuccess) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but found ${code}`);
	if (typeof cursorPosition !== 'object')
		throw new Error(`cursorPosition must be an object but found ${cursorPosition}`);
	if (typeof reportError !== 'function')
		throw new Error(`reportError must be a function but found ${reportError}`);
	if (typeof reportSuccess !== 'function')
		throw new Error(`reportSuccess must be a function but found ${reportSuccess}`);

	const logger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, logger);
	if (logger.hasLoggedErrors()) {
		reportError(`Unable to wrap turtle state because the code contains errors that make it not possible to parse. Fix the errors and try again.`);
		return;
	}
	else {
		const initialVariables = new Map();
		const procs = getProceduresMap(tree);
		const cachedParseTree = new CachedParseTree(tree, procs, initialVariables);
		let containingProc = cachedParseTree.getProcedureAtToken(cursorPosition);
		if (containingProc === undefined) {
			for (const proc of procs.values()) {
				const start = proc.getStartToken();
				const end = proc.getEndToken();
				if (start.lineIndex >= cursorPosition.lineIndex &&
				end.lineIndex >= cursorPosition.lineIndex) {
					if (start.lineIndex === cursorPosition.lineIndex &&
					start.colIndex - 2 > cursorPosition.colIndex)
						continue;
					if (containingProc) {
						containingProc = undefined;
						break;
					}
					containingProc = proc;
				}
			}
		}
		if (containingProc === undefined) {
			reportError(`Unable to wrap turtle state because the cursor is not in a procedure. The cursor needs to be in a procedure so we know what procedure to insert the <span class=\"command\">turtleState</span> and <span class=\"command\">setTurtleState</span> calls into.`);
			return;
		}
		if (containsOldStateVariable(containingProc)) {
			reportError(`Unable to wrap turtle state because the procedure already has an oldState variable.`);
			return;
		}
		const end = getEndOfProcToken(containingProc);
		const lastProcHeaderToken = getLastProcHeaderToken(containingProc);
		const startProcBodyIndex = getStringIndexAfterToken(lastProcHeaderToken, code);
		const prefix = code.substring(0, startProcBodyIndex);
		// ending with the last parameter in the procedure's parameter list.
		const endProcBodyIndex = getStringIndexBeforeToken(end, code);
		const procBody = code.substring(startProcBodyIndex + 1, endProcBodyIndex);
		const suffix = code.substring(endProcBodyIndex); // starting with the 'end'.
		reportSuccess(`Wrapped procedure ${containingProc.name} to restore turtle state`);
		return `${prefix}
	localmake "oldState turtleState
${procBody}
	setTurtleState :oldState
${suffix}`;
	}
};