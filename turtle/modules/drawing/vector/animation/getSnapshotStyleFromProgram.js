import { executeLogoProcedure } from '../../../parsing/execution/executeLogoProcedure.js';
import { SnapshotStyle } from './SnapshotStyle.js';

export function getSnapshotStyleFromProgram(logoProgram, animationTime, animationDurationSeconds) {
	if (typeof animationTime !== 'number')
		throw new Error('animationTime must be a number but got: ' + animationTime);
	if (typeof animationDurationSeconds !== 'number')
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