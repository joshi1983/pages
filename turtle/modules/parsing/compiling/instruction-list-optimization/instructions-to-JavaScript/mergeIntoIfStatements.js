import { containsDynamicVariableAssignment } from './containsDynamicVariableAssignment.js';
import { getConditionValueExpressionFrom } from './getConditionValueExpressionFrom.js';
import { getDeclarationsFromInstruction } from './getDeclarationsFromInstruction.js';
import { isJumpSafeInterval } from './isJumpSafeInterval.js';
import { JumpIfTrueInstruction } from '../../../execution/instructions/JumpIfTrueInstruction.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { removeInstructions } from '../removeInstructions.js';

export function mergeIntoIfStatements(instructions) {
	for (let i = instructions.length - 1; i >= 2; i--) {
		const instructionToSkipOver = instructions[i];
		const jumpInstruction = instructions[i - 1];
		const pushConditionInstruction = instructions[i - 2];
		if (instructionToSkipOver instanceof JavaScriptInstruction &&
		jumpInstruction instanceof JumpIfTrueInstruction &&
		jumpInstruction.jumpToIndex === i + 1 &&
		isJumpSafeInterval(instructions, i - 2, i) &&
		!containsDynamicVariableAssignment(pushConditionInstruction.code)) {
			const conditionValExpressionResult = getConditionValueExpressionFrom(pushConditionInstruction);
			const conditionValExpression = conditionValExpressionResult.jsCode;
			let wrappedCode = instructionToSkipOver.code;
			if (!wrappedCode.trim().endsWith(';'))
				wrappedCode += ';';
			const prefix = getDeclarationsFromInstruction(pushConditionInstruction);
			const newCode = `${prefix}if (${conditionValExpression}) {\n${wrappedCode}\n}`;
			const newIndex = i - 1 - conditionValExpressionResult.numToRemove;
			instructionToSkipOver.setCode(newCode);
			instructions[newIndex] = instructionToSkipOver;
			removeInstructions(instructions, newIndex + 1, i - newIndex);
		}
	}
};