import { testAnimationSetupOutputDenoiser } from './testAnimationSetupOutputDenoiser.js';
import { testCurvedBracketDenoiser } from './testCurvedBracketDenoiser.js';
import { testDenoiseParseMessages } from './testDenoiseParseMessages.js';
import { testInvalidVariableNameDenoiser } from './testInvalidVariableNameDenoiser.js';
import { testMakeQuoteErrorMostImportantForToken } from './testMakeQuoteErrorMostImportantForToken.js';
import { testOperatorMessageDenoiser } from './testOperatorMessageDenoiser.js';
import { testUnassignedVariableDenoiser } from './testUnassignedVariableDenoiser.js';
import { testValueAssignedDenoiser } from './testValueAssignedDenoiser.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testDenoising(logger) {
	wrapAndCall([
		testAnimationSetupOutputDenoiser,
		testCurvedBracketDenoiser,
		testDenoiseParseMessages,
		testInvalidVariableNameDenoiser,
		testMakeQuoteErrorMostImportantForToken,
		testOperatorMessageDenoiser,
		testUnassignedVariableDenoiser,
		testValueAssignedDenoiser
	], logger);
};