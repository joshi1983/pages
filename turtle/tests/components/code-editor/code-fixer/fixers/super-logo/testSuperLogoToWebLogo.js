import { ParseLogger } from
'../../../../../../modules/parsing/loggers/ParseLogger.js';
import { superLogoToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/super-logo/superLogoToWebLogo.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedSuperLogoToWebLogo(code) {
	const parseLogger = new ParseLogger();
	return superLogoToWebLogo(code, parseLogger);
}

export function testSuperLogoToWebLogo(logger) {
	const cases = [
		{'in': 'print 10', 'changed': false},
		{'in': 'MAKE :X :X + 40', 'out': 'MAKE "X :X + 40'},
			// quote the variable name in make so it is valid WebLogo.
			// The : prefix is allowed for make in Super Logo.
			// Usually : is not used there in Super Logo but it won't cause an 
			// error according to documentation so we want to fix that for WebLogo.
		{'in': 'to circle\nend', 'out': 'to circle3\nend'
			// circle is a command name in WebLogo so we need to rename the procedure to something else.
		},
		{'in': 'test :x\niftrue []', 'out': 'if :x [\n]'},
		{'in': 'repeat 3 ()', 'out': 'repeat 3 [\n]'},
		{'in': 'while :x ()', 'out': 'while :x [\n]'},
		{'in': 'if :x () else ()', 'out': 'ifelse :x [\n] [\n]'},
		{'in': 'if :x (PRINT "hi ) else (print "bye )', 'out': 'ifelse :x [\n\tPRINT "hi\n] [\n\tprint "bye\n]'},
		{'in': 'slow 10', 'out': ''
			// slow command calls should be removed because there is no equivalent command in WebLogo.
			// WebLogo lets the execution speed get controlled through the Debugging -> speed select feature.
		},
	];
	testInOutPairs(cases, wrappedSuperLogoToWebLogo, logger);
};