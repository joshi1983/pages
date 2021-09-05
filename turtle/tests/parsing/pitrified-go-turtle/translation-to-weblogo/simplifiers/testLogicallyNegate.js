import { logicallyNegate } from
'../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/simplifiers/logicallyNegate.js';
import { processSimplifierCases } from './processSimplifierCases.js';

function wrappedLogicallyNegate(logger) {
	return function(root) {
		const children = root.children;
		if (children.length !== 1)
			logger(`Expected 1 child but found ${children.length}`);
		else {
			logicallyNegate(children[0]);
			return true;
		}
	};
}

export function testLogicallyNegate(logger) {
	const cases = [
		{'code': 'true', 'to': 'false'},
		{'code': 'false', 'to': 'true'},
		{'code': 'x > 3', 'to': 'x <= 3'},
		{'code': 'x == y', 'to': 'x != y'},
		{'code': 'x != y', 'to': 'x == y'},
		{'code': 'x < 3', 'to': 'x >= 3'},
		{'code': 'x <= 3', 'to': 'x > 3'},
		{'code': 'x >= 3', 'to': 'x < 3'},
		{'code': 'x', 'to': '! x'},
	];
	processSimplifierCases(cases, wrappedLogicallyNegate(logger), logger);
};