import { getGlobalsFromFunctionDefinition } from './function-definition/getGlobalsFromFunctionDefinition.js';
import { getParametersFromFunctionDefinition } from './function-definition/getParametersFromFunctionDefinition.js';
import { isAfterOrSame } from '../../generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
This is Python's analogue to WebLogo's Procedure defined in parsing/Procedure.js.
*/
export class FunctionDefinition {
	constructor(name, startToken, functionRootToken, lastToken) {
		if (name !== undefined && typeof name !== 'string')
			throw new Error(`name must either be undefined(for anonymous or lambda functions) or a string.  Not: ${name}`);
		if (!(startToken instanceof ParseTreeToken))
			throw new Error(`startToken must be a ParseTreeToken.  Not: ${startToken}`);
		if (!(functionRootToken instanceof ParseTreeToken))
			throw new Error(`functionRootToken must be a ParseTreeToken.  Not: ${functionRootToken}`);
		if (!(lastToken instanceof ParseTreeToken))
			throw new Error(`lastToken must be a ParseTreeToken.  Not: ${lastToken}`);
		this.name = name;
		this.startToken = startToken;
		this.functionRootToken = functionRootToken;
		this.lastToken = lastToken;
	}

	declaresGlobalName(varName) {
		return getGlobalsFromFunctionDefinition(this).has(varName);
	}

	getInstructionsToken() {
		const result = this.functionRootToken.children[this.functionRootToken.children.length - 1];
		if (result.type !== ParseTreeTokenType.CODE_BLOCK)
			return;

		return result;
	}

	isContainingToken(token) {
		if (!isAfterOrSame(token, this.startToken))
			return false;
		return isAfterOrSame(this.lastToken, token);
	}

	usesParameterName(varName) {
		return getParametersFromFunctionDefinition(this, varName).has(varName);
	}
};