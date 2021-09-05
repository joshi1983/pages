import { isNumber } from '../../isNumber.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
Used by Code fixers so they can mutate the parse tree frequently while 
continuing to be efficient.

Make sure the appropriate methods are called every time any 
time changes are made to the corresponding parse tree.
This is the only way to keep this cache up to date and 
returning correct results.
*/
export class WriteOptimizedCachedParseTree {
	constructor(treeRoot, proceduresMap) {
		this.root = treeRoot;
		this.proceduresMap = proceduresMap;
		this.allTokens = ParseTreeToken.flatten(treeRoot);
		this._initTokensByType();
	}

	_addTokenToTokensByType(token) {
		if (this.tokensByType[token.type] === undefined)
			this.tokensByType[token.type] = [];
		this.tokensByType[token.type].push(token);
	}

	_initTokensByType() {
		const allTokens = this.allTokens;
		this.tokensByType = [];
		for (let i = 0; i < allTokens.length; i++) {
			const token = allTokens[i];
			this._addTokenToTokensByType(token);
		}
	}

	_removedTokenFromTokensByType(token, type) {
		if (this.tokensByType[type] === undefined)
			throw new Error('token not found.  No token with type ' + type + ' found.');
		const index = this.tokensByType[type].indexOf(token);
		if (index === -1)
			throw new Error('token not found');
		else
			this.tokensByType[type].splice(index, 1); // remove the element.
	}

	getAllTokens() {
		return this.allTokens;
	}

	getProceduresMap() {
		return this.proceduresMap;
	}

	getTokensByType(type) {
		if (!isNumber(type))
			throw new Error('type must be a number. Not: ' + type);
		if (this.tokensByType[type] === undefined)
			return [];
		return this.tokensByType[type];
	}

	getTokensByTypes(types) {
		return [].concat(...types.map(t => this.getTokensByType(t)));
	}

	procedureAdded(proc) {
		this.proceduresMap.set(proc.name, proc);
	}

	tokenReplaced(removedToken, addedToken) {
		this.tokenRemoved(removedToken);
		this.tokenAdded(addedToken);
	}

	tokenAdded(newToken) {
		if (!(newToken instanceof ParseTreeToken))
			throw new Error('newToken must be a ParseTreeToken.  Not: ' + newToken);
		this.allTokens.push(newToken);
		this._addTokenToTokensByType(newToken);
	}

	tokenRemoved(removedToken) {
		this._removedTokenFromTokensByType(removedToken, removedToken.type);
		const index = this.allTokens.indexOf(removedToken);
		if (index === -1)
			throw new Error('token not found in allTokens');
		else
			this.allTokens.splice(index, 1);
	}

	tokenTypeChanged(mutatedToken, previousType) {
		if (!(mutatedToken instanceof ParseTreeToken))
			throw new Error('mutatedToken must be a ParseTreeToken.  Not: ' + mutatedToken);
		if (!isNumber(previousType))
			throw new Error('previousType must be a number. Not: ' + previousType);
		if (mutatedToken.type === previousType)
			throw new Error(`previousType must not match the new type. ${mutatedToken.type} === ${previousType}.`);

		this._removedTokenFromTokensByType(mutatedToken, previousType);
		this._addTokenToTokensByType(mutatedToken);
	}

	tokenValueChanged(token, previousValue) {
		if (!(token instanceof ParseTreeToken))
			throw new Error('token must be a ParseTreeToken.  Not: ' + token);
		if (token.val === previousValue)
			throw new Error('token val not changed.  previousValue = ' + previousValue);

		// do nothing for now.
	}
};