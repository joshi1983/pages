import { processTokens } from './helpers/processTokens.js';
import { processUninitializedDeclarations } from
'./helpers/processUninitializedDeclarations.js';

export function processTreeRoot(token, result, options) {
	processUninitializedDeclarations(token, result, options);
	processTokens(token.children, result, options);
};