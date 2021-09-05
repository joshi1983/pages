import { testParseArraySubscript } from './testParseArraySubscript.js';
import { testParseAssignments } from './testParseAssignments.js';
import { testParseComments } from './testParseComments.js';
import { testParseDot } from './testParseDot.js';
import { testParseFor } from './testParseFor.js';
import { testParseFuncCall } from './testParseFuncCall.js';
import { testParseIf } from './testParseIf.js';
import { testParseImport } from './testParseImport.js';
import { testParsePackage } from './testParsePackage.js';
import { testParseSwitch } from './testParseSwitch.js';
import { testParseTreeAnalysis } from './parse-tree-analysis/testParseTreeAnalysis.js';
import { testParseUnaryOperator } from './testParseUnaryOperator.js';
import { testParseVar } from './testParseVar.js';
import { testParseVariousExamples } from './testParseVariousExamples.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testParseArraySubscript,
		testParseAssignments,
		testParseComments,
		testParseDot,
		testParseFor,
		testParseFuncCall,
		testParseIf,
		testParseImport,
		testParsePackage,
		testParseSwitch,
		testParseTreeAnalysis,
		testParseUnaryOperator,
		testParseVar,
		testParseVariousExamples
	], logger);
};