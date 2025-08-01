import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { sanitizeTokens } from
'../../../../../modules/parsing/basic/qbasic/scanning/sanitizeTokens.js';
import { scan } from
'../../../../../modules/parsing/basic/qbasic/scanning/scan.js';

export function testSanitizeTokens(logger) {
	const cases = [
	{'code': 'print "hi"',
	'tokens': ['print',
		{'s': '"hi"', 'colIndex': 9}]},
	{'code': 'print ”hi”',
	'tokens': ['print', '"hi"']},
	{'code': 'print “hi“',
	'tokens': ['print', '"hi"']},
	{'code': 'print “hi',
	'tokens': ['print',
		{'s': '"hi"', 'colIndex': 9}]},
	{'code': 'print ”hi“',
	'tokens': ['print', '"hi"']},
	{'code': '’iconfile.ico’',
	'tokens': ['"iconfile.ico"']},
	{'code': '$EXEICON:’iconfile.ico’',
	'tokens': ['$EXEICON', ':', '"iconfile.ico"']},
	{'code': '', 'tokens': []}, // The  character should get filtered out.
	{'code': 'print 3 *',
	'tokens': ['print', '3']}, // a trailing binary operator should be removed.
	{'code': 'print 3 +',
	'tokens': ['print', '3']},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tokens = scan(caseInfo.code);
		sanitizeTokens(tokens);
		if (tokens.length !== caseInfo.tokens.length) {
			plogger(`Expected ${caseInfo.tokens.length} tokens but found ${tokens.length}`);
			return;
		}
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const eTokenInfo = caseInfo.tokens[i];
			const expectedS = typeof eTokenInfo === 'object' ? eTokenInfo.s : eTokenInfo;
			const tlogger = prefixWrapper(`Token ${i}`, plogger);
			if (token.s !== expectedS)
				tlogger(`expected to have s='${expectedS}' but found '${token.s}'`);
			if (Number.isInteger(eTokenInfo.colIndex) &&
			eTokenInfo.colIndex !== token.colIndex)
				tlogger(`Expected colIndex ${eTokenInfo.colIndex} but found ${token.colIndex}`);
			if (Number.isInteger(eTokenInfo.lineIndex) &&
			eTokenInfo.lineIndex !== token.lineIndex)
				tlogger(`Expected lineIndex ${eTokenInfo.lineIndex} but found ${token.lineIndex}`);
		}
	});
};