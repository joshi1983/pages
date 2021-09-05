import { createRootToken } from '../../../../helpers/createRootToken.js';
import { MaybeDecided } from '../../../../../modules/MaybeDecided.js';
import { variableReadToJavaScript } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/variableReadToJavaScript.js';
import { VariableReadInstruction } from '../../../../../modules/parsing/execution/instructions/VariableReadInstruction.js';

export function testVariableReadToJavaScript(logger) {
	const rootToken = createRootToken();
	const variableReadInstruction = new VariableReadInstruction('x', rootToken);
	[MaybeDecided.Yes, MaybeDecided.No, MaybeDecided.Maybe].forEach(function(isLocal) {
			variableReadToJavaScript(variableReadInstruction, isLocal);
	});
};