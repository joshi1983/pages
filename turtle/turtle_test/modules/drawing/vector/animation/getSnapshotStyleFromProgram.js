import { executeLogoProcedure } from '../../../parsing/execution/executeLogoProcedure.js';
import { isNumber } from '../../../isNumber.js';
import { SnapshotStyle } from './SnapshotStyle.js';

export function getSnapshotStyleFromProgram(logoProgram, animationTime, animationDurationSeconds) {
	if (!isNumber(animationTime))
		throw new Error('animationTime must be a number but got: ' + animationTime);
	if (!isNumber(animationDurationSeconds))
		throw new Error('animationDurationSeconds must be a number but got: ' + animationDurationSeconds);

	return new Promise(function(resolve, reject) {
		if (!logoProgram.procedures.has('animation.snapshotstyle'))
			resolve(new SnapshotStyle(new Map()));
		else {
			executeLogoProcedure(logoProgram, 'animation.snapshotstyle', 1000, {
				'animationTime': animationTime,
				'animationDurationSeconds': animationDurationSeconds
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