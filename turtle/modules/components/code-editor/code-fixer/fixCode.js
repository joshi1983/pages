import { allFixers } from './fixers/allFixers.js';
import { ArrayUtils } from '../../../ArrayUtils.js';
import { FixLogger } from './FixLogger.js';
import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';
import { ParseTreeToken } from '../../../parsing/ParseTreeToken.js';
import { runAllFixers } from './runAllFixers.js';
import { wrappedFix } from './wrappedFix.js';
await ParseTreeToken.asyncInit();

export function fixCode(code, fixLogger, proceduresMap, tree, extraFixers, firstFixers) {
	if (extraFixers !== undefined && !(extraFixers instanceof Array))
		throw new Error(`extraFixers must either be undefined or be an Array.  extraFixers was passed as ${extraFixers}`);
	if (firstFixers !== undefined && !(firstFixers instanceof Array))
		throw new Error(`firstFixers must either be undefined or be an Array.  firstFixers was passed as ${firstFixers}`);
	if (fixLogger instanceof ParseLogger)
		fixLogger = new FixLogger(fixLogger);
	else if (!(fixLogger instanceof FixLogger))
		throw new Error('fixLogger must be an instance of FixLogger or ParseLogger');
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');
	if (typeof code !== 'string')
		throw new Error('code must be a string.  Not: ' + code);
	if (tree !== undefined && !(tree instanceof ParseTreeToken))
		throw new Error('tree must either be undefined or be a ParseTreeToken.  Not: ' + tree);

	let allFixers_;
	if (extraFixers instanceof Array) {
		if (firstFixers !== undefined)
			allFixers_ = firstFixers.slice();
		else
			allFixers_ = [];
		ArrayUtils.pushAll(allFixers_, allFixers);
		ArrayUtils.pushAll(allFixers_, extraFixers);
	}
	else
		allFixers_ = allFixers;
	return wrappedFix(code, runAllFixers(allFixers_), fixLogger, proceduresMap, tree);
};