import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';

function translateRemoveProc(asmTurtleCode) {
	const resultWithProc = translate(asmTurtleCode);
	let index = resultWithProc.toLowerCase().lastIndexOf('setpencolor');
	return resultWithProc.substring(index).trim();
}

export function testTranslateSetColor(logger) {
	const cases = [
	{
		'in': 'setcolor',
		'out': 'setPenColor asmTurtleColor :register'
	},
	{
		'in': 'load 255\nsetcolor',
		'out': 'setPenColor "#FF0000'
	},
	{
		'in': `proc @@Cross:
load 255
SetColor
ret`, 'out': `setPenColor "#FF0000
end`
	}
	];
	testInOutPairs(cases, translateRemoveProc, logger);
};