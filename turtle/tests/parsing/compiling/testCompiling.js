import { testCompile } from './testCompile.js';
import { testCompileDataListLiteral } from './testCompileDataListLiteral.js';
import { testCompileFromParseTree } from './testCompileFromParseTree.js';
import { testCompileIfElseStatements } from './testCompileIfElseStatements.js';
import { testCompileIfStatements } from './testCompileIfStatements.js';
import { testCompileInternalProcedures } from './testCompileInternalProcedures.js';
import { testCompileLoops } from './testCompileLoops.js';
import { testCompileSwap } from './testCompileSwap.js';
import { testInstructionListOptimization } from './instruction-list-optimization/testInstructionListOptimization.js';
import { testInternalProcedures } from './testInternalProcedures.js';
import { testShouldTranslateToInternalProc } from './testShouldTranslateToInternalProc.js';
import { testShouldValueBeCloned } from './testShouldValueBeCloned.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testCompiling(logger) {
	wrapAndCall([
		testCompile,
		testCompileDataListLiteral,
		testCompileFromParseTree,
		testCompileIfElseStatements,
		testCompileIfStatements,
		testCompileInternalProcedures,
		testCompileLoops,
		testCompileSwap,
		testInstructionListOptimization,
		testInternalProcedures,
		testShouldTranslateToInternalProc,
		testShouldValueBeCloned
	], logger);
};