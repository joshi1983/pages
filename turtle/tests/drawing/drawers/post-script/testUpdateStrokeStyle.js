import { Camera } from '../../../../modules/drawing/vector/Camera.js';
import { PageSize } from '../../../../modules/drawing/drawers/post-script/PageSize.js';
import { PostScriptDrawer } from '../../../../modules/drawing/drawers/PostScriptDrawer.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Turtle } from '../../../../modules/command-groups/Turtle.js';
import { updateStrokeStyle } from '../../../../modules/drawing/drawers/post-script/updateStrokeStyle.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';
import { Vector2DDrawing } from '../../../../modules/drawing/vector/Vector2DDrawing.js';

function createTestDrawingForLineJoin(lineJoinName) {
	const settings = {'animationTime': 0};
	const drawing = new Vector2DDrawing();
	const turtle = new Turtle(settings, drawing);
	turtle.setLineJoinStyle(lineJoinName);
	for (let i = 0; i < 3; i++) {
		turtle.forward(100);
		turtle.right(360/3);
	}
	turtle.closePath();
	return drawing;
}

function getLineContainingIndex(s, index) {
	const startIndex = s.lastIndexOf('\n', index);
	const endIndex = s.indexOf('\n', index);
	if (startIndex === -1 && endIndex === -1)
		return s;
	else if (startIndex === -1)
		return s.substring(0, endIndex);
	else if (endIndex === -1)
		return s.substring(startIndex);
	else
		return s.substring(startIndex, endIndex);
}

function removeComments(s) {
	const lines = s.split('\n').filter(line => !line.trim().startsWith('%'));
	return lines.join('\n');
}

function testLineJoinStyle(logger) {
	const cases = [
		{'name': 'miter', 'num': 0, 'isExpected': false},
		{'name': 'round', 'num': 1},
		{'name': 'bevel', 'num': 2}
	];
	const pageSize = PageSize.getPageSizeClosestToDimensions(100, 100);
	cases.forEach(function(caseInfo, index) {
		const drawing = createTestDrawingForLineJoin(caseInfo.name);
		const drawer = new PostScriptDrawer(1, new Vector2D(100, 100), pageSize);
		const camera = new Camera();
		drawing.drawAsSingleLayer(drawer, camera);
		let postScriptCode = drawer.toString();
		if (typeof postScriptCode === 'string')
			postScriptCode = removeComments(postScriptCode);
		const plogger = prefixWrapper(`Case ${index} - ${caseInfo.name}`, logger);
		if (typeof postScriptCode !== 'string')
			plogger('Expected a string but got: ' + postScriptCode);
		else if (postScriptCode.indexOf('setlinejoin') === -1) {
			if (caseInfo.isExpected !== false)
				plogger('Expected to find setlinejoin but did not. postScriptCod = ' + postScriptCode);
		}
		else {
			if (caseInfo.isExpected === false)
				plogger('Unexpected setlinejoin because it is default but it was found');
			const index = postScriptCode.indexOf('setlinejoin');
			const line = getLineContainingIndex(postScriptCode, index);
			const parts = line.trim().split(' ');
			if (parts.length !== 2)
				plogger('Expected 2 parts but got ' + parts.length);
			else {
				const val = parseFloat(parts[0].trim());
				if (isNaN(val))
					plogger('Expected line to start with a number but it started with ' + parts[0] + '.  The full line is: ' + line);
				else if (val !== caseInfo.num) {
					plogger(`Expected ${caseInfo.num} for setlinejoin but got ${val} from line: ${line}`);
				}
			}
		}
	});
}

export function testUpdateStrokeStyle(logger) {
	testLineJoinStyle(prefixWrapper('testLineJoinStyle', logger));
};