import { CachedParseTree } from '../parse-tree-analysis/CachedParseTree.js';
import { FunctionRename } from './FunctionRename.js';

const refactorTypes = [FunctionRename];

export function refactor(cachedParseTree) {
	refactorTypes.forEach(function(refactorType) {
		if (refactorType.isNeededFor(cachedParseTree)) {
			refactorType.execute(cachedParseTree.root);

			// create new cached parse tree to refresh all cached data.
			cachedParseTree = new CachedParseTree(cachedParseTree.root);
		}
	});
	return cachedParseTree;
};