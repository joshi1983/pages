import { Code } from './code-editor/Code.js';
import { ColorSelectorDialog } from './ColorSelectorDialog.js';
import { CommandDetails } from '../help/CommandDetails.js';
import { convertToAsset } from './syntax-highlighter/context-menu/convertToAsset.js';
import { Dialog } from './Dialog.js';
import { EditorLocalStorage } from './code-editor/EditorLocalStorage.js';
import { EventDispatcher } from '../EventDispatcher.js';
import { fetchText } from '../fetchText.js';
import { GraphicsScreen } from './GraphicsScreen.js';
import { LogoTextarea } from './code-editor/LogoTextarea.js';
import { showGeneralHelpContent } from '../help/showGeneralHelpContent.js';
import { showMenuDialog } from './dialog/showMenuDialog.js';
import { ToastMessages } from './ToastMessages.js';

const codeEditorHTML = await fetchText('content/components/code-editor.html');

function removeHalfWidth() {
	document.body.classList.remove('half-width');
	GraphicsScreen.updateCanvasDimensions();
}

class PrivateCodeEditor extends EventDispatcher {
	constructor() {
		super(['layout']);
		let div = document.createElement('div');
		div.innerHTML = codeEditorHTML;
		this.isMaximized = true;
		this.isVisible = false;
		const childDiv = div.querySelector(':scope > div');
		if (childDiv)
			div = childDiv;
		document.body.appendChild(div);
		this.editor = div;

		this.initializeWindowResizing();
	}

	loadDependencies() {
		if (this._loadDependenciesPromise === undefined) {
			const outer = this;
			this._loadDependenciesPromise = new Promise(function(resolve, reject) {
				/*
				This is not done in the constructor in an effort to prevent an extremely rare
				"Settings accessed before initialization" JavaScript error from ExecutionPointUpdater.js.
				This was so rare that in months of testing frequently every day, it showed only once or twice.
				
				Since loadDependencies() is called only from Settings.js and after its constructor completes, 
				hopefully the problem is fixed.
				*/
				import('./code-editor/autoFixCodeMenuItem.js');
				import('./code-editor/EditCopy.js');
				import('./code-editor/EditPaste.js');
				import('./code-editor/formatCodeMenuItem.js');
				import('./code-editor/harmonizeCaseMenuItem.js');
				import('./code-editor/logo-textarea/parseMessageUpdater.js');
				import('./code-editor/runTest.js');
				import('./code-editor/resetAndTest.js');
				import('./code-editor/setupAnimationMenuItem.js');
				import('./code-editor/showAutofixPrompt.js');
				import('./CommandBoxMessages.js').then(function(result) {
					const CommandBoxMessages = result.CommandBoxMessages;
					import('./code-editor/logo-textarea/ExecutionPointUpdater.js').then(function(result) {
						const ExecutionPointUpdater = result.ExecutionPointUpdater;
						outer.textElement = new LogoTextarea({
							'CodeEditor': CodeEditor,
							'CommandDetails': CommandDetails,
							'ColorSelectorDialog': ColorSelectorDialog,
							'CommandBoxMessages': CommandBoxMessages,
							'convertToAsset': convertToAsset,
							'Dialog': Dialog,
							'showMenuDialog': showMenuDialog,
							'ToastMessages': ToastMessages
						});
						outer.textElement.addEventListener('change', function() {
							Code.setSourceCode(outer.textElement.getValue());
						});
						document.getElementById('editor-code').appendChild(outer.textElement.getRootElement());
						ExecutionPointUpdater.setLineNumbers(outer.textElement.lineNumbers);
						resolve();
					});
				});
			});
		}
		return this._loadDependenciesPromise;
	}

	_setVisible(newVisibility) {
		if (newVisibility !== this.isVisible) {
			this.isVisible = newVisibility;
			if (this.isVisible) {
				EditorLocalStorage.editorOpened();
			}
			super._dispatchEvent('layout', {});
		}
	}

	getSourceCode() {
		return Code.getSourceCode();
	}

	getWindowStateHeight() {
		const titleBarElement = this.editor.querySelector('.title-bar');
		return titleBarElement.offsetHeight;
	}

	hide() {
		this._setVisible(false);
		this.editor.style.display = 'none';
		removeHalfWidth();
	}

	initializeWindowResizing() {
		const helpElement = this.editor.querySelector('[data-helpid="code-editor"]');
		this.maximizeElement = this.editor.querySelector('#code-editor-maximize');
		this.restoreElement = this.editor.querySelector('#code-editor-restore');
		this.closeElement = this.editor.querySelector('#code-editor-close');
		const outer = this;
		helpElement.addEventListener('click', function() {
			showGeneralHelpContent('code-editor');
		});
		this.maximizeElement.addEventListener('click', function() {
			outer.maximize();
		});
		this.restoreElement.addEventListener('click', function() {
			outer.restore();
		});
		this.closeElement.addEventListener('click', function() {
			outer.hide();
		});
	}

	restore() {
		this._setVisible(true);
		this.isMaximized = false;
		this.editor.classList.add('restored');
		document.body.classList.add('half-width');
		this.maximizeElement.style.display = 'inline-block';
		this.restoreElement.style.display = 'none';
		GraphicsScreen.updateCanvasDimensions();
		super._dispatchEvent('layout', {});
	}

	maximize() {
		this._setVisible(true);
		this.isMaximized = true;
		this.editor.classList.remove('restored');
		this.restoreElement.style.display = 'inline-block';
		this.maximizeElement.style.display = 'none';
		removeHalfWidth();
		super._dispatchEvent('layout', {});
	}

	removeAllBreakpoints(reason) {
		if (typeof reason !== 'string')
			throw new Error('reason must be a string but got: ' + reason);
		if (this.textElement.lineNumbers.hasAnyBreakpoints()) {
			this.textElement.lineNumbers.setBreakpointLines(new Set());
			ToastMessages.warn('Removed breakpoints because ' + reason, false);
		}
	}

	async setParseMessages(messages) {
		await this.loadDependencies();
		this.textElement.setParseMessages(messages);
	}

	async setSourceCode(s) {
		await this.loadDependencies();
		Code.setSourceCode(s);
		this.textElement.setValue(s);
	}

	async show() {
		await this.loadDependencies();
		this.textElement.setValue(Code.getSourceCode());
		this.editor.style.display = 'flex';
		if (this.isMaximized)
			this.maximize();
		else
			this.restore();
	}

	async useNormalTextSize() {
		await this.loadDependencies();
		this.textElement.useNormalTextSize();
	}

	async useSmallText() {
		await this.loadDependencies();
		this.textElement.useSmallText();
	}
}

const CodeEditor = new PrivateCodeEditor();
export { CodeEditor };