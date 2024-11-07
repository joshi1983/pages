import { testCompile } from './testCompile.js';
import { testCompileDataListLiteral } from './testCompileDataListLiteral.js';
import { testCompileFromParseTree } from './testCompileFromParseTree.js';
import { testCompileIfElseStatements } from './testCompileIfElseStatements.js';
import { testCompileIfStatements } from './testCompileIfStatements.js';
import { testCompileLoops } from './testCompileLoops.js';
import { testCompileRectProgram } from './testCompileRectProgram.js';
import { testCompileSwap } from './testCompileSwap.js';
import { testCreateEmptyProgram } from './testCreateEmptyProgram.js';
import { testInstructionListOptimization } from './instruction-list-optimization/testInstructionListOptimization.js';
import { testShouldValueBeCloned } from './testShouldValueBeCloned.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testCompiling(logger) {
	wrapAndCall([
		/*testCompile,
		testCompileDataListLiteral,
		testCompileFromParseTree,
		testCompileIfElseStatements,
		testCompileIfStatements,
		testCompileLoops,
		*/testCompileRectProgram,/*
		testCompileSwap,*/
		testCreateEmptyProgram,/*
		testInstructionListOptimization,
		testShouldValueBeCloned*/
	], logger);
};