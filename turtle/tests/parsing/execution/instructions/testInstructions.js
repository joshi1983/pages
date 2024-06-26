import { testCallHighOrderInstruction } from './testCallHighOrderInstruction.js';
import { testCreateLogoInstructionFromDTO } from './testCreateLogoInstructionFromDTO.js';
import { testDataTypeConverters } from './data-type-converters/testDataTypeConverters.js';
import { testJavaScriptInstruction } from './testJavaScriptInstruction.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testInstructions(logger) {
	wrapAndCall([
		testCallHighOrderInstruction,
		testCreateLogoInstructionFromDTO,
		testDataTypeConverters,
		testJavaScriptInstruction
	], logger);
};