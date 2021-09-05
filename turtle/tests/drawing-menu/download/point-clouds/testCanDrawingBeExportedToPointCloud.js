import { createTestDrawing } from
'../../../helpers/createTestDrawing.js';
import { createTestDrawing2 } from
'../../../helpers/createTestDrawing2.js';
import { createTestDrawingWithCustomEasing } from
'../../../helpers/createTestDrawingWithCustomEasing.js';
import { createTestDrawingWith3DPointCloud } from
'../../../helpers/createTestDrawingWith3DPointCloud.js';
import { canDrawingBeExportedToPointCloud } from
'../../../../modules/drawing-menu/download/point-clouds/canDrawingBeExportedToPointCloud.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testCanDrawingBeExportedToPointCloud(logger) {
	const cases = [
		{'in': createTestDrawing(), 'out': false},
		{'in': createTestDrawing2(), 'out': false},
		{'in': createTestDrawingWithCustomEasing(), 'out': false},
		{'in': createTestDrawingWith3DPointCloud(), 'out': true}
	];
	testInOutPairs(cases, canDrawingBeExportedToPointCloud, logger);
};