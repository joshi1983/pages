import { DeepEquality } from '../../../modules/DeepEquality.js';
import { getURLMatches } from '../../../modules/components/syntax-highlighter/getURLMatches.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testGetURLMatches(logger) {
	const cases = [
		{'in': '', 'len': 0},
		{'in': '; hello world', 'len': 0},
		{'in': '; http is a great protocol', 'len': 0},
		{'in': '; http://w would be a broken link so it should not be matched', 'len': 0},
		{'in': '; http://www. would be a broken link so it should not be matched', 'len': 0},
		{'in': '; http://ww/w.ca would be a broken link so it should not be matched', 'len': 0},
		{'in': '; http://canada.gc.ca is good', 'len': 1},
		{'in': '; https://www.canada.ca/home.html is good', 'len': 1},
		{'in': '; https://www.canada.ca/en/department-finance/economic-response-plan.html is good', 'len': 1},
		{'in': '; https://www.google.com', 'len': 1},
		{'in': '; http://www.google.com', 'len': 1},
		{'in': ';https://www.google.com', 'len': 1, 'out': [
			{'startIndex': 1, 's': 'https://www.google.com'}
		]},
		{'in': '; http://www.google.com and https://www.google.com', 'len': 2, 'out': [
			{'startIndex': 2, 's': 'http://www.google.com'},
			{'startIndex': 28, 's': 'https://www.google.com'},
		]},
		{'in': '; [http://www.google.com]', 'len': 1, 'out': [
			{'startIndex': 3, 's': 'http://www.google.com'}
		]},
		{'in': '; (http://www.google.com)', 'len': 1, 'out': [
			{'startIndex': 3, 's': 'http://www.google.com'}
		]},
		{'in': '; http://www.google.com?fields=items.view(mini)', 'len': 1, 'out': [
			{'startIndex': 2, 's': 'http://www.google.com?fields=items.view(mini)'
			}// Curved brackets are valid in a URL according to an answer at:
			// https://stackoverflow.com/questions/13225028/is-it-ok-to-have-brackets-or-parenthesis-in-url
			// Very rare to use them and problematic in many places but we want to accept them unless other 
			// indicators make it more reasonable to cut the URL off at the opening (.
		]
		}
	];
	cases.forEach(function(caseInfo) {
		const result = getURLMatches(caseInfo.in);
		const len = caseInfo.len !== undefined ? caseInfo.len : caseInfo.out.length;
		const plogger = prefixWrapper(`Failed case with string "${caseInfo.in}"`, logger);
		if (!(result instanceof Array))
			plogger('Expected an Array but got something else.  result = ' + result);
		else if (result.length !== len)
			plogger(`Expected ${len} matches but got ${result.length}.  Actual result is ${JSON.stringify(result)}`);
		else if (caseInfo.out instanceof Array) {
			if (!DeepEquality.equals(caseInfo.out, result))
				plogger(`Expected different results.  Expected ${JSON.stringify(caseInfo.out)} but got ${JSON.stringify(result)}`);
		}
		else {
			result.forEach(function(matchObject) {
				if (typeof matchObject !== 'object')
					plogger('Expected an object but got something with type: ' + typeof matchObject);
				else if (matchObject instanceof Array) 
					plogger('matchObject not expected to be an Array but got one');
				else {
					if (typeof matchObject.startIndex !== 'number')
						plogger('startIndex expected to be a number but got ' + matchObject.startIndex);
					if (typeof matchObject.s !== 'string')
						plogger('s expected to be a string but got ' + matchObject.s);
				}
			});
		}
	});
};