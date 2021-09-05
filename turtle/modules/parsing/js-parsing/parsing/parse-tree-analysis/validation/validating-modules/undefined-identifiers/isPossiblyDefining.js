import { declaringTypes } from '../../../../declaringTypes.js';
import { definingParentTypesOfInterest } from './definingParentTypesOfInterest.js';
import { getClosestOfType } from '../../../../../../generic-parsing-utilities/getClosestOfType.js';
import { MaybeDecided } from '../../../../../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

function isArgListContainingDefiningTokens(parent) {
	const grandParent = parent.parentNode;
	if (grandParent !== null) {
		if (grandParent.type === ParseTreeTokenType.FUNCTION_CALL)
			return MaybeDecided.No;
		else if (grandParent.type === ParseTreeTokenType.FUNCTION ||
		grandParent.type === ParseTreeTokenType.CATCH)
			return MaybeDecided.Yes;
		else if (grandParent.type === ParseTreeTokenType.BINARY_OPERATOR &&
		grandParent.val === '=>')
			return MaybeDecided.Yes;
		else if (grandParent.type === ParseTreeTokenType.IDENTIFIER) {
			const greatGrandparent = grandParent.parentNode;
			if (greatGrandparent !== null && (
			greatGrandparent.type === ParseTreeTokenType.CLASS_BODY ||
			greatGrandparent.type === ParseTreeTokenType.STATIC ||
			greatGrandparent.type === ParseTreeTokenType.CATCH ||
			greatGrandparent.type === ParseTreeTokenType.ASYNC))
				return MaybeDecided.Yes;
		}
	}
	return MaybeDecided.Maybe;
}

function isArrayLiteralDefining(parent) {
	const grandParent = parent.parentNode;
	if (grandParent !== null) {
		if (grandParent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
		grandParent.val === '=') {
			const index = grandParent.children.indexOf(parent);
			if (index === 0)
				return true;
		}
		else if (declaringTypes.has(grandParent.type)) {
			const next = grandParent.getNextSibling();
			if (next !== null) {
				if (next.type === ParseTreeTokenType.OF ||
				next.val === 'in') {
					const forSettingsToken = getClosestOfType(grandParent, ParseTreeTokenType.FOR_LOOP_SETTINGS);
					if (forSettingsToken !== null)
						return true;
				}
			}
		}
	}
}

export function isPossiblyDefining(token) {
	const parent = token.parentNode;
	if (parent === null)
		return false;
	if (definingParentTypesOfInterest.has(parent.type))
		return true;
	if (parent.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (parent.val === '=>') {
			const index = parent.children.indexOf(token);
			if (index === 0)
				return true;
		}
		else if (parent.val === 'as' && parent.children.indexOf(token) === 1) {
			const grandParent = parent.parentNode;
			if (grandParent.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION) {
				const greatGrandparent = grandParent.parentNode;
				if (greatGrandparent.type === ParseTreeTokenType.IMPORT)
					return true;
			}
		}
	}
	else if (parent.type === ParseTreeTokenType.UNARY_OPERATOR) {
		if (parent.val === '...') {
			const grandParent = parent.parentNode;
			if (grandParent !== null) {
				if (grandParent.type === ParseTreeTokenType.ARG_LIST) {
					const argListResult = isArgListContainingDefiningTokens(grandParent);
					if (argListResult === MaybeDecided.Yes)
						return true;
				}
				else if (grandParent.type === ParseTreeTokenType.ARRAY_LITERAL &&
				isArrayLiteralDefining(grandParent))
					return true;
			}
		}
		return false;
	}
	else if (parent.type === ParseTreeTokenType.ARRAY_LITERAL) {
		if (isArrayLiteralDefining(parent))
			return true;
	}
	else if (parent.type === ParseTreeTokenType.ARG_LIST) {
		const argListResult = isArgListContainingDefiningTokens(parent);
		if (argListResult === MaybeDecided.Yes)
			return true;
		else if (argListResult === MaybeDecided.No)
			return false;
	}
	else if (parent.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION) {
		const grandParent = parent.parentNode;
		if (grandParent.type === ParseTreeTokenType.IMPORT)
			return true;
	}
	else if (parent.type === ParseTreeTokenType.IMPORT) {
		return parent.children.indexOf(token) === 0; 
		// for example, import defaultExport from './x.js';
		// defaultExport in the above example would be defined by that import statement.
	}
	else if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.val === '=') {
		if (parent.children.indexOf(token) !== 0)
			return false;
		const grandparent = parent.parentNode;
		if (grandparent !== null && grandparent.type === ParseTreeTokenType.STATIC)
			return true;
		let tok = parent.parentNode;
		while (tok !== null) {
			if (tok.type === ParseTreeTokenType.CODE_BLOCK)
				return false;
			if (declaringTypes.has(tok.type))
				return true;
			tok = tok.parentNode;
		}
	}
	return false;
};