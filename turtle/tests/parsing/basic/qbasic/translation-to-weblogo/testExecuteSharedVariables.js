import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteSharedVariables(logger) {
	const cases = [
	{'code': `DECLARE SUB test ()
x = 2
CALL test
PRINT x

SUB test
	x = 3
	PRINT x
END SUB`, 'messages': ['3', '2']
// without "shared", x should be a local variable within the test subroutine.
// This is the same output found while testing QBASIC 1.1 at:
// https://archive.org/details/msdos_qbasic_megapack
	}, {'code': `DECLARE SUB test ()
x = 2
CALL test
PRINT x

SUB test
	shared x
	x = 3
	PRINT x
END SUB`, 'messages': ['3', '3']
	}
	];
	processTranslateExecuteCases(cases, logger);
};