import { conditionalGotoToBreak } from
'../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/simplifiers/conditionalGotoToBreak.js';
import { processSimplifierCases } from './processSimplifierCases.js';

export function testConditionalGotoToBreak(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'goto x\ny:\nx:\ngoto y', 'changed': false}, 
		{'code': 'y:\nx:\ngoto y', 'changed': false}, 
		{'code': 'y:\nif true {\ngoto y\n}', 'to': 'for {\ny:\nif false {\nbreak\n}\n}'}, 
	];
	processSimplifierCases(cases, conditionalGotoToBreak, logger);
};