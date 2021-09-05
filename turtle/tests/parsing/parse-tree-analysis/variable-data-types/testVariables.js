import { Variable } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/Variable.js';
import { Variables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/Variables.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testCountVariables(logger) {
	const variables = new Variables();
	if (variables.countVariables() !== 0)
		logger(`Expected 0 but got ${variables.countVariables()}`);
	variables.addVariable(new Variable('x'));
	if (variables.countVariables() !== 1)
		logger(`Expected 1 but got ${variables.countVariables()}`);
}

function testGetAllVariablesAsArray(logger) {
	const variables = new Variables();
	variables.addVariable(new Variable('x'));
	const result = variables.getAllVariablesAsArray();
	if (!(result instanceof Array))
		logger('Expected an Array but got something else: ' + result);
	else if (result.length !== 1)
		logger(`Expected length of 1 but got ${result.length}`);
	else if (!(result[0] instanceof Variable))
		logger(`Expected an Array of Variable but got something else at index 0: ${result[0]}`);
}

function testGetVariableByName(logger) {
	const variables = new Variables();
	variables.addVariable(new Variable('x'));
	const result = variables.getVariableByName('x');
	if (!(result instanceof Variable))
		logger('result expected to be a Variable but it is not.  result = ' + result);
}

export function testVariables(logger) {
	wrapAndCall([
		testCountVariables,
		testGetAllVariablesAsArray,
		testGetVariableByName
	], logger);
};