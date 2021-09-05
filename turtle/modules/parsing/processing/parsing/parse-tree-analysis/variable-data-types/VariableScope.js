import { getDataTypeString } from './getDataTypeString.js';
import { isStrictlyAfter } from
'../../../../generic-parsing-utilities/isStrictlyAfter.js';

export class VariableScope {
	constructor(declarationToken, toToken, method, isParameter, dataTypeString) {
		if (typeof isParameter !== 'boolean')
			throw new Error(`isParameter must be boolean but got ${isParameter}`);
		if (dataTypeString !== undefined && typeof dataTypeString !== 'string')
			throw new Error(`dataTypeString should either be undefined or be a string but got ${dataTypeString}`);

		this._dataTypeString = dataTypeString;
		this.declarationToken = declarationToken;
		this.method = method;
		this.isParameter = isParameter;
		this.isGlobalAccessible = method === undefined;
		this.toToken = toToken;
	}

	_containsSimple(location) {
		if (isStrictlyAfter(location, this.toToken))
			return false;
		if (isStrictlyAfter(this.declarationToken, location))
			return false;
		return true;
	}

	contains(location, method) {
		if (this.isGlobalAccessible) {
			if (method === undefined)
				return this._containsSimple(location);
			return true;
		}
		return this._containsSimple(location);
	}

	dataTypeToString() {
		if (this._dataTypeString === undefined)
			this._dataTypeString = getDataTypeString(this.declarationToken);
		return this._dataTypeString;
	}

	setVariable(variable) {
		this.variable = variable;
	}
};