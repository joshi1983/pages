import { animationSetupOutputDenoiser } from './animationSetupOutputDenoiser.js';
import { CachedParseTree } from '../CachedParseTree.js';
import { commandInputRangeDenoiser } from './commandInputRangeDenoiser.js';
import { curvedBracketDenoiser } from './curvedBracketDenoiser.js';
import { duplicateProcedureNameDenoiser } from './duplicateProcedureNameDenoiser.js';
import { invalidVariableNameDenoiser } from './invalidVariableNameDenoiser.js';
import { invokeDenoiser } from './invokeDenoiser.js';
import { makeQuoteErrorMostImportantForToken } from './makeQuoteErrorMostImportantForToken.js';
import { operatorMessageDenoiser } from './operatorMessageDenoiser.js';
import { procedureParameterTypeDenoiser } from './procedureParameterTypeDenoiser.js';
import { procedureInProcedureDenoiser } from './procedureInProcedureDenoiser.js';
import { repeatCommandDenoiser } from './repeatCommandDenoiser.js';
import { unassignedVariableDenoiser } from './unassignedVariableDenoiser.js';
import { unexpectedEndToProcedureDenoiser } from './unexpectedEndToProcedureDenoiser.js';
import { unrecognizedProcedureDenoiser } from './unrecognizedProcedureDenoiser.js';
import { unrecognizedSymbolDenoiser } from './unrecognizedSymbolDenoiser.js';
import { valueAssignedDenoiser } from './valueAssignedDenoiser.js';

const denoisers = [
	animationSetupOutputDenoiser,
	commandInputRangeDenoiser,
	curvedBracketDenoiser,
	duplicateProcedureNameDenoiser,
	invalidVariableNameDenoiser,
	invokeDenoiser,
	makeQuoteErrorMostImportantForToken,
	operatorMessageDenoiser,
	procedureInProcedureDenoiser,
	procedureParameterTypeDenoiser,
	repeatCommandDenoiser,
	unassignedVariableDenoiser,
	unexpectedEndToProcedureDenoiser,
	unrecognizedProcedureDenoiser,
	unrecognizedSymbolDenoiser,
	valueAssignedDenoiser
];
export function denoiseParseMessages(cachedParseTree, parseMessages) {
	if (cachedParseTree !== undefined && !(cachedParseTree instanceof CachedParseTree))
		throw new Error('cachedParseTree must be a CachedParseTree or undefined.  Not: ' + cachedParseTree);
	if (!(parseMessages instanceof Array))
		throw new Error('parseMessages must be an Array.  Not: ' + parseMessages);
	
	denoisers.forEach(function(denoiser) {
		denoiser(cachedParseTree, parseMessages);
	});
};