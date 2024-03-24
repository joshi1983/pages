import { testBreakLinesInProcedures } from './testBreakLinesInProcedures.js';
import { testCompositeFixer } from './testCompositeFixer.js';
import { testGeosphereFixer } from './testGeosphereFixer.js';
import { testGotoFixer } from './testGotoFixer.js';
import { testIfElseStatementFixer } from './testIfElseStatementFixer.js';
import { testIsLikelyLogo3D } from './testIsLikelyLogo3D.js';
import { testLogo3DReplacementFixer } from './testLogo3DReplacementFixer.js';
import { testLogo3DToWebLogo } from './testLogo3DToWebLogo.js';
import { testRemoveErroneousNumbersFixer } from './testRemoveErroneousNumbersFixer.js';
import { testRemoveImportsFixer } from './testRemoveImportsFixer.js';
import { testRemoveUnusedMarkCalls } from './testRemoveUnusedMarkCalls.js';
import { testTimeoutFixer } from './testTimeoutFixer.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testLogo3D(logger) {
	wrapAndCall([
		testBreakLinesInProcedures,
		testCompositeFixer,
		testGeosphereFixer,
		testGotoFixer,
		testIfElseStatementFixer,
		testIsLikelyLogo3D,
		testLogo3DReplacementFixer,
		testLogo3DToWebLogo,
		testRemoveErroneousNumbersFixer,
		testRemoveImportsFixer,
		testRemoveUnusedMarkCalls,
		testTimeoutFixer
	], logger);
};