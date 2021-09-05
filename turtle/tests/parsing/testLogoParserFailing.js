import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { noop } from '../../modules/noop.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

export function testLogoParserFailing(logger) {
	const cases = [
		// parse should fail because a new line is needed at the end of the parameter list.
		'to p []',
		'to p ]',
		'print -',
		'repeat\nprint :x\n]',
		'make "c [-]',
		'make "c [-to]',
		'make "c [-TO]',
		'make "c [-end',
		'make "c [-End',
		'make "c [-end]',
		'make "c [-End]',
		`make "c [
	[-
	]
]`
	];

	cases.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseLogger = new TestParseLogger(noop, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (!parseLogger.hasLoggedErrors()) {
			console.error('parse tree = ', tree, ' for code = ' + code);
			plogger('Expected to fail parsing but parsing logged no errors for code: ' + code);
		}
	});
};