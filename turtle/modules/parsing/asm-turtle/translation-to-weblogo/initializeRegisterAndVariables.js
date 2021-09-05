import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from '../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { getSortedFirstTokenFromArray } from '../../generic-parsing-utilities/getSortedFirstTokenFromArray.js';
import { Instruction } from '../Instruction.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isReadingFromRegister(instructionToken) {
	const info = Instruction.getInstructionInfo(instructionToken.val);
	if (info !== undefined && info.isReadingRegister) {
		return true;
	}
	return false;
}

function isRegisterNeedingInitialization(root) {
	const allInstructions = getDescendentsOfType(root, ParseTreeTokenType.INSTRUCTION);
	if (allInstructions.length === 0)
		return false;
	// try tracing the first few instructions to see if the register is assigned before being read.
	let first = getSortedFirstTokenFromArray(allInstructions);
	for (let i = 0; first !== null; i++) {
		if (first.type === ParseTreeTokenType.INSTRUCTION) {
			const info = Instruction.getInstructionInfo(first.val);
			if (info !== undefined) {
				if (info.isReadingRegister === true)
					return true;
				if (info.isWritingToRegister === true)
					return false;
				if (Instruction.isJumpOrCall(info))
					break;
			}
		}
		else if (first.type === ParseTreeTokenType.LABEL)
			break;
		first = first.getNextSibling();
	}
	const instructionsNeedingRegister = allInstructions.
		filter(isReadingFromRegister);
	if (instructionsNeedingRegister.length === 0)
		return false;
	return true; // might be reading before assigning a new value so return true.
}

function mightBeReadFrom(varRef) {
	const parent = varRef.parentNode;
	if (parent.type !== ParseTreeTokenType.INSTRUCTION)
		return false;
	if (parent.val.toLowerCase() === 'saveto')
		return false;
	return true;
}

function getVariablesNeedingInitialization(root) {
	const allVariableReferences = getDescendentsOfType(root, ParseTreeTokenType.VARIABLE_REFERENCE);
	const variableReferences = allVariableReferences.filter(mightBeReadFrom);
	return new Set(variableReferences.map(varRefToken => varRefToken.val.toLowerCase()));
}

function isComparisonRegisterNeedingInitialization(root) {
	const readingTokens = getDescendentsOfTypes(root, [
	ParseTreeTokenType.DO_WHILE,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.IF_ELSE,
	ParseTreeTokenType.WHILE
	]);
	if (readingTokens.length === 0)
		return false;

	return true;
}

export function initializeRegisterAndVariables(root, result, settings) {
	if (isRegisterNeedingInitialization(root)) {
		result.append(`\nmake "${settings.registerName} 0\n`);
	}
	if (isComparisonRegisterNeedingInitialization(root)) {
		result.append(`\nmake "${settings.comparisonRegisterName} 0\n`);
	}
	const variablesNeedingInitialization = Array.from(getVariablesNeedingInitialization(root));
	variablesNeedingInitialization.sort(); // put them in alphabetical order for slightly better organization.
	for (const varName of variablesNeedingInitialization) {
		result.append(`\nmake "${varName} 0\n`);
	}
};