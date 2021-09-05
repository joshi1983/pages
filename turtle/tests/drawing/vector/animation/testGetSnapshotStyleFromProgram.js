import { createTestDrawing } from
'../../../helpers/createTestDrawing.js';
import { getSnapshotStyleFromProgram } from
'../../../../modules/drawing/vector/animation/getSnapshotStyleFromProgram.js';
import { testCodeToProgram } from
'../../../helpers/testCodeToProgram.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testDefault(logger) {
	const program = testCodeToProgram('', logger);
	const drawing = createTestDrawing();
	getSnapshotStyleFromProgram(program, 0, 10, drawing).then(function(snapshotStyle) {
		if (snapshotStyle.position.getX() !== 0)
			logger('position x expected to be 0 but got ' + snapshotStyle.position.getX());
	}).catch(function(e) {
		logger('Failed to get snapshot.  e=' + e);
	});
}

function testExplicitProperties(logger) {
	const code = `
to animation.snapshotStyle
	localmake "result createPList
	setProperty "result "position.x 1
	setProperty "result "position.y 2
	setProperty "result "position.z 3
	setProperty "result "zoom.scale 4
	output :result
end`;
	const program = testCodeToProgram(code, logger);
	const drawing = createTestDrawing();
	getSnapshotStyleFromProgram(program, 0, 10, drawing).then(function(snapshotStyle) {
		if (snapshotStyle.position.getX() !== 1)
			logger('position x expected to be 1 but got ' + snapshotStyle.position.getX());
		if (snapshotStyle.position.getY() !== 2)
			logger('position y expected to be 2 but got ' + snapshotStyle.position.getY());
		if (snapshotStyle.position.getZ() !== 3)
			logger('position z expected to be 3 but got ' + snapshotStyle.position.getZ());
		if (snapshotStyle.zoomScale !== 4)
			logger('zoom scale expected to be 4 but got ' + snapshotStyle.zoomScale);
	}).catch(function(e) {
		logger('Failed to get snapshot.  e=' + e);
	});
}

function testExplicitProperties2(logger) {
	const code = `
to animation.snapshotStyle
	localmake "result createPList
	setProperty2 :result "position.x 1
	setProperty2 :result "position.y 2
	setProperty2 :result "position.z 3
	setProperty2 :result "zoom.scale 4
	output :result
end`;
	const program = testCodeToProgram(code, logger);
	const drawing = createTestDrawing();
	getSnapshotStyleFromProgram(program, 0, 10, drawing).then(function(snapshotStyle) {
		if (snapshotStyle.position.getX() !== 1)
			logger('position x expected to be 1 but got ' + snapshotStyle.position.getX());
		if (snapshotStyle.position.getY() !== 2)
			logger('position y expected to be 2 but got ' + snapshotStyle.position.getY());
		if (snapshotStyle.position.getZ() !== 3)
			logger('position z expected to be 3 but got ' + snapshotStyle.position.getZ());
		if (snapshotStyle.zoomScale !== 4)
			logger('zoom scale expected to be 4 but got ' + snapshotStyle.zoomScale);
	}).catch(function(e) {
		logger('Failed to get snapshot.  e=' + e);
	});
}

function testWithAnimationTime(logger) {
	const code = `
to animation.snapshotStyle
	localmake "result createPList
	setProperty "result "position.x animation.time
	setProperty "result "position.y 2 * animation.time
	setProperty "result "position.z 3 * animation.time
	setProperty "result "zoom.scale 4 * animation.time
	output :result
end`;
	const program = testCodeToProgram(code, logger);
	const drawing = createTestDrawing();
	getSnapshotStyleFromProgram(program, 1, 10, drawing).then(function(snapshotStyle) {
		if (snapshotStyle.position.getX() !== 1)
			logger('position x expected to be 1 but got ' + snapshotStyle.position.getX());
		if (snapshotStyle.position.getY() !== 2)
			logger('position y expected to be 2 but got ' + snapshotStyle.position.getY());
		if (snapshotStyle.position.getZ() !== 3)
			logger('position z expected to be 3 but got ' + snapshotStyle.position.getZ());
		if (snapshotStyle.zoomScale !== 4)
			logger('zoom scale expected to be 4 but got ' + snapshotStyle.zoomScale);
	}).catch(function(e) {
		logger('Failed to get snapshot.  e=' + e);
	});
}

export function testGetSnapshotStyleFromProgram(logger) {
	wrapAndCall([
		testDefault,
		testExplicitProperties,
		testExplicitProperties2,
		testWithAnimationTime
	], logger);
};