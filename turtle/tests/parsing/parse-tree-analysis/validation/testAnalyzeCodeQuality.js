import { analyzeCodeQuality } from '../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { noop } from '../../../../modules/noop.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

function testCommander(logger) {
	// test various cases for the Commander.
	// Validation in the Commander should be a little different since it is only part of the program's code.
	const cases = [
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
		'fd ifelse 1 < 2 [3] 5'
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
	testThatBadCodeLogsErrors(prefixWrapper('testThatBadCodeLogsErrors', logger));
	testThatGoodCodeDoesNotLogErrors(prefixWrapper('testThatGoodCodeDoesNotLogErrors', logger));
	testCommander(prefixWrapper('testCommander', logger));
};