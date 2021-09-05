/*
@param cachedParseTree could be either from parsing/parse-tree-analysis/CachedParseTree.js or
python-parsing/parse-tree-analysis/CachedParseTree.js

@param type should match a type from the corresponding ParseTreeTokenType.
*/
export function getTokensByType(cachedParseTree, type) {
	if (cachedParseTree.tokensByType[type] === undefined)
		cachedParseTree.tokensByType[type] = cachedParseTree.getAllTokens().filter(t => t.type === type);
	return cachedParseTree.tokensByType[type];
};