import { findToken } from
'../../../../helpers/findToken.js';
import { flatten } from
'../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { isInFunctionBody } from
'../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/isInFunctionBody.js';
import { parse } from
'../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testIsInFunctionBody(logger) {
	const cases = [
	{'code': 'console.log("hi");', 'checks': [
		{'token': {
			'val': '"hi"'
		}, 'out': false
		},
		{'token': {
			'val': 'console'
		}, 'out': false
		},
		{'token': {
			'val': 'log'
		}, 'out': false
		}
	]},
	{'code': 'function() { let x = 4;}', 'checks': [
		{'token': {
			'val': 'let'
		}, 'out': true
		},
		{'token': {
			'val': 'function'
		}, 'out': false
		},
		{'token': {
			'val': 'x'
		}, 'out': true
		},
		{'token': {
			'val': ';'
		}, 'out': true
		}
	]},
	{'code': '(z) => { let x = 4;}', 'checks': [
		{'token': {
			'val': 'let'
		}, 'out': true
		},
		{'token': {
			'val': '=>'
		}, 'out': false
		},
		{'token': {
			'val': 'x'
		}, 'out': true
		},
		{'token': {
			'val': ';'
		}, 'out': true
		},
		{'token': {
			'val': 'z'
		}, 'out': false
		}
	]},
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const allTokens = flatten(parseResult.root);
		caseInfo.checks.forEach(function(checkInfo, cIndex) {
			const clogger = prefixWrapper(`Check ${cIndex}, token.val=${checkInfo.token.val}`, plogger);
			const token = findToken(checkInfo.token, allTokens, clogger);
			const result = isInFunctionBody(token);
			if (result !== checkInfo.out)
				clogger(`Expected ${checkInfo.out} but got ${result}`);
		});
	});
};