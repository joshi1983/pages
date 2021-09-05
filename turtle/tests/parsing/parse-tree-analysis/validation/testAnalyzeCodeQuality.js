import { analyzeCodeQuality } from '../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { noop } from '../../../../modules/noop.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

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
			analyzeCodeQuality(tree, parseLogger, new Map(), new Map(), false);
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
		'to p\nlocalmake "x 3\nif :x > count\nfd 100\nend',
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

	/* 
	The following printing of brackets should log errors to be consistent with FMSLogo.
	FMSLogo doesn't treat the following cases as runnable code so WebLogo shouldn't either.
	*/
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
setPenGradient createLinearGradient pos pos :colorStops "pad`
// bad because the start and end point is the same.
	];

	cases.forEach(function(code, index) {
		const parseLogger = new TestParseLogger(noop, code);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (!parseLogger.hasLoggedErrors())
			analyzeCodeQuality(tree, parseLogger, new Map(), new Map());
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
			analyzeCodeQuality(tree, parseLogger, new Map(), new Map());
	});
}

export function testAnalyzeCodeQuality(logger) {
	wrapAndCall([
		testThatBadCodeLogsErrors,
		testThatGoodCodeDoesNotLogErrors,
		testCommander
	], logger);
};