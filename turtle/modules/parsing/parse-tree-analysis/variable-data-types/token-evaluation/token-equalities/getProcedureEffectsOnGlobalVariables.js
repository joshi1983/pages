import { Command } from
'../../../../Command.js';
import { getTokensByType } from
'../../../../generic-parsing-utilities/getTokensByType.js';
import { isInstructionList } from
'../../../isInstructionList.js';
import { isMutationCommand } from
'../../isMutationCommand.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { commandToVarIndexMap } from
'../../setLastSingleValueTokens.js';

function isAssignmentOfInterest(call, info, procedure) {
	if (info.primaryName !== 'make' &&
	info.primaryName !== 'queue')
		return false;

	const children = call.children;
	if (children.length !== 2)
		return false;

	const variableNameToken = children[0];
	if (!variableNameToken.isStringLiteral())
		return false;

	const variableName = variableNameToken.val.toLowerCase();
	if (!mightBeGlobalVariable(variableName, call, procedure))
		return false;

	return true;
}

class ProcedureResult {
	constructor() {
		this.possiblyAffectedGlobalVariables = new Set();
		this.hasMutation = false;
	}

	add(name) {
		this.possiblyAffectedGlobalVariables.add(name);
	}

	// Returns true if any change is made.
	addEffectsFrom(otherProcedureResult) {
		let result = false;
		if (otherProcedureResult.hasMutation &&
		this.hasMutation === false) {
			this.hasMutation = true;
			result = true;
		}
		for (const name of otherProcedureResult.possiblyAffectedGlobalVariables) {
			if (!this.possiblyAffectedGlobalVariables.has(name)) {
				this.possiblyAffectedGlobalVariables.add(name);
				result = true;
			}
		}
		return result;
	}

	addMutation() {
		this.hasMutation = true;
	}

	// globalVariableName is assumed to be in lower case.
	has(globalVariableName) {
		return this.possiblyAffectedGlobalVariables.has(globalVariableName);
	}
}

function getOrCreateProcedureResult(procedureName, result) {
	if (typeof procedureName !== 'string')
		throw new Error(`procedureName must be a string but found ${procedureName}`);

	let info = result.get(procedureName);
	if (info === undefined) {
		info = new ProcedureResult();
		result.set(procedureName, info);
	}
	return info;
}

function addAffectedVariable(variableName, procedureName, result) {
	if (typeof variableName !== 'string')
		throw new Error(`variableName must be a string but found ${variableName}`);

	variableName = variableName.toLowerCase();
	const procInfo = getOrCreateProcedureResult(procedureName, result);
	procInfo.add(variableName);
}

function addMutationInProcedure(procedureName, result) {
	const procInfo = getOrCreateProcedureResult(procedureName, result);
	procInfo.addMutation();
}

function mightBeGlobalVariable(variableName, call, procedure) {
	if (procedure.parameters.indexOf(variableName) !== -1)
		return false;
		// parameters are not global variables.

	let tok = call;
	while (tok.parentNode !== null &&
	!isInstructionList(tok.parentNode))
		tok = tok.parentNode;

	if (tok.parentNode === null ||
	tok.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return false;

	const parentChildren = tok.parentNode.children;
	for (let i = parentChildren.indexOf(tok) - 1; i >= 0; i--) {
		const child = parentChildren[i];
		if (child.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const childInfo = Command.getCommandInfo(child.val);
			if (childInfo !== undefined) {
				if (childInfo.primaryName === 'swap' &&
				child.children.length === 2) {
					for (let i = 0; i < 2; i++) {
						const swapChild = child.children[i];
						if (swapChild.isStringLiteral() &&
						swapChild.val.toLowerCase() === variableName) {
							const newVariableNameToken = child.children[1 - i];
							if (newVariableNameToken.isStringLiteral())
								variableName = newVariableNameToken.val.toLowerCase();
							else
								return true;
						}
					}
				}
				else if (childInfo.primaryName === 'localmake' &&
				child.children.length !== 0 &&
				child.children[0].isStringLiteral() &&
				child.children[0].val.toLowerCase() === variableName) {
					return false;
				}
			}
		}
	}
	if (tok.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD ||
	tok.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return true;

	return mightBeGlobalVariable(variableName, tok.parentNode, procedure);
}

function mutationCallToVariableToken(call, info) {
	const variableIndex = commandToVarIndexMap.get(info.primaryName);
	const variableToken = call.children[variableIndex];
	return variableToken;
}

function isMutationOfInterest(call, info, procedure) {
	if (!isMutationCommand(info) ||
	info.primaryName === 'localmake')
		return false;

	const variableToken = mutationCallToVariableToken(call, info);
	if (variableToken !== undefined &&
	!variableToken.isStringLiteral())
		return false;

	return true;
}

export function getProcedureEffectsOnGlobalVariables(cachedParseTree) {
	const result = new Map();
	const calls = getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP);
	const procCalls = new Map();
	for (const call of calls) {
		const containingProcedure = cachedParseTree.getProcedureAtToken(call);
		if (containingProcedure !== undefined) {
			const info = Command.getCommandInfo(call.val);
			if (info !== undefined) {
				if (info.primaryName !== 'localmake') {
					if (info.primaryName === 'make' ||
					info.primaryName === 'queue') {
						if (isAssignmentOfInterest(call, info, containingProcedure)) {
							addAffectedVariable(call.children[0].val,
								containingProcedure.name, result);
						}
					}
					else if (isMutationOfInterest(call, info, containingProcedure)) {
						const variableNameToken = mutationCallToVariableToken(call, info);
						const variableName = variableNameToken.val.toLowerCase();
						if (mightBeGlobalVariable(variableName, call, containingProcedure)) {
							addAffectedVariable(variableName,
								containingProcedure.name, result);
						}
						addMutationInProcedure(containingProcedure.name, result);
					}
					else if (info.primaryName === 'swap') {
						for (const nameToken of call.children) {
							if (nameToken.isStringLiteral()) {
								const variableName = nameToken.val.toLowerCase();
								if (mightBeGlobalVariable(variableName, call, containingProcedure)) {
									addAffectedVariable(variableName,
										containingProcedure.name, result);
								}
							}
						}
					}
				}
			}
			else if (call.val.toLowerCase() !== containingProcedure.name) {
				// else if the procedure is not calling itself.

				let callInfo = procCalls.get(containingProcedure.name);
				if (callInfo === undefined) {
					callInfo = new Set();
					procCalls.set(containingProcedure.name, callInfo);
				}
				callInfo.add(call.val.toLowerCase());
			}
		}
	}

	// perform transitive closure.  
	// Any procedure inherits possible effects of the procedure called.
	let keepLooping;
	do {
		keepLooping = false;
		for (const [fromProc, toProcs] of procCalls) {
			const procResultInfo = getOrCreateProcedureResult(fromProc, result);
			for (let toProc of toProcs) {
				toProc = result.get(toProc);
				if (toProc !== undefined) {
					if (procResultInfo.addEffectsFrom(toProc))
						keepLooping = true;
				}
			}
		}
	} while (keepLooping);

	return result;
};