import { Command } from
'../../../../../../parsing/Command.js';
import { DataTypes } from
'../../../../../../parsing/data-types/DataTypes.js';
import { getTokenValueBasic } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { getTokenTypesBasic } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/getTokenTypesBasic.js';
import { isNumber } from
'../../../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

function isCallToPowerWithBase10(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token.children.length === 2) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined && info.primaryName === 'power') {
			const firstChild = unwrapCurvedBracketExpressions(token.children[0]);
			const firstChildVal = getTokenValueBasic(firstChild);
			if (firstChildVal === 10)
				return true;
		}
	}
	return false;
}

function isExpEquivalent(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;

	if (info.primaryName === 'exp')
		return true;

	if (info.primaryName !== 'power' || token.children.length !== 2)
		return false;

	const firstChild = unwrapCurvedBracketExpressions(token.children[0]);
	const firstChildVal = getTokenValueBasic(firstChild);
	if (!isNumber(firstChildVal))
		return false;

	return Math.abs(firstChildVal - Math.E) < 0.000001;
}

function unwrapExpOfLn(token) {
	if (isExpEquivalent(token)) {
		const info = Command.getCommandInfo(token.val);
		const exponentChildIndex = info.primaryName === 'exp' ? 0 : 1;
		const exponentChild = unwrapCurvedBracketExpressions(token.children[exponentChildIndex]);
		if (exponentChild.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const exponentInfo = Command.getCommandInfo(exponentChild.val);
			if (exponentInfo !== undefined && exponentInfo.primaryName === 'ln' &&
			exponentChild.children.length === 1)
				return exponentChild.children[0];
		}
	}
	return token;
}

function unwrapPowerWithBase10OfLog10(token) {
	if (isCallToPowerWithBase10(token)) {
		const exponentChild = unwrapCurvedBracketExpressions(token.children[1]);
		if (exponentChild.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const exponentInfo = Command.getCommandInfo(exponentChild.val);
			if (exponentInfo !== undefined && exponentInfo.primaryName === 'log10') {
				return unwrapCurvedBracketExpressions(exponentChild.children[0]);
			}
		}
	}
	return token;
}

function unwrapLnOfExp(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token.children.length === 1) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined && info.primaryName === 'ln') {
			const firstChild = unwrapCurvedBracketExpressions(token.children[0]);
			if (isExpEquivalent(firstChild)) {
				const childInfo = Command.getCommandInfo(firstChild.val);
				if (childInfo.primaryName === 'exp')
					return firstChild.children[0];
				else
					return firstChild.children[1];
			}
		}
	}
	return token;
}

function unwrapLog10OfPowerBase10(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token.children.length === 1) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined && info.primaryName === 'log10') {
			const firstChild = unwrapCurvedBracketExpressions(token.children[0]);
			if (isCallToPowerWithBase10(firstChild)) {
				return unwrapCurvedBracketExpressions(firstChild.children[1]);
			}
		}
	}
	return token;
}

function unwrapSameAsOutputIfTypesEqual(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token.children.length !== 0) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			const args = info.args;
			for (let i = Math.min(args.length, token.children.length) - 1; i >= 0; i--) {
				const argInfo = args[i];
				if (argInfo.sameAsOutputIfTypesEqual !== undefined) {
					const child = unwrapCurvedBracketExpressions(token.children[i]);
					let types = getTokenTypesBasic(child, false);
					if (types !== undefined) {
						types = new DataTypes(types);
						const sameTypes = new DataTypes(argInfo.sameAsOutputIfTypesEqual);
						if (DataTypes.contains(sameTypes, types.types)) {
							return child;
						}
					}
				}
			}
		}
	}
	return token;
}

const unwrappers = [
	unwrapExpOfLn,
	unwrapLnOfExp,
	unwrapLog10OfPowerBase10,
	unwrapPowerWithBase10OfLog10,
	unwrapSameAsOutputIfTypesEqual
];

function unwrapInverseCommands(token) {
	for (const unwrap of unwrappers) {
		token = unwrap(token);
	}
	return token;
}

export function unwrapCurvedBracketExpressions(token) {
	token = unwrapInverseCommands(token);
	while (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	token.children.length > 1) {
		token = unwrapInverseCommands(token.children[1]);
	}
	return token;
};