import { analyzeOperatorBasic } from './analyzeOperatorBasic.js';
import { analyzeParameterizedGroupBasic } from './analyzeParameterizedGroupBasic.js';
import { getProcedureFromAnyTokenInProcedure } from './getProcedureFromAnyTokenInProcedure.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function tokenToProcedureNameBasic(token) {
	const proc = getProcedureFromAnyTokenInProcedure(token);
	if (proc !== undefined) {
		return proc.name;
	}
}

export function analyzeTokenBasic(token, cachedParseTree, variables, containingProc) {
	if (!(token instanceof ParseTreeToken))
		throw new Error('token must be a ParseTreeToken.  Got: ' + token);

	if (containingProc === undefined) {
		const procName = tokenToProcedureNameBasic(token);
		containingProc = cachedParseTree.getProceduresMap().get(procName);
	}
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR || token.type === ParseTreeTokenType.UNARY_OPERATOR) {
		analyzeOperatorBasic(token, cachedParseTree, variables, containingProc);
	}
	else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		analyzeParameterizedGroupBasic(token, cachedParseTree, variables, containingProc);
	}
	for (let i = 0; i < token.children.length; i++)
		analyzeTokenBasic(token.children[i], cachedParseTree, variables, containingProc);
};