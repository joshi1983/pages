import { canDrawingBeExportedToStringArtKit } from '../../../../modules/drawing-menu/download/string-art-kit/canDrawingBeExportedToStringArtKit.js';
import { createTestDrawing } from '../../../helpers/createTestDrawing.js';
import { createTestDrawingForStringArt } from './createTestDrawingForStringArt.js';

export function testCanDrawingBeExportedToStringArtKit(logger) {
	const cases = [
		{'drawing': createTestDrawingForStringArt(), 'result': true},
		{'drawing': createTestDrawing(), 'result': false},
	];
	cases.forEach(function(caseInfo, index) {
		const result = canDrawingBeExportedToStringArtKit(caseInfo.drawing);
		if (result !== caseInfo.result)
			logger(`Case ${index}.  Expected result of ${caseInfo.result} but got ${result}`);
	});
};