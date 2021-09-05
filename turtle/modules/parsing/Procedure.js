import { isAfterOrSame } from './isAfterOrSame.js';
import { ParseTreeToken } from './ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

export class Procedure {
	constructor(name, parameters, nameToken) {
		if (typeof name !== 'string')
			throw new Error('name must be a string');
		if (!(parameters instanceof Array))
			throw new Error('parameters must be an Array');
		if (!(nameToken instanceof ParseTreeToken))
			throw new Error('nameToken should be a ParseTreeToken corresponding with the procedure\'s name');

		parameters.forEach(function(param) {
			if (typeof param !== 'string')
				throw new Error('Procedure parameters must be strings.');
		});

		this.name = name.toLowerCase();
		this.parameters = parameters.map((p) => p.toLowerCase());
		this.nameToken = nameToken;
	}

	_getArgumentsInfo() {
		return this.parameters.map(function(paramName) {
			return {
				'name': paramName
			};
		});
	}

	isContainingToken(token) {
		const startToken = this.getStartToken();
		if (!startToken)
			return false; 
			// we don't really know if is contained but return false anyway.
		if (!isAfterOrSame(token, startToken))
			return false;
		const endToken = this.getEndToken();
		if (!endToken)
			return true; // not really known but return true anyway.
		return isAfterOrSame(endToken, token);
	}

	getCommandFormattedInfo() {
		return {
			'primaryName': this.name,
			'args': this._getArgumentsInfo(),
			'names': [],
			'commandGroup': 'procedure',
			'returnTypes': null
		};
	}

	getEndToken() {
		const start = this.getStartToken();
		return start.children[start.children.length - 1];
	}

	getImplementationStartCursorPosition() {
		const startToken = this.getStartToken();
		if (startToken) {
			return {
				'colIndex': 0,
				'lineIndex': startToken.lineIndex + 1
			}
		}
	}

	getInstructionListToken() {
		const start = this.getStartToken();
		return start.children[start.children.length - 2];
	}

	getReversedParameters() {
		if (this.reversedParameters === undefined) {
			this.reversedParameters = this.parameters.slice(0);
			this.reversedParameters.reverse();
		}
		return this.reversedParameters;
	}

	getStartToken() {
		if (this.nameToken.parentNode !== null &&
		this.nameToken.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
			return this.nameToken.parentNode;
	}

	getTokenForParameter(index) {
		if (typeof index !== 'number' || index < 0)
			throw new Error('index must be a number of at least 0');
		const params = this.getStartToken().children[1].children;
		if (index >= params.length)
			throw new Error('index must be at most ' + (params.length - 1));
		return params[index];
	}

	static isNameToken(token) {
		return token.type === ParseTreeTokenType.LEAF &&
			token.parentNode !== null &&
			token.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
			token.parentNode.children.indexOf(token) === 0;
	}

	static isParameterToken(token) {
		return token.type === ParseTreeTokenType.VARIABLE_READ &&
			token.parentNode !== null && token.parentNode.type === ParseTreeTokenType.LIST && 
			token.parentNode.parentNode !== null &&
			token.parentNode.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
			token.parentNode.parentNode.children.indexOf(token.parentNode) === 1;
	}

	setInstructions(instructions) {
		if (!(instructions instanceof Array))
			throw new Error('instructions must be an Array');
		this.instructions = instructions;
	}
}