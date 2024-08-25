import { CachedParseTree } from '../CachedParseTree.js';
import { logAllTips } from '../tip-generators/logAllTips.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';

import { validatePenUp } from './validatePenUp.js';

const validators = [
];

export function analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, isCompleteProgram) {
	if (!(parseLogger instanceof ParseLogger))
		throw new Error('parseLogger must be a ParseLogger');
	if (!(proceduresMap instanceof Map))
		throw new Error(`proceduresMap must be a Map. Got ${proceduresMap}`);
	if (!(initialVariablesMap instanceof Map))
		throw new Error(`initialVariablesMap must be a Map. Got ${initialVariablesMap}`);
	if (isCompleteProgram === undefined)
		isCompleteProgram = true;

	const cachedParseTree = new CachedParseTree(tree, proceduresMap, initialVariablesMap);

	logAllTips(cachedParseTree, parseLogger);
	for (let i = 0; i < validators.length; i++)
		validators[i](cachedParseTree, parseLogger);
	if (isCompleteProgram === true)
		validatePenUp(cachedParseTree, parseLogger);

};