import { ClickableName } from '../../../../modules/components/code-editor/code-completion/ClickableName.js';

export function testClickableName(logger) {
	for (let index = 0; index < 6; index++) {
		const clickableName = new ClickableName('Hello', function() {}, index);
		const div = clickableName.getDiv();
		clickableName.dispose();
	}
};