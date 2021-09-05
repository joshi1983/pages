import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testAddFooterButton } from './testAddFooterButton.js';
import { testDialogGroupRepository } from './testDialogGroupRepository.js';
import { testDialogGroups } from './testDialogGroups.js';
import { testDialogStates } from './testDialogStates.js';

export function testDialog(logger) {
	testAddFooterButton(prefixWrapper('testAddFooterButton', logger));
	testDialogGroupRepository(prefixWrapper('testDialogGroupRepository', logger));
	testDialogGroups(prefixWrapper('testDialogGroups', logger));
	testDialogStates(prefixWrapper('testDialogStates', logger));
};