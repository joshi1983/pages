import { scrapeProceduresFromParseTreeTokens } from '../../parsing/parse-tree-analysis/scrapeProceduresFromParseTreeTokens.js';

export function parseTreeToProcNameSet(treeRoot) {
	return new Set(scrapeProceduresFromParseTreeTokens(treeRoot).keys());
};