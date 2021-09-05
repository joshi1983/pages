import { Colour } from
'../../../../../modules/Colour.js';
import { ColouredLineSegment } from
'../../../../../modules/drawing-menu/download/line-segments/ColouredLineSegment.js';
import { csv } from
'../../../../../modules/drawing-menu/download/line-segments/exporters/csv.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testCsv(logger) {
	const cases = [
	{'inArgs': [[], {'includeColour': true}],
		'out': 'x1,y1,z1,x2,y2,z2,red,green,blue'},
	{'inArgs': [[], {'includeColour': false}],
		'out': 'x1,y1,z1,x2,y2,z2'},
	{
		'inArgs': [
		[new ColouredLineSegment(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0), new Colour(0, 0, 0))],
		{'includeColour': false}],
		'out': 'x1,y1,z1,x2,y2,z2\n0,0,0,100,0,0'
	},
	{
		'inArgs': [
		[new ColouredLineSegment(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0), new Colour(0, 0, 0))],
		{'includeColour': true}],
		'out': 'x1,y1,z1,x2,y2,z2,red,green,blue\n0,0,0,100,0,0,0,0,0'
	}
	];
	testInOutPairs(cases, csv, logger);
};