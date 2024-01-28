import { analyzeTokenDataTypes } from './variable-data-types/analyzeTokenDataTypes.js';
import { ArrayUtils } from '../../../ArrayUtils.js';
import { evaluateTokensBasic } from './variable-data-types/evaluateTokensBasic.js';
import { getAllDescendentsAsArray } from '../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';

/*
Similar to parsing/parse-tree-analysis/CachedParseTree except this one
is for parsed Python code and the other is for parsed WebLogo code.
*/
export class CachedParseTree {
	constructor(treeRoot) {
		if (!(treeRoot instanceof ParseTreeToken))
			throw new Error(`treeRoot must be a ParseTreeToken.  Not: ${treeRoot}`);
		this.root = treeRoot;
		this.functionDefinitions = undefined;
		this.sortedTokens = undefined;
		this.tokensByType = [];
	}

	getAllTokens() {
		if (this.allTokens === undefined) {
			this.allTokens = [this.root];
			ArrayUtils.pushAll(this.allTokens, getAllDescendentsAsArray(this.root));
		}
		return this.allTokens;
	}

	getTokensToDataTypes() {
		if (this.tokensToDataTypes === undefined) {
			this.tokensToDataTypes = analyzeTokenDataTypes(this, this.getTokenValues());
		}
		return this.tokensToDataTypes;
	}

	getTokenValues() {
		if (this.tokenValues === undefined) {
			this.tokenValues = evaluateTokensBasic(this);
		}
		return this.tokenValues;
	}
};