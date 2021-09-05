import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testGetAllReservedIdentifiersAt } from './testGetAllReservedIdentifiersAt.js';
import { testFunctionDefinition } from './testFunctionDefinition.js';
import { testGetAllFunctionDefinitions } from './testGetAllFunctionDefinitions.js';
import { testProcedureDependencies } from './procedure-dependencies/testProcedureDependencies.js';
import { testVariableDataTypes } from './variable-data-types/testVariableDataTypes.js';

export function testParseTreeAnalysis(logger) {
	testFunctionDefinition(prefixWrapper('testFunctionDefinition', logger));
	testGetAllFunctionDefinitions(prefixWrapper('testGetAllFunctionDefinitions', logger));
	testGetAllReservedIdentifiersAt(prefixWrapper('testGetAllReservedIdentifiersAt', logger));
	testProcedureDependencies(prefixWrapper('testProcedureDependencies', logger));
	testVariableDataTypes(prefixWrapper('testVariableDataTypes', logger));
};