import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function getParameterNameToken(token) {
	if (token.type === ParseTreeTokenType.DECLARATION &&
	token.children.length === 2) {
		const tok = token.children[1];
		if (tok.type === ParseTreeTokenType.IDENTIFIER)
			return tok;
		else if (tok.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
			const first = tok.children[0];
			if (first !== undefined && first.type === ParseTreeTokenType.IDENTIFIER)
				return first;
		}
	}
}

export function processMethod(token, result, settings) {
	const children = token.children;
	result.processCommentsUpToToken(token);
	if (children.length > 1) {
		result.append('to ' + children[1].val + ' ');
		if (children.length > 2) {
			const args = filterBracketsAndCommas(children[2].children);
			for (const child of args) {
				const nameToken = getParameterNameToken(child);
				if (nameToken !== undefined)
					result.append(` :${nameToken.val} `);
			}
			result.append('\n');
			if (children.length > 3) {
				const codeBlockChildren = filterBracketsAndCommas(children[3].children);
				for (const child of codeBlockChildren) {
					result.processCommentsUpToToken(token);
					processToken(child, result, settings);
					result.append('\n');
				}
			}
		}
		result.append('\nend\n');
	}
};