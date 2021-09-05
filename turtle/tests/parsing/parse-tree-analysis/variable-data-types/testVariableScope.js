import { DataTypes } from '../../../../modules/parsing/data-types/DataTypes.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { VariableScope } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/VariableScope.js';

function testClone(logger) {
	const scope = new VariableScope({'colIndex': 0, 'lineIndex': 1}, 
		{'colIndex': 0, 'lineIndex': 1}, {'colIndex': 10, 'lineIndex': 1}, new DataTypes(), new DataTypes());
	const otherScope = scope.clone();
	if (!(otherScope instanceof VariableScope))
		logger('Expected clone to return a VariableScope but got: ' + otherScope);
}

function testContains(logger) {
	const scope = new VariableScope({'colIndex': 0, 'lineIndex': 1}, 
		{'colIndex': 0, 'lineIndex': 1}, {'colIndex': 10, 'lineIndex': 1}, new DataTypes(), new DataTypes());
	const result1 = scope.contains({'colIndex': 5, 'lineIndex': 1});
	if (result1 !== true)
		logger('Expected true but got ' + result1);
	const result2 = scope.contains({'colIndex': 11, 'lineIndex': 1});
	if (result2 !== false)
		logger('Expected false but got ' + result2);
}

export function testVariableScope(logger) {
	testClone(prefixWrapper('testClone', logger));
	testContains(prefixWrapper('testContains', logger));
};