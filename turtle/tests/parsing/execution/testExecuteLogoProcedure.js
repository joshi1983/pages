import { compile } from '../../../modules/parsing/compile.js';
import { createTestTurtle } from '../../helpers/createTestTurtle.js';
import { executeLogoProcedure } from '../../../modules/parsing/execution/executeLogoProcedure.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testExecuteLogoProcedure(logger) {
	const code = 'to animation.setup\noutput 2\nend\n fd 10';
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger, new Map());
	if (parseLogger.hasLoggedErrors()) {
		logger('Unexpected errors while parsing code: ' + code);
	}
	else {
		const turtle = createTestTurtle();
		const program = compile(code, tree, parseLogger, new Map(), {'translateToJavaScript': false}, new Map());
		let isCompleted = false;
		executeLogoProcedure(program, 'animation.setup').then(function(result) {
			if (result !== 2)
				logger('Expected to get a value of 2 from executing the procedure but got ' + result);
			isCompleted = true;
		}).catch(function(e) {
			console.error(e);
			logger('An error happened while executing a Logo procedure.  The details are: ' + e);
		});
		// give the async function a generous amount of time but if it still doesn't complete, report the problem.
		setTimeout(function() {
			if (isCompleted === false)
				logger('The asyncronous execution of the procedure did not complete in 3 seconds which means it likely never will.');
		}, 3000);
	}
};