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
},
	{'in': `TYPE TestType
    dataElement AS _BYTE
END TYPE

DIM a(4) AS TestType`,
	'outContains': ['to createTestType',
		'make "a initializeList 4 "createTestType']
	},
	{'in': 'LINE (0, 0)-(20, 20), col, BF',
	'outContains': ['qbFilledBox3 [ 0 0 ] [ 20 20 ] :col']},
	{'in': `do
	if x then
		stop
	end if
loop`,
	'outContains': ['forever', 'if', 'x', 'break']},
	{'in': `DRAW "TA=" + VARPTR$(angle)`,
	'outContains': ['qbDraw ', ' word ', 'TA=', ':angle'],
	'notContains': ['varptr', 'VARPTR']
	},
	{'in': 'screen 12\ndraw "C12 U10"',
	'outContains': ['make "screen 12', 'qbDraw']}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.in}`, logger);
		const translated = translate(caseInfo.in);
		for (const s of caseInfo.outContains) {
			if (translated.indexOf(s) === -1) {
				plogger(`Expected to find ${s} in translate return value but did not.  translate returned: ${translated}`);
			}
		}
		if (caseInfo.notContains instanceof Array) {
			for (const s of caseInfo.notContains) {
				if (translated.indexOf(s) !== -1) {
					plogger(`Expected to not find ${s} in translate return value but did.  translate returned: ${translated}`);
				}
			}
		}
	});
};