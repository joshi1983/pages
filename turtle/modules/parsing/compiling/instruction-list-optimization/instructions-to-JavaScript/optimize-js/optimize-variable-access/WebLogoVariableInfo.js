import { isAfterOrSame } from '../../../../../generic-parsing-utilities/isAfterOrSame.js';

function variableAssignmentToJSVariableName(token) {
	return token.val;
}

export class WebLogoVariableInfo {
	constructor(name, assignToken) {
		if (typeof name !== 'string')
			throw new Error(`name expected to be a string but got ${name}`);
		this.name = name;
		this.assignTokens = [];
		this.makeTokens = [];
		this.readTokens = [];
		this.varReferences = [];
		this.jsVarNames = new Set();
		this.setTokens = [];
		if (assignToken !== undefined)
			this.handleAssignToken(assignToken);
	}

	copyScopesFrom(otherVarInfo) {
		this.isAlwaysLocalAtEnd = otherVarInfo.isAlwaysLocalAtEnd;
		this.isAlwaysLocal = otherVarInfo.isAlwaysLocal;
		this.isAlwaysGlobal = otherVarInfo.isAlwaysGlobal;
	}

	getEarliestAssignTokenForJSVariable(jsVarName) {
		let assignTokens = this.assignTokens.filter(function(assignToken) {
			return variableAssignmentToJSVariableName(assignToken) === jsVarName;
		});
		let result = assignTokens[0];
		for (let i = 1; i < assignTokens.length; i++) {
			const assignToken = assignTokens[i];
			if (isAfterOrSame(result, assignToken))
				result = assignToken;
		}
		return result;
	}

	getFirstAssignToken() {
		let assignTokens = this.assignTokens;
		let result = assignTokens[0];
		for (let i = 1; i < assignTokens.length; i++) {
			const assignToken = assignTokens[i];
			if (isAfterOrSame(result, assignToken))
				result = assignToken;
		}
		return result;
	}

	handleAssignToken(assignToken) {
		this.jsVarNames.add(variableAssignmentToJSVariableName(assignToken));
		this.assignTokens.push(assignToken);
	}
};