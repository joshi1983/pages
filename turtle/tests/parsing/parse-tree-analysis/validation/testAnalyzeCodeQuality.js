import { analyzeCodeQuality } from '../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { ArrayUtils } from '../../../../modules/ArrayUtils.js';
import { cgjenningsExamples } from '../../../helpers/parsing/l-systems/cgjenningsExamples.js';
import { codeHeartTurtleScriptExamples } from '../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { cssExamples } from '../../../helpers/parsing/cssExamples.js';
import { exceptionToString } from '../../../../modules/exceptionToString.js';
import { fmsLogoExamples } from '../../../helpers/parsing/fmsLogoExamples.js';
import { fractintExamples } from '../../../helpers/parsing/l-systems/fractintExamples.js';
import { getProceduresMap } from '../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { javascript2DCanvasExamples } from '../../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExampleFiles } from '../../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from '../../../helpers/parsing/logo3DExamples.js';
import { logoInterpreterExamples } from '../../../helpers/parsing/logoInterpreterExamples.js';
import { odinExamples } from '../../../helpers/parsing/odinExamples.js';
import { osmosianExamples } from '../../../helpers/parsing/osmosianExamples.js';
import { papertExamples } from '../../../helpers/parsing/papertExamples.js';
import { povRayExamples } from '../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from '../../../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFilesContent } from '../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { qbasicExamples } from '../../../helpers/parsing/basic/qbasicExamples.js';
import { smallVisualBasicExamples } from '../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { sonicWebTurtleExamples } from '../../../helpers/parsing/sonicWebTurtleExamples.js';
import { terrapinExamples } from '../../../helpers/parsing/terrapinExamples.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { noop } from '../../../../modules/noop.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';
import { zeroLExamples } from '../../../helpers/parsing/l-systems/zeroLExamples.js';

const nonWebLogoExamples = [];
ArrayUtils.pushAll(nonWebLogoExamples, cgjenningsExamples);
ArrayUtils.pushAll(nonWebLogoExamples, codeHeartTurtleScriptExamples);
ArrayUtils.pushAll(nonWebLogoExamples, cssExamples);
ArrayUtils.pushAll(nonWebLogoExamples, fmsLogoExamples);
ArrayUtils.pushAll(nonWebLogoExamples, fractintExamples);
ArrayUtils.pushAll(nonWebLogoExamples, javascript2DCanvasExamples);
ArrayUtils.pushAll(nonWebLogoExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonWebLogoExamples, logo3DExamples);
ArrayUtils.pushAll(nonWebLogoExamples, logoInterpreterExamples);
ArrayUtils.pushAll(nonWebLogoExamples, odinExamples);
ArrayUtils.pushAll(nonWebLogoExamples, osmosianExamples);
ArrayUtils.pushAll(nonWebLogoExamples, papertExamples);
ArrayUtils.pushAll(nonWebLogoExamples, povRayExamples);
ArrayUtils.pushAll(nonWebLogoExamples, processingExamples);
ArrayUtils.pushAll(nonWebLogoExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonWebLogoExamples, qbasicExamples);
ArrayUtils.pushAll(nonWebLogoExamples, smallVisualBasicExamples);
ArrayUtils.pushAll(nonWebLogoExamples, sonicWebTurtleExamples);
ArrayUtils.pushAll(nonWebLogoExamples, terrapinExamples);
ArrayUtils.pushAll(nonWebLogoExamples, zeroLExamples);

