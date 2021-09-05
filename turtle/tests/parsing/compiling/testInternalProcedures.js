import { InternalProcedures } from
'../../../modules/parsing/compiling/InternalProcedures.js';
import { LogoProgram } from
'../../../modules/parsing/execution/LogoProgram.js';

export function testInternalProcedures(logger) {
	const code = InternalProcedures.getAllCode();
	if (typeof code !== 'string')
		logger(`Expected code to be a string but found ${code}`);
	else {
		const internalProgram = InternalProcedures.getCompiledLibrary();
		if (!(internalProgram instanceof LogoProgram))
			logger(`A LogoProgram was expected but found ${internalProgram}`);
	}
	const mapCode = InternalProcedures.getCodeForProcedure('map');
	if (typeof mapCode !== 'string')
		logger(`Expected mapCode to be a string but found ${mapCode}`);
};