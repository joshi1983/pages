import { isNumber } from '../../../isNumber.js';

function isOfInterest(cachedParseTree) {
	const tokenValues = cachedParseTree.getTokenValues();
	return function(call) {
		if (call.children.length !== 2)
			return false;
		const arcsInfo = tokenValues.get(call.children[0]);
		return arcsInfo instanceof Array;
	};
}

export function validateArcsLeftRightUsage(cachedParseTree, parseLogger) {
	let callsOfInterest = cachedParseTree.getCommandCallsByNames(['arcsLeft', 'arcsRight']).
		filter(isOfInterest(cachedParseTree));

	const tokenValues = cachedParseTree.getTokenValues();
	callsOfInterest.forEach(function(call) {
		const arcsInfo = tokenValues.get(call.children[0]);
		if (arcsInfo.length === 0)
			parseLogger.warn(`You specified an empty list as arcsInfo.  This won't do anything.  Consider removing this call to <span class=\"command\">${call.val}</span>.  It will be less code and less confusion for people reading it.`, call, true);
		else {
			let msg;
			for (let index = 0; index < arcsInfo.length; index++) {
				const arcInfo = arcsInfo[index];
				if (!(arcInfo instanceof Array))
					msg = `Every element of arcsInfo must be a list but found something else at item index ${index + 1}`;
				else if (arcInfo.length !== 2)
					msg = `Every element of arcsInfo must be a list with length 2 but found an arcInfo with length ${arcInfo.length} at item index ${index + 1}`;
				else if (isNumber(arcInfo[1]) && arcInfo[1] < 0)
					msg = `Every arc radius in arcsInfo must not be less than 0 but found ${arcInfo[1]} at item index ${index + 1}`;
				if (msg !== undefined)
					break; // no need to keep looping.
			}
			if (msg !== undefined)
				parseLogger.error(msg, call);
		}
	});
};