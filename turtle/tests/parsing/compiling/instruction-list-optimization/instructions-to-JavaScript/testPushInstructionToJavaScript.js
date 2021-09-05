import { createRootToken } from '../../../../helpers/createRootToken.js';
import { createLogoInstructionFromDTO } from '../../../../../modules/parsing/execution/instructions/createLogoInstructionFromDTO.js';
import { EaseCubicBezier } from '../../../../../modules/drawing/vector/easing/EaseCubicBezier.js';
import { EaseSteps } from '../../../../../modules/drawing/vector/easing/EaseSteps.js';
import { pushInstructionToJavaScript } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/pushInstructionToJavaScript.js';
import { StepPosition } from '../../../../../modules/drawing/vector/easing/StepPosition.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testPushInstructionToJavaScript(logger) {
	const cases = [
		{'in': {'name': 'push', 'value': 5, 'isCloningValue': false}, 'result': '5'},
		{'in': {'name': 'push', 'value': "Hello", 'isCloningValue': false}, 'result': '"Hello"'},
		{'in': {'name': 'push', 'value': [], 'isCloningValue': false}, 'result': '[]'},
		{'in': {'name': 'push', 'value': [], 'isCloningValue': true}, 'result': '[]'},
		{'in': {'name': 'push', 'value': new Map(), 'isCloningValue': true}, 'result': 'new Map()'},
		{'in': {'name': 'push', 'value': new Map([['x', 0], ['y', 5]]), 'isCloningValue': true}, 'result': 'new Map([["x",0],["y",5]])'},
		{'in': {'name': 'push', 'value': Transparent, 'isCloningValue': false}, 'result': 'this.Transparent'},
		{'in': {'name': 'push', 'value': new EaseSteps(3, StepPosition.JumpEnd), 'isCloningValue': false}, 'result': 'new this.EaseSteps(3,this.StepPosition.JumpEnd)'},
		{'in': {'name': 'push', 'value': new EaseCubicBezier(1,2,3,4), 'isCloningValue': false}, 'result': 'new this.EaseCubicBezier(1,2,3,4)'},
	];
	const rootToken = createRootToken();
	const proceduresMap = new Map();
	cases.forEach(function(caseInfo) {
		const pushInstruction = createLogoInstructionFromDTO(caseInfo.in, rootToken, proceduresMap);
		const result = pushInstructionToJavaScript(pushInstruction);
		if (result !== caseInfo.result)
			logger(`Expected ${caseInfo.result} but got ${result}`);
	});
};