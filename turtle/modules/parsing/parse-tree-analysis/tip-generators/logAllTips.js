import { getAnimationTips } from './getAnimationTips.js';
import { getTipsForProcOrCommandName } from './getTipsForProcOrCommandName.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';

export function logAllTips(cachedParseTree, parseLogger) {
	getAnimationTips(cachedParseTree, parseLogger);
	getTipsForProcOrCommandName(cachedParseTree, parseLogger);
};