function testAllowProcsMatchingCommandNames(logger) {
	const code = `to map :procName :listValue
	localmake "result []
	repeat count :listValue [
		queue2 "result (invoke :procName item repcount :listValue)
	]
	output :result
end`;
		const parseLogger = new TestParseLogger(logger, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (!parseLogger.hasLoggedErrors()) {
			const proceduresMap = getProceduresMap(tree);
			analyzeCodeQuality(tree, parseLogger, proceduresMap, new Map(), {
				'isCompleteProgram': false,
				'allowProcsMatchingCommandNames': true
			});
		}
		if (parseLogger.hasLoggedErrorsOrWarnings() !== false) {
			logger('Expected to have no error or warning but got different result for code ' + code);
		}
};

function testCommander(logger) {
	// test various cases for the Commander.
	// Validation in the Commander should be a little different since it is only part of the program's code.
	const cases = [
		{'code': 'print \'it\\\'s\'', 'logged': false},
		{'code': 'fd 100', 'logged': false},
		{'code': 'penUp', 'logged': false},
		{'code': 'penDown', 'logged': false},
		{'code': 'fd', 'logged': true},
		{'code': 'fd "hi', 'logged': true}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		const code = caseInfo.code;
		const parseLogger = new TestParseLogger(noop, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (!parseLogger.hasLoggedErrors())
			analyzeCodeQuality(tree, parseLogger, new Map(), new Map(), {'isCompleteProgram': false});
		if (parseLogger.hasLoggedErrorsOrWarnings() !== caseInfo.logged) {
			console.error('parse tree = ', tree, ' for code = ' + code);
			logger('Expected to have error or warning of ${caseInfo.logged} but got different result for code ' + code);
		}
	});
}

function testThatBadCodeLogsErrors(logger) {
	const cases = [
		'end', // parse should fail because a new line is needed at the end of the parameter list.
		'to',
		'if',
		'if []',
		'fd',
		'to p []',
		'to p\n+\nend',
		'to p ]',
		'~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']',
		'{', '}', '|', '\\', ',', '.', '<', '>', '<=', '=', '>=',
		'4=', '=4', 'fd \'s',
		'set pen size',
		'print [hello world]',
		'to p',
		'to 1 end',
		'to 1\nend',
		'to 1a\nend',
		'print\nto p\nend',
		'to p\nrepeat []\nend',
		'repeat 5 5',
		'to p',
		'to p :',
		'to p :x',
		'to print',
		'to print\nend',
		'to p\nlocalmake "x 3\nif :x > count\nfd 100\nend',
		'drawArcLineShape penUp 100',
		'drawArcLineShapes penUp 100',
		'fd :x\nmake "x 1',
		'setProperty "varNotDeclared1 "x 4',
		'make "wrongType 4\nsetProperty "wrongType "x 4',
		'make "x 5\nqueue "x 4',
		'setProperty  :\nsetFillRadialGros pos',
		'to distanceToCircle :center :radius\nlocalmake "solutions []\nif 0 = count  [\noutput 0\n]\nend',
		`make "colorStops createPList
setProperty 0 "black
setPenSize 0.1`,
		'print 1)',
		'print mix :x :y 1',
		`to p
end
print mix "white "red
p`,
`repeat 2 [
	setItem 2 "p -item 2 "p
]`,
`repeat 2 [
	make "p []  
	setItem 2 "p -item 2 "p
]`,
		'fd ifelse 1 < 2 [3] 5',
		`to p
end

to p2
	localmake "x
	p
	jumpLeft 100 - :x
end`,

	//The following printing of brackets should log errors to be consistent with FMSLogo.
	//FMSLogo doesn't treat the following cases as runnable code so WebLogo shouldn't either.
	'print "(', 'print "[', 'print ")', 'print "]',
	'swap "x "y', // Can't swap uninitialized variables x and y.

	'make "points [] for ["x 1 :points] [print "hi]',
	// points is required to be a number.  Not a list.
	`For px& = 0 To x&
    c& = Point(px&)
    If 1 Then r$ = Chr$(c&) Else 
r$ = Left$(MKL$(c&), 3)
Next px&
`,
	`make "colorStops createPList2 [[0 "black] [1 "white]]
setPenGradient createLinearGradient pos pos :colorStops "pad`,
// bad because the start and end point is the same.

	`print (sort [] "arcTan2)`, // arcTan2 does not return the required bool.
	`to customLessEqual? :x :y
	output 3 ; returning a number won't match the required bool return types.
end
print (sort [] "customLessEqual? )`,
	'for ( : )',
	'for ( : :x )',
	'sentence [Repeat Count] scrollbarget',
	`PRINT "You're talking to "
PRINT "You're talking to "
PRINT "Type #END to end the chat."`,
	`to popState
setTurtleState pop :states
end`
	];

	cases.forEach(function(code, index) {
		const parseLogger = new TestParseLogger(noop, code);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (!parseLogger.hasLoggedErrors()) {
			const proceduresMap = getProceduresMap(tree);
			analyzeCodeQuality(tree, parseLogger, proceduresMap, new Map(), {});
		}
		if (!parseLogger.hasLoggedErrors()) {
			console.error('parse tree = ', tree, ' for code = ' + code);
			plogger('Expected to fail parsing but parsing logged no errors for code: ' + code);
		}
	});
}

function testThatGoodCodeDoesNotLogErrors(logger) {
	const cases = [
		'for [ "i 100 10 -10 ] [print :i]',
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo;
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseLogger = new TestParseLogger(plogger, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (parseLogger.hasLoggedErrors())
			plogger(`Expected no error during parsing but found some`);
		else
			analyzeCodeQuality(tree, parseLogger, new Map(), new Map(), {});
	});
}

function testNonWebLogoCodeShouldNotThrowExceptions(logger) {
	nonWebLogoExamples.forEach(function(code, index) {
		const parseLogger = new TestParseLogger(noop, code);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (tree === undefined)
			return; // failing to parse is ok for non-WebLogo code.

		if (!parseLogger.hasLoggedErrors()) {
			try {
				analyzeCodeQuality(tree, parseLogger, new Map(), new Map(), {});
			}
			catch (e) {
				console.error(e);
				plogger(`Error or exception thrown while analyzeCodeQuality ran on the example.  Nothing should be thrown.  The message was: ${exceptionToString(e)}`);
			}
		}
	});
}

export function testAnalyzeCodeQuality(logger) {
	wrapAndCall([
		testAllowProcsMatchingCommandNames,
		testNonWebLogoCodeShouldNotThrowExceptions,
		testThatBadCodeLogsErrors,
		testThatGoodCodeDoesNotLogErrors,
		testCommander
	], logger);
};