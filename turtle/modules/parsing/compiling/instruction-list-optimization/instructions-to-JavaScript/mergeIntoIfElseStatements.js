import { containsDynamicVariableAssignment } from './containsDynamicVariableAssignment.js';
import { getConditionValueExpressionFrom } from './getConditionValueExpressionFrom.js';
import { getDeclarationsFromInstruction } from './getDeclarationsFromInstruction.js';
import { isJumpSafeInterval } from './isJumpSafeInterval.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { JumpIfTrueInstruction } from '../../../execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../../../execution/instructions/JumpInstruction.js';
import { removeInstructions } from '../removeInstructions.js';
import { sanitizeMergedJS } from './optimize-js/sanitizeMergedJS.js';

function formatSemicolons(code) {
	code = code.trim();
	while (code.charAt(0) === ';')
		code = code.substring(1).trim();
	if (!code.endsWith(';') && !code.endsWith('}'))
		code = code + ';';
	return code;
}

export function mergeIntoIfElseStatements(instructions) {
	for (let i = instructions.length - 1; i >= 4; i--) {
		const pushConditionInstruction = instructions[i - 4];
		const conditionalJumpInstruction = instructions[i - 3];
		const instructionToSkipOver = instructions[i - 2];
		const jumpInstruction = instructions[i - 1];
		const elseInstruction = instructions[i];
		if (instructionToSkipOver instanceof JavaScriptInstruction &&
		jumpInstruction instanceof JumpInstruction &&
		elseInstruction instanceof JavaScriptInstruction &&
		conditionalJumpInstruction instanceof JumpIfTrueInstruction &&
		conditionalJumpInstruction.jumpToIndex === i &&
		jumpInstruction.jumpToIndex === i + 1 &&
		isJumpSafeInterval(instructions, i - 4, i) &&
		!containsDynamicVariableAssignment(pushConditionInstruction.code)) {
			const conditionValExpressionResult = getConditionValueExpressionFrom(pushConditionInstruction, false);
			const conditionValExpression = conditionValExpressionResult.jsCode;
			let wrappedCode = formatSemicolons(instructionToSkipOver.code);
			let wrappedCode1 = formatSemicolons(elseInstruction.code);
			const prefix = getDeclarationsFromInstruction(pushConditionInstruction);
			const newCode = sanitizeMergedJS(`${prefix}if (${conditionValExpression}) {\n${wrappedCode1}\n} else {\n${wrappedCode}\n}`);
			const newIndex = i - 3 - conditionValExpressionResult.numToRemove;
			instructionToSkipOver.setCode(newCode);
			instructions[newIndex] = instructionToSkipOver;
			removeInstructions(instructions, newIndex + 1, i - newIndex);
		}
	}
};