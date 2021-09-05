import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { noop } from '../helpers/noop.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

export function testLogoParserFailing(logger) {
	const cases = [
		// parse should fail because a new line is needed at the end of the parameter list.
		'to p []',
		'to p ]',
		'print -',
		'repeat\nprint :x\n]'
	];

	cases.forEach(function(code) {
		const parseLogger = new TestParseLogger(noop, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (!parseLogger.hasLoggedErrors()) {
			console.error('parse tree = ', tree, ' for code = ' + code);
			logger('Expected to fail parsing but parsing logged no errors for code: ' + code);
		}
	});
};