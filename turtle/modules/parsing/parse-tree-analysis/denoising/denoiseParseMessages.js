import { CachedParseTree } from '../CachedParseTree.js';
import { duplicateProcedureNameDenoiser } from './duplicateProcedureNameDenoiser.js';
import { invalidVariableNameDenoiser } from './invalidVariableNameDenoiser.js';
import { invokeDenoiser } from './invokeDenoiser.js';
import { makeQuoteErrorMostImportantForToken } from './makeQuoteErrorMostImportantForToken.js';
import { unassignedVariableDenoiser } from './unassignedVariableDenoiser.js';
import { unrecognizedProcedureDenoiser } from './unrecognizedProcedureDenoiser.js';

export function denoiseParseMessages(cachedParseTree, parseMessages) {
	if (!(cachedParseTree instanceof CachedParseTree))
		throw new Error('cachedParseTree must be a CachedParseTree.  Not: ' + cachedParseTree);
	if (!(parseMessages instanceof Array))
		throw new Error('parseMessages must be an Array.  Not: ' + parseMessages);
	duplicateProcedureNameDenoiser(cachedParseTree, parseMessages);
	makeQuoteErrorMostImportantForToken(cachedParseTree, parseMessages);
	unassignedVariableDenoiser(cachedParseTree, parseMessages);
	unrecognizedProcedureDenoiser(cachedParseTree, parseMessages);
	invalidVariableNameDenoiser(cachedParseTree, parseMessages);
	invokeDenoiser(cachedParseTree, parseMessages);
};