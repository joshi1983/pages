import { CachedParseTree } from '../CachedParseTree.js';
import { curvedBracketDenoiser } from './curvedBracketDenoiser.js';
import { duplicateProcedureNameDenoiser } from './duplicateProcedureNameDenoiser.js';
import { invalidVariableNameDenoiser } from './invalidVariableNameDenoiser.js';
import { invokeDenoiser } from './invokeDenoiser.js';
import { makeQuoteErrorMostImportantForToken } from './makeQuoteErrorMostImportantForToken.js';
import { operatorMessageDenoiser } from './operatorMessageDenoiser.js';
import { procedureInProcedureDenoiser } from './procedureInProcedureDenoiser.js';
import { unassignedVariableDenoiser } from './unassignedVariableDenoiser.js';
import { unexpectedEndToProcedureDenoiser } from './unexpectedEndToProcedureDenoiser.js';
import { unrecognizedProcedureDenoiser } from './unrecognizedProcedureDenoiser.js';

export function denoiseParseMessages(cachedParseTree, parseMessages) {
	if (cachedParseTree !== undefined && !(cachedParseTree instanceof CachedParseTree))
		throw new Error('cachedParseTree must be a CachedParseTree or undefined.  Not: ' + cachedParseTree);
	if (!(parseMessages instanceof Array))
		throw new Error('parseMessages must be an Array.  Not: ' + parseMessages);
	curvedBracketDenoiser(cachedParseTree, parseMessages);
	duplicateProcedureNameDenoiser(cachedParseTree, parseMessages);
	invalidVariableNameDenoiser(cachedParseTree, parseMessages);
	invokeDenoiser(cachedParseTree, parseMessages);
	makeQuoteErrorMostImportantForToken(cachedParseTree, parseMessages);
	operatorMessageDenoiser(cachedParseTree, parseMessages);
	procedureInProcedureDenoiser(cachedParseTree, parseMessages);
	unassignedVariableDenoiser(cachedParseTree, parseMessages);
	unexpectedEndToProcedureDenoiser(cachedParseTree, parseMessages);
	unrecognizedProcedureDenoiser(cachedParseTree, parseMessages);
};