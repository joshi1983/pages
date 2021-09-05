import { parse } from '../../../other-languages/js-parsing/parse.js';
import { parseTreeToCodeWithComments } from
'../../../other-languages/js-parsing/parseTreeToCodeWithComments.js';
import { simplify } from './simplify.js';

export function simplifyJavaScriptCode(code) {
	const parseResult = parse(code);
	simplify(parseResult.root);
	return parseTreeToCodeWithComments(parseResult.root, parseResult.comments);
};