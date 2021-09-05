import { parse } from '../../../js-parsing/parse.js';
import { parseTreeToCodeWithComments } from
'../../../js-parsing/parseTreeToCodeWithComments.js';
import { simplify } from './simplify.js';

export function simplifyJavaScriptCode(code) {
	const parseResult = parse(code);
	simplify(parseResult.root);
	return parseTreeToCodeWithComments(parseResult.root, parseResult.comments);
};