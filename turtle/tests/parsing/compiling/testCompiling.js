import { testCompile } from './testCompile.js';
import { testCompileDataListLiteral } from './testCompileDataListLiteral.js';
import { testCompileFromParseTree } from './testCompileFromParseTree.js';
import { testCompileIfStatements } from './testCompileIfStatements.js';
import { testCompileLoops } from './testCompileLoops.js';
import { testInstructionListOptimization } from './instruction-list-optimization/testInstructionListOptimization.js';
import { testShouldValueBeCloned } from './testShouldValueBeCloned.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testCompiling(logger) {
	testCompile(prefixWrapper('testCompile', logger));
	testCompileDataListLiteral(prefixWrapper('testCompileDataListLiteral', logger));
	testCompileFromParseTree(prefixWrapper('testCompileFromParseTree', logger));
	testCompileIfStatements(prefixWrapper('testCompileIfStatements', logger));
	testCompileLoops(prefixWrapper('testCompileLoops', logger));
	testInstructionListOptimization(prefixWrapper('testInstructionListOptimization', logger));
	testShouldValueBeCloned(prefixWrapper('testShouldValueBeCloned', logger));
};