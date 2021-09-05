import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testFillInstructionsContainer } from './testFillInstructionsContainer.js';
import { testFilterProceduresFromQuery } from './testFilterProceduresFromQuery.js';
import { testInstructionToElement } from './testInstructionToElement.js';
import { testProcedureToSearchItem } from './testProcedureToSearchItem.js';

export function testIntermediateCodeExplorer(logger) {
	testFillInstructionsContainer(prefixWrapper('testFillInstructionsContainer', logger));
	testFilterProceduresFromQuery(prefixWrapper('testFilterProceduresFromQuery', logger));
	testInstructionToElement(prefixWrapper('testInstructionToElement', logger));
	testProcedureToSearchItem(prefixWrapper('testProcedureToSearchItem', logger));
};