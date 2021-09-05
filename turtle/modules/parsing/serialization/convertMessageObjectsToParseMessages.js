import { clamp } from '../../clamp.js';
import { compareTokenLocations } from '../compareTokenLocations.js';
import { convertObjectToParseTree } from './convertObjectToParseTree.js';
import { ParseMessage } from '../loggers/ParseMessage.js';

function tryFindingExactMatch(location, node) {
	// try to return a node with matching val, if one exists.
	if (location.val !== node.val && node.children.length !== 0) {
		const childResult = findToken(location, node.children[0]);
		if (childResult !== undefined)
			return childResult;
	}
	return node;
}

function findToken(location, node) {
	if (location.lineIndex === node.lineIndex && location.colIndex === node.colIndex)
		return tryFindingExactMatch(location, node);
	else {
		let fromIndex = 0, toIndex = node.children.length - 1;
		let result = undefined;
		while (fromIndex <= toIndex) {
			const midIndex = Math.floor((fromIndex + toIndex) / 2);
			const comparison = compareTokenLocations(location, node.children[midIndex]);
			if (comparison > 0)
				fromIndex = midIndex + 1;
			else if (comparison < 0)
				toIndex = midIndex - 1;
			else
				return tryFindingExactMatch(location, node.children[midIndex]);
		}
		fromIndex = clamp(fromIndex, 0, Math.max(0, node.children.length - 1));
		if (fromIndex > 0 && compareTokenLocations(location, node.children[fromIndex]) < 0) {
			fromIndex--;
			/* The last midIndex + 1 in the loop can sometimes leave fromIndex 1 larger
			than it needs to be to find location within the children of node.children[fromIndex].
			Decrementing by 1 fixes that problem.
			*/
		}
		if (fromIndex >= 0 && fromIndex < node.children.length)
			return findToken(location, node.children[fromIndex]);
	}
}

export function convertMessageObjectsToParseMessages(messages, tree) {
	return messages.map(function(message) {
		let token;
		if (tree !== undefined)
			token = findToken(message.token, tree);
		/*
		If unable to find a matching token from the specified tree,
		create one.
		We prefer tokens from the tree because it is closer to what happens in a typically parse.
		In some cases, the token can't be found, though.
		For example, '\n' new line tokens are removed by Logo.getParseTree but
		Logo.getParseTree sometimes logs messages associated with those removed tokens.
		*/
		if (token === undefined)
			token = convertObjectToParseTree(message.token);
		return new ParseMessage(message.type, message.msg, token, message.isHTML);
	});
};