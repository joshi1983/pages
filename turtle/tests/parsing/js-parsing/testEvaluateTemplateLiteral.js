import { evaluateTemplateLiteral } from '../../../modules/parsing/js-parsing/evaluateTemplateLiteral.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

function wrappedEvaluateTemplateLiteral(getValue) {
	return function(template) {
		return evaluateTemplateLiteral(template, getValue);
	};
}

export function testEvaluateTemplateLiteral(logger) {
	const cases = [
	{'in': '``', 'out': ''},
	{'in': '`hi`', 'out': 'hi'},
	{'in': '`hello world`', 'out': 'hello world'},
	{'in': '`he${x}world`', 'out': 'heSYMBOLworld'},
	{'in': '`he${x}world`', 'out': 'heSYMBOLworld'},
	{'in': '`he${x}world${x}`', 'out': 'heSYMBOLworldSYMBOL'},
	];
	testInOutPairs(cases, wrappedEvaluateTemplateLiteral(() => 'SYMBOL'), logger);
};