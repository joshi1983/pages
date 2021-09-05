import { executeLogoProcedure } from '../../../parsing/execution/executeLogoProcedure.js';
import { isNumber } from '../../../isNumber.js';
import { SnapshotStyle } from './SnapshotStyle.js';
import { Vector2DDrawing } from '../Vector2DDrawing.js';

export function getSnapshotStyleFromProgram(logoProgram, animationTime, animationDurationSeconds, drawing) {
	if (!isNumber(animationTime))
		throw new Error('animationTime must be a number but got: ' + animationTime);
	if (!isNumber(animationDurationSeconds))
		throw new Error('animationDurationSeconds must be a number but got: ' + animationDurationSeconds);
	if (!(drawing instanceof Vector2DDrawing))
		throw new Error(`A drawing must be specified and it must be a Vector2DDrawing.  Instead, drawing specified as ${drawing}`);

	return new Promise(function(resolve, reject) {
		if (!logoProgram.procedures.has('animation.snapshotstyle'))
			resolve(new SnapshotStyle(new Map()));
		else {
			executeLogoProcedure(logoProgram, 'animation.snapshotstyle', 1000, {
				'animationTime': animationTime,
				'animationDurationSeconds': animationDurationSeconds,
				'drawing': drawing
			}).then(function(properties) {
				if (properties instanceof Map)
					resolve(new SnapshotStyle(properties));
				else
					resolve(new SnapshotStyle(new Map()));
			}).catch(function(e) {
				reject(e);
			});
		}
	});
};