import { Colour } from
'../../../../../modules/Colour.js';
import { ColouredLineSegment } from
'../../../../../modules/drawing-menu/download/line-segments/ColouredLineSegment.js';
import { obj } from
'../../../../../modules/drawing-menu/download/line-segments/exporters/obj.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testObj(logger) {
	const cases = [
	{'in': [], 'outContains': 'g'},
	{'in':
		[new ColouredLineSegment(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0), new Colour(0, 0, 0))],
		'outContains': 'l 1 2'
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = obj(caseInfo.in);
		if (result.indexOf(caseInfo.outContains) === -1) {
			plogger(`Expected to find ${caseInfo.outContains} but not found in ${result}`);
		}
	});
};