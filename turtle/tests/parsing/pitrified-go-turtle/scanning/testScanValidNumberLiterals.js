import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/scan.js';
import { validNumbers } from
'./testIsCompleteNumberLiteral.js';

export function testScanValidNumberLiterals(logger) {
	validNumbers.forEach(function(num, index) {
		const plogger = prefixWrapper(`Case ${index}, num=${num}`, logger);
		const tokens = scan(num);
		if (!(tokens instanceof Array))
			plogger(`scan should always return an Array but found ${tokens}`);
		else if (tokens.length !== 1)
			plogger(`Expected scan to return 1 token but found ${tokens.length}`);
		else {
			const token = tokens[0];
			if (token.s !== num)
				plogger(`Expected the only token to have s=${num} but found ${num}`);
			if (token.colIndex !== num.length - 1)
				plogger(`Expected colIndex to be ${num.length - 1} but found ${token.colIndex}`);
			if (token.lineIndex !== 0)
				plogger(`Expected lineIndex to be 0 but found ${token.lineIndex}`);
		}
	});
};