import { DialogStates } from '../../../modules/components/dialog/DialogStates.js';

export function testDialogStates(logger) {
	DialogStates.validate(DialogStates.RESTORED);
	DialogStates.validate(DialogStates.MAXIMIZED);
	try {
		DialogStates.validate(-1);
		logger('-1 should be invalid');
	}
	catch (e) {
		
	}
};