import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Variable } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/Variable.js';
import { VariableScope } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/VariableScope.js';

function testHasAGlobalScope(logger) {
	const variable = new Variable('x');
	if (variable.hasAGlobalScope() !== false)
		logger(`Expected false but got ${variable.hasAGlobalScope()}`);
}

export function testVariable(logger) {
	testHasAGlobalScope(prefixWrapper('testHasAGlobalScope', logger));
};