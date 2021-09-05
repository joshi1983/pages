import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
await ParseTreeToken.asyncInit();

const propertyKeys = ['colIndex', 'lineIndex', 'originalString', 'type', 'val'];

function singleNodeChecks(node, logger, nodeDescription) {
	if (!(node instanceof ParseTreeToken))
		logger(`${nodeDescription} expected to be a ParseTreeToken but it is not.  node1=${node}`);
}

function basicCompareNodes(node1, node2, logger) {
	if (node1 === null)
		logger('node1 not expected to be null but it is.');
	if (node2 === null)
		logger('node2 not expected to be null but it is.');
	nullibleCompareNodes(node1, node2, logger, 'node1', 'node2');
}

function nullibleCompareNodes(node1, node2, logger, node1Description, node2Description) {
	if (node1 !== null)
		singleNodeChecks(node1, logger, node1Description);
	if (node2 !== null)
		singleNodeChecks(node2, logger, node2Description);
	if ((node1 === null) !== (node2 === null))
		logger(`expected to be null or not null at the same time but ${node1Description} is null? ${node1 === null}.  ${node2Description} is null? ${node2 === null}`);
	if (node1 !== null && node2 !== null) {
		if ((node1.parentNode === null) !== (node2.parentNode === null))
			logger(`expected to be null or not null at the same time but ${node1Description}.parentNode is null? ${node1.parentNode === null}.  ${node2Description}.parentNode is null? ${node2.parentNode === null}`);
		propertyKeys.forEach(function(key) {
			if (node1[key] !== node2[key])
				logger(`node ${key} values expected to be the same but they are not.  ${node1Description}.${key}=${node1[key]}, ${node2Description}.${key}=${node2[key]}`);
		});
	}
}

export function compareTrees(node1, node2, logger) {
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function.  logger=${logger}`);
	if (!(node1 instanceof ParseTreeToken))
		throw new Error('node1 must be a ParseTreeToken. Not: ' + node1);
	if (!(node2 instanceof ParseTreeToken))
		throw new Error('node2 must be a ParseTreeToken. Not: ' + node2);
	basicCompareNodes(node1, node2, logger);
	nullibleCompareNodes(node1.nextSibling, node2.nextSibling, logger, 'node1.nextSibling', 'node2.nextSibling');
	nullibleCompareNodes(node1.previousSibling, node2.previousSibling, logger, 'node1.previousSibling', 'node2.previousSibling');
	if (node1.children.length !== node2.children.length)
		logger(`children length expected to be the same but they are not. node1.children.length=${node1.children.length}, node2.children.length=${node2.children.length}`);
	else {
		for (let i = 0; i < node1.children.length; i++) {
			compareTrees(node1.children[i], node2.children[i], logger);
		}
	}
};