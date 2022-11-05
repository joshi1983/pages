import { analyzeCodeQuality } from '../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { noop } from '../../../helpers/noop.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

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
		`make "colorStops plistCreate
setProperty 0 "black
setPenSize 0.1`,
		'print 1)',
		'print :oldHeading + repcount:angle1',
		'print mix :x :y 1',
		`to p
end
print mix "white "red
p`
	];

	cases.forEach(function(code) {
		const parseLogger = new TestParseLogger(noop, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (!parseLogger.hasLoggedErrors())
			analyzeCodeQuality(tree, parseLogger, new Map(), new Map());
		if (!parseLogger.hasLoggedErrors()) {
			console.error('parse tree = ', tree, ' for code = ' + code);
			logger('Expected to fail parsing but parsing logged no errors for code: ' + code);
		}
	});
}

export function testAnalyzeCodeQuality(logger) {
	testThatBadCodeLogsErrors(logger);
};