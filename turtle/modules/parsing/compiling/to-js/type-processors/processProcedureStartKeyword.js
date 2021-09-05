import { filterBrackets } from
'./helpers/filterBrackets.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processTokens } from
'./helpers/processTokens.js';

export function processProcedureStartKeyword(token, result) {
	result.processCommentsUpToToken(token);
	if (token.children.length >= 2) {
		const nameToken = token.children[0];
		const paramList = token.children[1];
		const procInstructionsToken = token.children[2];
		result.append('\nfunction ');
		result.append(nameToken.val);
		result.append('(');
		if (paramList !== undefined &&
		paramList.type === ParseTreeTokenType.LIST) {
			let needComma = false;
			for (const paramToken of paramList.children) {
				if (needComma)
					result.append(', ');

				result.append(paramToken.val);
				needComma = true;
			}
		}
		result.append(') {\n');
		if (procInstructionsToken !== undefined &&
		procInstructionsToken.type === ParseTreeTokenType.LIST) {
			processTokens(filterBrackets(procInstructionsToken.children), result);
		}
		result.append('\n}\n');
	}
};