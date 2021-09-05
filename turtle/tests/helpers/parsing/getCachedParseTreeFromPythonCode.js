import { CachedParseTree } from '../../../modules/parsing/python-parsing/parse-tree-analysis/CachedParseTree.js';
import { parse } from '../../../modules/parsing/python-parsing/parse.js';

/*
The caller must wait for parse.js's asyncInit() before calling this.
*/
export function getCachedParseTreeFromPythonCode(code) {
	const tree = parse(code);
	return new CachedParseTree(tree);
};