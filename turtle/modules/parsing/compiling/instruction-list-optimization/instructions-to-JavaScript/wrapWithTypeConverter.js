import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';

function trimCurvedBrackets(s) {
	if (typeof s !== 'string')
		throw new Error('s must be a string');

	s = s.trim();
	while (s.charAt(0) === '(' && s.charAt(s.length - 1) === ')') {
		s = s.substring(1, s.length - 1); // remove the leading and trailing brackets.
		s = s.trim();
	}
	return s;
}

function isArrayLiteral(s) {
	s = trimCurvedBrackets(s);
	try {
		const val = JSON.parse(s);
		return val instanceof Array;
	}
	catch (e) {
		return false;
	}
}

function isBooleanLiteral(s) {
	s = trimCurvedBrackets(s);
	try {
		const val = JSON.parse(s);
		return typeof val === 'boolean';
	}
	catch (e) {
		return false;
	}
}

function isNumericLiteral(s) {
	s = trimCurvedBrackets(s);
	if (!isNaN(s))
		return true;
	return false;
}

function isStringLiteral(s) {
	s = trimCurvedBrackets(s);
	try {
		const val = JSON.parse(s);
		return typeof val === 'string';
	}
	catch (e) {
		return false;
	}
}

export function wrapWithTypeConverter(code, types, sanitization, refTypes, forProduction) {
	if (typeof sanitization === 'string') {
		if (sanitization === 'listToString') {
			if (isArrayLiteral(code))
				code = JSON.stringify(JavaScriptInstruction.convertListToString(JSON.parse(code)));
			else if (!isStringLiteral(code))
				code = 'this.listToString(' + code + ')';
		}
		else
			code = `this.${sanitization}(${code})`;
	}
	if (types === 'bool') {
		if (isBooleanLiteral(code) || forProduction === true)
			return code;
		else
			return `this.convertBool(${code})`;
	}
	else if (types === 'color')
		return `this.convertColour(${code})`;
	else if (types === 'color|transparent') {
		if (code.toLowerCase() === '"transparent"')
			return 'this.Transparent';
		else
			return `this.convertColourOrTransparent(${code})`;
	}
	else if (types === 'num') {
		if (isNumericLiteral(code) || forProduction === true)
			return code; // no need to validate number.
		else
			return `this.validateNumber(${code})`;
	}
	else if (types === 'string') {
		if (isStringLiteral(code) || forProduction === true) {
			if (refTypes === 'plist' || refTypes === 'list') {
				if (forProduction === true)
					return `context.readVariable(${code.toLowerCase()})`;

				if (refTypes === 'plist')
					return `this.validatePListVariableReference(${code.toLowerCase()}, context)`;
				else if (refTypes === 'list')
					return `this.validateListVariableReference(${code.toLowerCase()}, context)`;
			}
			return code;
		}
		else
			return `this.validateString(${code})`;
	}

	return code;
};