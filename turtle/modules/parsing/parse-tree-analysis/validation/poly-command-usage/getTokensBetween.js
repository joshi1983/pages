import { CommandCalls } from '../../CommandCalls.js';
import { isLoop } from '../../isLoop.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { pathCommandNames } from '../../pathCommandNames.js';

export function getTokensBetween(tokens, i, endIndex) {
	return tokens.slice(i, endIndex).
		filter(tok => tok.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
		(!CommandCalls.isCommandCall(tok) || isLoop(tok) ||
		CommandCalls.tokenMatchesPrimaryNames(tok, pathCommandNames)));
};