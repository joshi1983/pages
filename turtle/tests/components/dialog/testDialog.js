import { testAddFooterButton } from './testAddFooterButton.js';
import { testDialogGroupRepository } from './testDialogGroupRepository.js';
import { testDialogGroups } from './testDialogGroups.js';
import { testDialogStates } from './testDialogStates.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testDialog(logger) {
	wrapAndCall([
		testAddFooterButton,
		testDialogGroupRepository,
		testDialogGroups,
		testDialogStates
	], logger);
};