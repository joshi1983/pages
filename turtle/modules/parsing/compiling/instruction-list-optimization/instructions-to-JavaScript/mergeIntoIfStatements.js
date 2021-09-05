import { isJumpSafeInterval } from './isJumpSafeInterval.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { JumpIfTrueInstruction } from '../../../execution/instructions/JumpIfTrueInstruction.js';
import { optimizePushedIfStatementConditions } from './optimize-js/optimizePushedIfStatementConditions.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { pushInstructionToJavaScript } from './pushInstructionToJavaScript.js';
import { removeInstructions } from '../removeInstructions.js';

function getConditionValueExpressionFrom(pushConditionInstruction) {
	let jsCode;
	let numToRemove = 1;
	if (pushConditionInstruction instanceof PushInstruction) {
		jsCode = pushInstructionToJavaScript(pushConditionInstruction);
	}
	else if (pushConditionInstruction instanceof JavaScriptInstruction) {
		const pushInfo = optimizePushedIfStatementConditions(pushConditionInstruction.code);
		if (pushInfo !== undefined) {
			numToRemove = 0;
			pushConditionInstruction.code = pushInfo.updated;
			jsCode = pushInfo.conditionJS;
			if (pushConditionInstruction.code === '')
				numToRemove = 1; // We can safely remove a JavaScriptInstruction that has no code.
		}
	}
	if (jsCode === undefined) {
		jsCode = '!context.valueStack.pop()';
		numToRemove = 0;
	}
	return {
		'jsCode': jsCode,
		'numToRemove': numToRemove
	};
}

export function mergeIntoIfStatements(instructions) {
	for (let i = instructions.length - 1; i >= 2; i--) {
		const instructionToSkipOver = instructions[i];
		if (instructionToSkipOver instanceof JavaScriptInstruction) {
			const jumpInstruction = instructions[i - 1];
			const pushConditionInstruction = instructions[i - 2];
			if (jumpInstruction instanceof JumpIfTrueInstruction &&
			jumpInstruction.jumpToIndex === i + 1) {
				if (!isJumpSafeInterval(instructions, i - 2, i))
					continue;
				const conditionValExpressionResult = getConditionValueExpressionFrom(pushConditionInstruction);
				const conditionValExpression = conditionValExpressionResult.jsCode;
				let wrappedCode = instructionToSkipOver.code;
				if (!wrappedCode.trim().endsWith(';'))
					wrappedCode += ';';
				const newCode = `if (${conditionValExpression}) {\n${wrappedCode}\n}`;
				const newIndex = i - 1 - conditionValExpressionResult.numToRemove;
				instructionToSkipOver.setCode(newCode);
				instructions[newIndex] = instructionToSkipOver;
				removeInstructions(instructions, newIndex + 1, i - newIndex);
			}
		}
	}
};