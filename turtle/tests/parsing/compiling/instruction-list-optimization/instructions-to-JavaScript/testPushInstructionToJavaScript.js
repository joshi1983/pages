import { createRootToken } from '../../../../helpers/createRootToken.js';
import { createLogoInstructionFromDTO } from '../../../../../modules/parsing/execution/instructions/createLogoInstructionFromDTO.js';
import { pushInstructionToJavaScript } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/pushInstructionToJavaScript.js';

export function testPushInstructionToJavaScript(logger) {
	const cases = [
		{'in': {'name': 'push', 'value': 5, 'isCloningValue': false}, 'result': '5'},
		{'in': {'name': 'push', 'value': "Hello", 'isCloningValue': false}, 'result': '"Hello"'},
		{'in': {'name': 'push', 'value': [], 'isCloningValue': false}, 'result': '[]'},
		{'in': {'name': 'push', 'value': [], 'isCloningValue': true}, 'result': '[]'},
		{'in': {'name': 'push', 'value': new Map(), 'isCloningValue': true}, 'result': 'new Map()'},
		{'in': {'name': 'push', 'value': new Map([['x', 0], ['y', 5]]), 'isCloningValue': true}, 'result': 'new Map([["x",0],["y",5]])'},
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