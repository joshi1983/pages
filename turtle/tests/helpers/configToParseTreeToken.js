import { ArrayUtils } from '../../modules/ArrayUtils.js';
import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';

function appendChildren(parent, children) {
	if (!(children instanceof Array))
		throw new Error('children must be an Array');
	children.forEach(function(child) {
		parent.appendChild(generalConfigToParseTreeToken(child));
	});
}

function generalConfigToParseTreeToken(config) {
	if (typeof config !== 'object')
		throw new Error('config must be an object');
	const result = new ParseTreeToken(config.val, null, 0, config.colIndex, config.type);
	if (config.children !== undefined)
		appendChildren(result, config.children);
	return result;
}

function describeToken(token) {
	return 'token with val: ' + JSON.stringify(token.val) + ', colIndex: ' + token.colIndex + ', type: ' + ParseTreeTokenType.getNameFor(token.type) + ', #children: ' + token.children.length;
}

export function configToParseTreeToken(config) {
	if (!(config instanceof Array))
		throw new Error('config must be an Array');
	const root = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	appendChildren(root, config);
	return root;
};

export function getParseTreeDifferences(tree1, expected) {
	if (!(tree1 instanceof ParseTreeToken))
		throw new Error('tree1 must be an instance of ParseTreeToken.  Not: ' + tree1);
	if (!(expected instanceof ParseTreeToken))
		throw new Error('expected must be an instance of ParseTreeToken.  Not: ' + expected);
	const result = [];
	if (tree1.val !== expected.val)
		result.push('Expected val of ' + JSON.stringify(expected.val) + ' but got ' + JSON.stringify(tree1.val) + ' for ' + describeToken(expected));
	if (tree1.colIndex !== expected.colIndex)
		result.push('Expected colIndex of ' + expected.colIndex + ' but got ' + tree1.colIndex + ' for ' + describeToken(expected));
	if (tree1.children.length !== expected.children.length)
		result.push('Expected children length of ' + expected.children.length + ' but got ' + tree1.children.length + ' for parent ' + describeToken(expected));
	else {
		for (let i = 0; i < tree1.children.length; i++) {
			ArrayUtils.pushAll(result, getParseTreeDifferences(tree1.children[i], expected.children[i]));
		}
	}

	return result;
}