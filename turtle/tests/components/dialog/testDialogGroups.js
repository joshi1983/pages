import { DialogGroups } from '../../../modules/components/dialog/DialogGroups.js';

export function testDialogGroups(logger) {
	DialogGroups.validateId(DialogGroups.HELP);
	try {
		DialogGroups.validateId(-1);
		logger('-1 should have triggered an error');
	}
	catch (e) {
		// nothing to do.  An error is expected.
	}
	const dimensions = DialogGroups.getInfoForGroup(DialogGroups.HELP);
	if (typeof dimensions !== 'object')
		logger('getInfoForGroup expected to return an object');
	else {
		if (dimensions.width !== 450)
			logger('width expected to be 450 but got ' + dimensions.width);
		if (dimensions.height !== 330)
			logger('height expected to be 330 but got ' + dimensions.height);
	}
};