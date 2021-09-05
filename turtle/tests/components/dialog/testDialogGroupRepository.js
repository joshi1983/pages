import { DialogGroupRepository } from '../../../modules/components/dialog/DialogGroupRepository.js';
import { DialogGroups } from '../../../modules/components/dialog/DialogGroups.js';
import { DialogStates } from '../../../modules/components/dialog/DialogStates.js';

export function testDialogGroupRepository(logger) {
	const dimensions = DialogGroupRepository.getRestoredDimensions(DialogGroups.HELP);
	if (typeof dimensions !== 'object')
		logger('dimensions expected to be an object but is not.  dimensions = ' + dimensions);
	DialogStates.validate(DialogGroupRepository.getState(DialogGroups.HELP));
	const state = DialogGroupRepository.getState(DialogGroups.HELP);
	DialogGroupRepository.setState(DialogGroups.HELP, state);
};