import { testGetAllReservedIdentifiersAt } from './testGetAllReservedIdentifiersAt.js';
import { testFunctionDefinition } from './testFunctionDefinition.js';
import { testGetAllFunctionDefinitions } from './testGetAllFunctionDefinitions.js';
import { testGetAllImportedPackages } from './testGetAllImportedPackages.js';
import { testProcedureDependencies } from './procedure-dependencies/testProcedureDependencies.js';
import { testVariableDataTypes } from './variable-data-types/testVariableDataTypes.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testFunctionDefinition,
		testGetAllFunctionDefinitions,
		testGetAllImportedPackages,
		testGetAllReservedIdentifiersAt,
		testProcedureDependencies,
		testVariableDataTypes
	], logger);
};