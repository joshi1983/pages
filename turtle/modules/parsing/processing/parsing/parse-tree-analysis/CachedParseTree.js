import { analyzeTokenDataTypes } from
'./variable-data-types/analyzeTokenDataTypes.js';
import { evaluateTokensBasic } from
'./variable-data-types/evaluateTokensBasic.js';
import { flatten } from
'../../../generic-parsing-utilities/flatten.js';
import { getAnalyzedVariables } from
'./variable-data-types/getAnalyzedVariables.js';
import { getClosestOfType } from
'../../../generic-parsing-utilities/getClosestOfType.js';
import { getMethodsMap } from
'./variable-data-types/getMethodsMap.js';
import { getTokensByType } from
'../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export class CachedParseTree {
	constructor(root) {
		this.root = root;
		this.methods = getMethodsMap(this.root);
		this.tokensByType = [];
	}

	getAllTokens() {
		if (this.allTokens === undefined)
			this.allTokens = flatten(this.root);

		return this.allTokens;
	}

	getMethodAtToken(token) {
		const methodToken = getClosestOfType(token, ParseTreeTokenType.METHOD);
		if (methodToken !== null)
			return this.methodTokenToMethod(methodToken);
	}

	getTokensToDataTypes() {
		if (this.tokensToDataTypes === undefined) {
			this.tokensToDataTypes = analyzeTokenDataTypes(this, this.getTokenValues(), this.getVariables());
		}
		return this.tokensToDataTypes;
	}

	getTokensByTypes(types) {
		return [].concat(...types.map(t => getTokensByType(this, t)));
	}

	getTokenValues() {
		if (this.tokenValues === undefined) {
			this.tokenValues = evaluateTokensBasic(this);
		}
		return this.tokenValues;
	}

	getVariables() {
		if (this.variables === undefined) {
			this.variables = getAnalyzedVariables(this);
		}
		return this.variables;
	}

	methodTokenToMethod(methodToken) {
		const name = methodToken.children[1].val;
		const matchedNameMethods = this.methods.get(name);
		if (matchedNameMethods !== undefined) {
			const result = matchedNameMethods.filter(m => m.methodToken === methodToken);
			return result[0];
		}
	}
};