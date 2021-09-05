import { convertToStepPosition } from '../../../execution/instructions/data-type-converters/convertToStepPosition.js';
import { FontWeight } from '../../../../drawing/vector/shapes/style/FontWeight.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { LineCap } from '../../../../drawing/vector/shapes/style/LineCap.js';
import { ParseTreeToken } from '../../../ParseTreeToken.js';
import { wrapWithArgInfoChecks } from './wrapWithArgInfoChecks.js';
import { validateIdentifier } from '../../../parse-tree-analysis/validateIdentifier.js';

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

// assumes s begins and ends with a quote.
function unquote(s) {
	return s.substring(1, s.length - 1);
}

function sanitizeOrWrapVariableName(s) {
	if (isStringLiteral(s) && validateIdentifier(unquote(s)) === undefined)
		return s.toLowerCase();
	else
		return s;
}

function wrapUsingRefTypes(code, refTypes) {
	if (refTypes === 'plist' || refTypes === 'list') {
		if (isStringLiteral(code))
			code = code.toLowerCase();
		if (refTypes === 'plist')
			code = `this.validatePListVariableReference(${code}, context)`;
		else if (refTypes === 'list')
			code = `this.validateListVariableReference(${code}, context)`;
	}
	return code;
}

export function wrapWithTypeConverter(code, argInfo, forProduction, primaryName, token) {
	if (typeof argInfo !== 'object')
		throw new Error(`argInfo must be an object.  Not: ${argInfo}`);
	if (typeof argInfo.types !== 'string')
		throw new Error(`argInfo.types must be a string but got ${argInfo.types}`);
	if (typeof forProduction !== 'boolean')
		throw new Error(`forProduction must be boolean. Not ${forProduction}`);
	if (!(token instanceof ParseTreeToken))
		throw new Error(`token must be a ParseTreeToken.  Not: ${token}`);
	const types = argInfo.types;
	const sanitization = argInfo.sanitization;
	const refTypes = argInfo.refTypes;
	let errorChecksResult;
	if (forProduction === true) {
		errorChecksResult = {
			'code': code,
			'namedFunctionsMap': new Map()
		};
	}
	else
		errorChecksResult = wrapWithArgInfoChecks(code, argInfo, primaryName, token);
	const namedFunctionsMap = errorChecksResult.namedFunctionsMap;
	code = errorChecksResult.code;
	let sanitizationHandled = false;
	if (typeof sanitization === 'string') {
		if (isStringLiteral(code) && sanitization === 'convertToStepPosition') {
			code = '' + convertToStepPosition(JSON.parse(code));
			sanitizationHandled = true;
		}
		else if (isStringLiteral(code) && sanitization === 'fontWeight') {
			code = '' + FontWeight.parse(JSON.parse(code));
			sanitizationHandled = true;
		}
		else if (isStringLiteral(code) && sanitization === 'lineCap') {
			code = '' + LineCap.parse(JSON.parse(code));
			sanitizationHandled = true;
		}
		else if (sanitization === 'listToString') {
			if (isArrayLiteral(code))
				code = JSON.stringify(JavaScriptInstruction.convertListToString(JSON.parse(code)));
			else if (!isStringLiteral(code))
				code = 'this.listToString(' + code + ')';
		}
		else {
			code = `this.${sanitization}(${code})`;
			sanitizationHandled = true;
		}
	}
	if (types === 'bool') {
		if (isBooleanLiteral(code) === false && forProduction === false)
			code = `this.validateBool(${code})`;
	}
	else if (types === 'color')
		code = `this.convertToColour(${code})`;
	else if (types === 'alphacolor') {
		code = `this.convertToAlphaColour(${code})`;
	}
	else if (types === 'alphacolor|transparent') {
		if (code !== 'this.Transparent')
			code = `this.convertToAlphaColourOrTransparent(${code})`;
	}
	else if (types === 'color|transparent') {
		if (code !== 'this.Transparent')
			code = `this.convertToColourOrTransparent(${code})`;
	}
	else if (types === 'num') {
		if (isNumericLiteral(code) === false && forProduction === false)
			code = `this.validateNumber(${code})`;
	}
	else if (types === 'num(finite)') {
		if (isNumericLiteral(code) === false && forProduction === false)
			code = `this.validateFiniteNumber(${code})`;
	}
	else if (types === 'string' && sanitizationHandled === false) {
		const isVarReadNeeded = (refTypes === 'list' || refTypes === 'plist');
		if (forProduction === true && isVarReadNeeded)
			code = `context.readVariable(${sanitizeOrWrapVariableName(code)})`;
		else if (isStringLiteral(code)) {
			if (isVarReadNeeded)
				code = wrapUsingRefTypes(code, refTypes);
		}
		else if (sanitization !== undefined)
			code = `this.${sanitization}(${code})`;
		else {
			if (isVarReadNeeded)
				code = wrapUsingRefTypes(code, refTypes);
			else
				code = `this.validateString(${code})`;
		}
	}

	return {
		'code': code,
		'namedFunctionsMap': namedFunctionsMap
	};
};