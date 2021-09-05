import { testBreakpoint } from './testBreakpoint.js';
import { testErrorCasesValidationAtRuntime } from './testErrorCasesValidationAtRuntime.js';
import { testExecuteLogoProcedure } from './testExecuteLogoProcedure.js';
import { testExecuterWithParsedOptimizations } from './testExecuterWithParsedOptimizations.js';
import { testInstructions } from './instructions/testInstructions.js';
import { testLogoProgram } from './testLogoProgram.js';
import { testLogoProgramExecuter } from './testLogoProgramExecuter.js';
import { testLogoProgramExecuterAsync } from './testLogoProgramExecuterAsync.js';
import { testLogoProgramExecuterBreakpoints } from './testLogoProgramExecuterBreakpoints.js';
import { testLogoProgramExecuterInvokeUsingPrint } from './testLogoProgramExecuterInvokeUsingPrint.js';
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
		testLogoProgramExecuterInvokeUsingPrint,
		testLogoProgramExecuterUsingPrint,
		testLogoProgramExecuterWithBreakCommand,
		testLogoProgramExecuterWithGradients,
		testLogoProgramExecuterWithSwap,
		testOrientation3DCompatibility,
	], logger);
};