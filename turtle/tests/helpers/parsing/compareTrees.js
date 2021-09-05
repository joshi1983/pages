import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeToken as PythonParseTreeToken } from '../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
await ParseTreeToken.asyncInit();

const propertyKeys = ['colIndex', 'lineIndex', 'originalString', 'type', 'val'];

function isAParseTreeToken(val) {
	if (val instanceof ParseTreeToken)
		return true;
	if (val instanceof PythonParseTreeToken)
		return true;
	return false;
}

function singleNodeChecks(node, logger, nodeDescription) {
	if (!isAParseTreeToken(node))
		logger(`${nodeDescription} expected to be a ParseTreeToken but it is not.  node1=${node}`);
}

function basicCompareNodes(node1, node2, logger, settings) {
	if (node1 === null)
		logger('node1 not expected to be null but it is.');
	if (node2 === null)
		logger('node2 not expected to be null but it is.');
	nullibleCompareNodes(node1, node2, logger, 'node1', 'node2', settings);
}

function toReadable(key, val, settings) {
	if (key === 'type') {
		const name = settings.ParseTreeTokenType.getNameFor(val);
		if (name === undefined)
			return `${val}, unable to get a type name corresponding with ${val}`;
		return name;
	}
	else
		return val;
}

function nullibleCompareNodes(node1, node2, logger, node1Description, node2Description, settings) {
	if (node1 !== null)
		singleNodeChecks(node1, logger, node1Description);
	if (node2 !== null)
		singleNodeChecks(node2, logger, node2Description);
	if ((node1 === null) !== (node2 === null))
		logger(`expected to be null or not null at the same time but ${node1Description} is null? ${node1 === null}.  ${node2Description} is null? ${node2 === null}`);
	if (node1 !== null && node2 !== null) {
		if ((node1.parentNode === null) !== (node2.parentNode === null))
			logger(`expected to be null or not null at the same time but ${node1Description}.parentNode is null? ${node1.parentNode === null}.  ${node2Description}.parentNode is null? ${node2.parentNode === null}`);
		let propertyKeys_ = propertyKeys.filter(key => !settings.excludeKeys.has(key));
		if (settings.excludeIndexProperties === true)
			propertyKeys_ = propertyKeys_.filter(key => !key.endsWith('Index'));
		propertyKeys_.forEach(function(key) {
			if (node1[key] !== node2[key]) {
				let msg = `node ${key} values expected to be the same but they are not.  ${node1Description}.${key}=${toReadable(key, node1[key], settings)}, ${node2Description}.${key}=${toReadable(key, node2[key], settings)}`;
				if (key !== 'val')
					msg += `  node1.val=${node1.val}, node2.val=${node2.val}`;
				logger(msg);
			}
		});
	}
}

export function compareTrees(node1, node2, logger, settings) {
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function.  logger=${logger}`);
	if (!isAParseTreeToken(node1))
		throw new Error('node1 must be a ParseTreeToken. Not: ' + node1);
	if (!isAParseTreeToken(node2))
		throw new Error('node2 must be a ParseTreeToken. Not: ' + node2);
	if (settings !== undefined && (typeof settings !== 'object' || (settings instanceof Array)))
		throw new Error(`settings must either be undefined or an object.  Not: ${settings}`);
	if (settings === undefined)
		settings = {
			'excludeIndexProperties': false,
			'excludeKeys': new Set(),
		};
	else {
		if (typeof settings.excludeIndexProperties !== 'boolean')
			settings.excludeIndexProperties = false;
		if (settings.excludeKeys instanceof Array)
			settings.excludeKeys = new Set(settings.excludeKeys);
		else if (!(settings.excludeKeys instanceof Set))
			settings.excludeKeys = new Set();
	}
	if (settings.ParseTreeTokenType === undefined)
		settings.ParseTreeTokenType = ParseTreeTokenType;
	basicCompareNodes(node1, node2, logger, settings);
	if (node1 instanceof ParseTreeToken) {
		nullibleCompareNodes(node1.nextSibling, node2.nextSibling, logger, 'node1.nextSibling', 'node2.nextSibling', settings);
		nullibleCompareNodes(node1.previousSibling, node2.previousSibling, logger, 'node1.previousSibling', 'node2.previousSibling', settings);
	}
	if (node1.children.length !== node2.children.length)
		logger(`children length expected to be the same but they are not. node1.children.length=${node1.children.length}, `+
			`node2.children.length=${node2.children.length}, node1=${node1}, node2=${node2}, node1.val=${node1.val}, `+
			`node2.val=${node2.val}, node1.type is ${toReadable('type', node1.type, settings)}, node2.type=${toReadable('type', node1.type, settings)}`);
	else {
		for (let i = 0; i < node1.children.length; i++) {
			compareTrees(node1.children[i], node2.children[i], logger, settings);
		}
	}
};