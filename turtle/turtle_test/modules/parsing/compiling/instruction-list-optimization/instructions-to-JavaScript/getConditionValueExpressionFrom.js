import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { optimizePushedIfStatementConditions } from './optimize-js/optimizePushedIfStatementConditions.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { pushInstructionToJavaScript } from './pushInstructionToJavaScript.js';

export function getConditionValueExpressionFrom(pushConditionInstruction, notResult) {
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
		jsCode = 'context.valueStack.pop()';
		numToRemove = 0;
		if (notResult !== false)
			jsCode = '!' + jsCode;
	}
	else if (notResult === false) {
		jsCode = '!' + jsCode;
		if (jsCode.startsWith('!!'))
			jsCode = jsCode.substring(2);
	}
	if (jsCode.startsWith('(') && jsCode.endsWith(')'))
		jsCode = jsCode.substring(1, jsCode.length - 1);
	return {
		'jsCode': jsCode,
		'numToRemove': numToRemove
	};
};