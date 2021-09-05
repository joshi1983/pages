import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateContains(logger) {
	const cases = [
	{
	'in': `circle step(1,2), 100`,
'outContains': ['qbCircle', 'qbStep']
	},
	{'in': 'print point 0',
	'outContains': ['print', 'qbPointGetCoordinate', '0']},
	{'in': 'print val "123"',
	'outContains': ['print', 'qbVal', '123']},
	{'in': 'print val "&h123"',
	'outContains': ['print', 'qbVal', '123']},
	{'in': 'LINE (160,10)-(100,50),13',
	'outContains': ['Line', '160', '100', '50']},
	{'in': `TYPE T
	x as integer
END TYPE

dim varName as T`, 'outContains': ['"x 0', 'make "varName createT', 'to createT']},
		{'in': `TYPE Ant
	x as integer
end TYPE

NumAnts = 30

DIM Ants(1 TO NumAnts) AS Ant`, 'outContains': [
'to createAnt',
'to initializeList',
'make "NumAnts 30',
'make "Ants initializeList :NumAnts "createAnt']
}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.in}`, logger);
		const translated = translate(caseInfo.in);
		for (const s of caseInfo.outContains) {
			if (translated.indexOf(s) === -1) {
				plogger(`Expected to find ${s} in translate return value but did not.  translate returned: ${translated}`);
			}
		}
	});
};