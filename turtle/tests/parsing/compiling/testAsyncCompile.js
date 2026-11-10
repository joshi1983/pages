import { asyncCompile } from
'../../../modules/parsing/compiling/asyncCompile.js';
import { LogoProgram } from
'../../../modules/parsing/execution/LogoProgram.js';
import { ParseTreeToken } from
'../../../modules/parsing/ParseTreeToken.js';
import { ProgressIndicator } from
'../../helpers/ProgressIndicator.js';

export function testAsyncCompile(logger) {
	const promise = asyncCompile('forward 100');
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
				logger(`asyncCompile's result should resolve to an object but found ${program}`);
			else {
				if (!(program instanceof LogoProgram))
					logger(`asyncCompile's result should resolve to an instance of LogoProgram but it did not. program=${program}`);

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
};
