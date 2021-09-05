import { testBreakpoint } from './testBreakpoint.js';
import { testErrorCasesValidationAtRuntime } from './testErrorCasesValidationAtRuntime.js';
import { testExecuteLogoProcedure } from './testExecuteLogoProcedure.js';
import { testExecuterWithParsedOptimizations } from './testExecuterWithParsedOptimizations.js';
import { testInstructions } from './instructions/testInstructions.js';
import { testLogoProgram } from './testLogoProgram.js';
import { testLogoProgramExecuter } from './testLogoProgramExecuter.js';
import { testLogoProgramExecuterAsync } from './testLogoProgramExecuterAsync.js';
import { testLogoProgramExecuterBreakpoints } from './testLogoProgramExecuterBreakpoints.js';
import { testLogoProgramExecuterFor } from './testLogoProgramExecuterFor.js';
import { testLogoProgramExecuterIfElse } from './testLogoProgramExecuterIfElse.js';
import { testLogoProgramExecuterInlinedCommands } from './testLogoProgramExecuterInlinedCommands.js';
import { testLogoProgramExecuterInvokeUsingPrint } from './testLogoProgramExecuterInvokeUsingPrint.js';
import { testLogoProgramExecuterOperators } from './testLogoProgramExecuterOperators.js';
import { testLogoProgramExecuterRandomFunctions } from './testLogoProgramExecuterRandomFunctions.js';
import { testLogoProgramExecuterUsingPrint } from './testLogoProgramExecuterUsingPrint.js';
import { testLogoProgramExecuterWithBreakCommand } from './testLogoProgramExecuterWithBreakCommand.js';
import { testLogoProgramExecuterWithGradients } from './testLogoProgramExecuterWithGradients.js';
import { testLogoProgramExecuterWithSwap } from './testLogoProgramExecuterWithSwap.js';
import { testOrientation3DCompatibility } from './testOrientation3DCompatibility.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testExecution(logger) {
	wrapAndCall([
		testBreakpoint,
		testErrorCasesValidationAtRuntime,
		testExecuteLogoProcedure,
		testExecuterWithParsedOptimizations,
		testInstructions,
		testLogoProgram,
		testLogoProgramExecuter,
		testLogoProgramExecuterAsync,
		testLogoProgramExecuterBreakpoints,
		testLogoProgramExecuterFor,
		testLogoProgramExecuterIfElse,
		testLogoProgramExecuterInlinedCommands,
		testLogoProgramExecuterInvokeUsingPrint,
		testLogoProgramExecuterOperators,
		testLogoProgramExecuterRandomFunctions,
		testLogoProgramExecuterUsingPrint,
		testLogoProgramExecuterWithBreakCommand,
		testLogoProgramExecuterWithGradients,
		testLogoProgramExecuterWithSwap,
		testOrientation3DCompatibility,
	], logger);
};