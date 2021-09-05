import { CachedParseTree } from '../../../modules/parsing/other-languages/python/parse-tree-analysis/CachedParseTree.js';
import { parse } from '../../../modules/parsing/other-languages/python/parsing/parse.js';

/*
The caller must wait for parse.js's asyncInit() before calling this.
*/
export function getCachedParseTreeFromPythonCode(code) {
	const parseResult = parse(code);
	return new CachedParseTree(parseResult.root);
};