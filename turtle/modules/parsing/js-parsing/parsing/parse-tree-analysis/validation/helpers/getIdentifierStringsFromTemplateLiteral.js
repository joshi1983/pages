import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from
'../../../../parse.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { scanTemplateLiteralExpressions } from
'../../../../scanning-template-literals/scanTemplateLiteralExpressions.js';

export function getIdentifierStringsFromTemplateLiteral(s) {
	const templateSnippets = [];
	const snippets = scanTemplateLiteralExpressions(s);
	const result = new Set();
	for (const snippet of snippets) {
		const parseResult = parse(snippet);
		const identifiers = getDescendentsOfType(parseResult.root, ParseTreeTokenType.IDENTIFIER);
		for (const identifier of identifiers) {
			result.add(identifier.val);
		}
	}
	return Array.from(result);
};