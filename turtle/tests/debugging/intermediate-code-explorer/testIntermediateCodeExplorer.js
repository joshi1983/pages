import { testFillInstructionsContainer } from './testFillInstructionsContainer.js';
import { testFilterProceduresFromQuery } from './testFilterProceduresFromQuery.js';
import { testInstructionToElement } from './testInstructionToElement.js';
import { testProcedureToSearchItem } from './testProcedureToSearchItem.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testIntermediateCodeExplorer(logger) {
	wrapAndCall([
		testFillInstructionsContainer,
		testFilterProceduresFromQuery,
		testInstructionToElement,
		testProcedureToSearchItem
	], logger);
};