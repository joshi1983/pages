import { validateIdentifier } from '../../../modules/parsing/parse-tree-analysis/validateIdentifier.js';

export function testValidateIdentifier(logger) {
	const cases = [
	{'in': '', 'result': false},
	{'in': '?', 'result': false},
	{'in': '.', 'result': false},
	{'in': ',', 'result': false},
	{'in': '!', 'result': false},
	{'in': '%', 'result': false},
	{'in': '[', 'result': false},
	{'in': ']', 'result': false},
	{'in': '4f', 'result': false},
	{'in': '#f', 'result': false},
	{'in': '&f', 'result': false},
	{'in': '.f', 'result': false},
	{'in': '+', 'result': false},
	{'in': '-', 'result': false},
	{'in': '*', 'result': false},
	{'in': '/', 'result': false},
	{'in': '~', 'result': false},
	{'in': 'y~', 'result': false},
	{'in': 'years~', 'result': false},
	{'in': '_', 'result': true},
	{'in': 'h', 'result': true},
	{'in': 'H', 'result': true},
	{'in': 'hello', 'result': true},
	{'in': 'HelLo_', 'result': true},
	{'in': 'hel#lo', 'result': false},
	{'in': 'hel&lo', 'result': false},
	{'in': 'hel.lo', 'result': true},
	{'in': 'hel.lo.world', 'result': true},
	{'in': '.hello', 'result': false},
	{'in': 'even?', 'result': true},

	{'in': 'ξ', 'result': true},
	{'in': 'ξξ', 'result': true},
	{'in': 'λ', 'result': true},
	{'in': 'λλ', 'result': true},
	// some Greek
	{'in': 'عربية', 'result': true},
	// some Arabic

	{'in': 'à', 'result': true},
	{'in': 'àà', 'result': true},
	// some French

	{'in': 'ò', 'result': true},
	{'in': 'òò', 'result': true},
	// some Italian

	{'in': '北京', 'result': true},
	// some Chinese

	{'in': '平仮名', 'result': true},
	// some Japanese from https://en.wiktionary.org/wiki/%E5%B9%B3%E4%BB%AE%E5%90%8D
	// not sure if the characters are different from the range used by Chinese

	/*
	These foreign alphabet strings are treated as valid identifiers because of discussion at:
	https://sourceforge.net/p/fmslogo/support-requests/43/
	I don't see a strong reason to exclude these multilingual characters when FMSLogo supports them.
	They might look odd in certain font families but I want to include them until and unless
	I find situations where supporting them as identifiers causes more problems.
	*/
	];
	cases.forEach(function(caseInfo) {
		const msg = validateIdentifier(caseInfo.in);
		if ((msg === undefined) !== caseInfo.result)
			logger('Expected a validity of ' + caseInfo.result + ' but got the message: ' + msg + ' for input of "' + caseInfo.in + '"');
	});
}