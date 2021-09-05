import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/sonic-webturtle/translation-to-weblogo/translate.js';

function wrappedTranslate(code) {
	const result = translate(code);
	const index = result.lastIndexOf('\nend\n');
	if (index === -1)
		return result;
	else
		return result.substring(index + 4).trim();
}

export function testTranslateWithProcedures(logger) {
	const cases = [
	{'in': 'transparent 50', 'out': 'webTurtleTransparent 50'},
	{'in': 'transparent +3', 'out': 'webTurtleTransparentIncrease 3'},
	{'in': 'PRINT Hello', 'out': 'webTurtlePrint "Hello'},
	{'in': 'turtlePRINT Hello', 'out': 'webTurtleTurtlePrint "Hello'},
	{'in': 'point 30', 'out': 'webTurtlePoint 30'},
	{'in': 'color +1', 'out': 'webTurtleOffsetColor 1'},
	{'in': 'color -1', 'out': 'webTurtleOffsetColor -1'},
	{'in': 'color red', 'out': 'setPenColor "red'},
	{'in': 'color x', 'out': 'webTurtleColor :x'},
	{'in': 'remember', 'out': 'make "rememberStack [ ]\nwebTurtleRemember'},
	{'in': 'goback', 'out': 'make "rememberStack [ ]\nwebTurtleGoback'},
	{'in': 'forget', 'out': 'make "rememberStack [ ]\nwebTurtleForget'}
	];
	testInOutPairs(cases, wrappedTranslate, logger);
};