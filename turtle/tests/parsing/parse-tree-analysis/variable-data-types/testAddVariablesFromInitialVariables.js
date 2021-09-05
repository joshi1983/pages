import { addVariablesFromInitialVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/addVariablesFromInitialVariables.js';
import { CachedParseTree } from '../../../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { getAllVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAllVariables.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

export function testAddVariablesFromInitialVariables(logger) {
	const initialVariables = new Map([
		['x', 5],
		['y', "Hello"]
	]);
	const testParser = new TestParseLogger(logger, '');
	const tree = LogoParser.getParseTree('', testParser);
	const cachedParseTree = new CachedParseTree(tree, new Map(), initialVariables);
	const result = getAllVariables(cachedParseTree);
	addVariablesFromInitialVariables(cachedParseTree, result);
	if (!result.hasVariable('x'))
		logger('Expected to find variable x but not found');
	if (!result.hasVariable('y'))
		logger('Expected to find variable y but not found');
};