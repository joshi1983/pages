import { assertEquals } from
'../../../../helpers/assertEquals.js';
import { getPropertyValues } from
'../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/getPropertyValues.js';
import { parse } from
'../../../../../modules/parsing/l-systems/0L/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testGetPropertyValues(logger) {
	const cases = [
		{'in': 'angle = 12', 'out': [['angle', 12]]},
		{'in': 'angle = 22.5','out': [['angle', 22.5]]},
		{'in': 'ø = 22.5', 'out': [['angle', 22.5]]},
		{'in': 'ø = 90', 'out': [['angle', 90]]},
		{'in': 'length factor = 1.36', 'out': [['lengthScaleFactor', 1.36]]},
		{'in': 'angle increment = 1', 'out': [['angleIncrement', 1]]},
		{'in': 'width step = 1', 'out': [['widthStep', 1]]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in: ${caseInfo.in}`, logger);
		const parseResult = parse(caseInfo.in);
		const result = getPropertyValues(parseResult.root);
		if (!(result instanceof Map))
			plogger(`Expected result to be a Map but found ${result}`);
		else if (result.size !== caseInfo.out.length)
			plogger(`Expected ${caseInfo.out.length} key-value pairs but found ${result.size}`);
		else {
			for (const [name, value] of caseInfo.out) {
				const actualValue = result.get(name);
				assertEquals(value, actualValue, prefixWrapper(`Comparing key ${name}`, plogger));
			}
		}
	});
};