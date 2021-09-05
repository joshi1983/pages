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
	'outContains': ['print', 'qbPointGetCoordinate', '0']}
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