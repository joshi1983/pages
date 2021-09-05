import { asyncCompile } from
'../../../modules/parsing/compiling/asyncCompile.js';
import { LogoProgram } from
'../../../modules/parsing/execution/LogoProgram.js';
import { ParseTreeToken } from
'../../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { ProgressIndicator } from
'../../helpers/ProgressIndicator.js';

function testWithSpecificCode(code, logger) {
	const promise = asyncCompile(code);
	if (!(promise instanceof Promise))
		logger(`asyncCompile should always return a Promise but found ${promise}`);
	else {
		let resolved = false;
		const indicator = new ProgressIndicator('asyncCompiler');
		indicator.setMessage('Waiting for promise');
		logger.indicators.push(indicator);
		promise.then(function(compileResult) {
			resolved = true;
			const program = compileResult.program;
			if (typeof program !== 'object' || program === null)
				logger(`asyncCompile's result.program should resolve to an object but found ${program}`);
			else {
				if (!(program instanceof LogoProgram))
					logger(`asyncCompile's result.program should resolve to an instance of LogoProgram but it did not. program=${program}`);

				if (typeof program.code !== 'string')
					logger(`program.code should be a string but found ${program.code}`);
				if (typeof program.parseTree !== 'object')
					logger(`program.parseTree should be an object but found ${program.parseTree}`);
				else if (!(program.parseTree instanceof ParseTreeToken)) {
					logger(`program.parseTree should be an instance of ParseTreeToken but it is not. program.parseTree=${program.parseTree}`);
				}
				if (!(program.procedures instanceof Map))
					logger(`program.procedures should be a Map but found ${program.procedures}`);
				if (!(program.instructions instanceof Array))
					logger(`program.instructions should be an Array but found ${program.instructions}`);
			}
			indicator.completed();
		}, function(e) {
			console.error(e);
			logger(`asyncCompile failed. e=${e}`);
			indicator.completed();
		});
		const maxTimeout = 30000;
		setTimeout(function() {
			if (!resolved) {
				logger(`Expected to resolve within ${maxTimeout}ms but did not.`);
				indicator.completed();
			}
		}, maxTimeout);
	}
}

export function testAsyncCompile(logger) {
	const cases = [
		'forward 100',
		`to p
	print "hi
end

p`
	];
	cases.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		testWithSpecificCode(code, plogger);
	});
};
