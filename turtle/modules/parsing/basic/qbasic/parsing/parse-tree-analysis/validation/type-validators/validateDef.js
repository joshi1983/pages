import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.TREE_ROOT
]);

function hasSEGChildOnly(token) {
	if (token.children.length !== 1)
		return false;
	const first = token.children[0];
	if (typeof first.val !== 'string')
		return false;
	return first.val.toLowerCase() === 'seg';
}

export function validateDef(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.END_DEF) {
		if (token.children.length !== 0)
			parseLogger.error(`A DEF inside an END_DEF should have no children but found ${token.children.length}`, token);
	}
	else if (!hasSEGChildOnly(token)) {
		if (token.children.length === 0)
			parseLogger.error(`Expected DEF without a parent of END_DEF to have at least 1 child but found none`, token);
		if (!goodParentTypes.has(parent.type)) {
			parseLogger.error(`Expected DEF to not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
		}
	}
	const children = token.children;
	const first = children[0];
	if (children.length === 1) {
		if (!hasSEGChildOnly(token) && first.val !== '=')
			parseLogger.error(`Expected DEF with 1 child to have a child with val = but found ${first.val}`, token);
	}
	else if (children.length > 2) {
		if (first.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`Expected DEF child to be an IDENTIFIER but found type ${ParseTreeTokenType.getNameFor(first.type)}`, token);
		if (children.length !== 4)
			parseLogger.error(`Expected DEF to have 4 children but found ${children.length}`, token);
	}
};