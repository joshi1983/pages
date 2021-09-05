import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testCallHighOrderInstruction } from './testCallHighOrderInstruction.js';
import { testCreateLogoInstructionFromDTO } from './testCreateLogoInstructionFromDTO.js';
import { testJavaScriptInstruction } from './testJavaScriptInstruction.js';

export function testInstructions(logger) {
	testCallHighOrderInstruction(prefixWrapper('testCallHighOrderInstruction', logger));
	testCreateLogoInstructionFromDTO(prefixWrapper('testCreateLogoInstructionFromDTO', logger));
	testJavaScriptInstruction(prefixWrapper('testJavaScriptInstruction', logger));
};