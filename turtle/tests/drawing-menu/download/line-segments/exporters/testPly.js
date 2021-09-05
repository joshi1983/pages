import { Colour } from
'../../../../../modules/Colour.js';
import { ColouredLineSegment } from
'../../../../../modules/drawing-menu/download/line-segments/ColouredLineSegment.js';
import { ply } from
'../../../../../modules/drawing-menu/download/line-segments/exporters/ply.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';
const prefix1 = `ply
format ascii 1.0\n`;

export function testPly(logger) {
	const cases = [
	{'inArgs': [[], {'includeColour': true}], 'outContains': 'property uchar red'},
	{'inArgs': [[], {'includeColour': false}], 'outContains': ''},
	{
		'inArgs': [
		[new ColouredLineSegment(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0), new Colour(0, 0, 0))],
		{'includeColour': false}],
		'outContains': '0 0'
	},
	{
		'inArgs': [
		[new ColouredLineSegment(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0), new Colour(0, 0, 0))],
		{'includeColour': true}],
		'outContains': '0 1 0 0 0'
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = ply(...caseInfo.inArgs);
		if (!result.startsWith(prefix1))
			plogger(`Expected to find prefix but not found.  Expected prefix=${prefix1}, result=${result}`);
		if (result.indexOf(caseInfo.outContains) === -1) {
			plogger(`Expected to find ${caseInfo.outContains} but not found in ${result}`);
		}
	});
};