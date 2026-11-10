import { allImported, setLoadingStatusTitle } from './components/loading-dialog/SettingsLoadStatus.js';
setLoadingStatusTitle('Settings starting to load');

import { Code } from './components/code-editor/Code.js';
import { CodeEditor } from './components/code-editor/CodeEditor.js';
import { CommandBoxMessages } from './components/CommandBoxMessages.js';
import { CommandBoxParseLogger } from './parsing/loggers/CommandBoxParseLogger.js';
import { compile,
	asyncInit as compileAsyncInit } from './parsing/compile.js';
import { DialogGroups } from './components/dialog/DialogGroups.js';
import { exceptionToString } from './exceptionToString.js';
import { GraphicsScreen } from './components/GraphicsScreen.js';
import { initializeSetMenu } from './set/initializeSetMenu.js';
import { LogoProgramExecuter } from './parsing/execution/LogoProgramExecuter.js';
import { ParseTreeToken } from './parsing/ParseTreeToken.js';
import { ready } from './ready.js';
import { ToastMessages } from './components/ToastMessages.js';
import { tryToRunCodeWithoutMessages } from './tryToRunCodeWithoutMessages.js';
import { Turtle } from './command-groups/Turtle.js';

class PrivateSettings {
	constructor() {
		this.animationTime = 0;
		this.animationDurationSeconds = 10;
		this.drawing = GraphicsScreen.getDrawing();
		this.turtle = new Turtle(this, this.drawing);
		const emptyTree = ParseTreeToken.createRootToken();
		const compiledProgram = compile('', emptyTree, CommandBoxParseLogger, new Map(), {'translateToJavaScript': false}, new Map());
		this.executer = new LogoProgramExecuter(this.turtle, compiledProgram);
		this.executer.startContinuousExecution();
		Code.setExecuter(this.executer);
		initializeSetMenu(this);
		GraphicsScreen.setTurtleDrawState(this.turtle.drawState);
		let redrawNeeded = false;
		this.turtle.addEventListener('addForegroundShape', function(e) {
			GraphicsScreen.drawer.drawShapes([e.details.shape.transformBy(GraphicsScreen.camera)]);
			GraphicsScreen.refreshTurtle();
		});
		this.turtle.addEventListener('clearScreen,setScreenColor', function(e) {
			redrawNeeded = true;
		});
		this.executer.addEventListener('exception', function(e) {
			console.error(e);
			CommandBoxMessages.error('An exception was thrown.  ' + exceptionToString(e), false);
			redrawNeeded = true;
		});
		this.executer.addEventListener('execution-stopped', function() {
			redrawNeeded = true;
		});
		GraphicsScreen.camera.addEventListener('change', function() {
			redrawNeeded = true;
		});
		tryToRunCodeWithoutMessages();
		setInterval(function() {
			if (redrawNeeded) {
				redrawNeeded = false;
				GraphicsScreen.redraw();
			}
		}, 30);
	}

	print(msg) {
		CommandBoxMessages.print(msg);
	}

	redrawNeeded() {
		GraphicsScreen.redraw();
	}

	warn(msg) {
		ToastMessages.warn(msg, false);
	}

	error(msg) {
		ToastMessages.error(msg, false);
	}
}

await compileAsyncInit();
const Settings = new PrivateSettings();

ready(function() {
	setLoadingStatusTitle('started importing settings modules');
	CodeEditor.loadDependencies();
	setLoadingStatusTitle('loaded code editor');
	DialogGroups.loadDependencies();
	setLoadingStatusTitle('loaded dialog groups');
	const modulesURLs = [
		'./zoom/initializeZoomMenu.js',
		'./components/commander-buttons/ClearTextButton.js',
		'./components/commander-buttons/CommanderPauseButton.js',
		'./components/commandInput.js',
		'./file/fileMenu.js',
		'./drawing-menu/download/DrawingDownload.js',
		'./drawing-menu/ShapeExplorer.js',
		'./debugging/commanderVisibilityMenuItem.js',
		'./debugging/Debugger.js',
		'./debugging/executionSpeedMenuItem.js',
		'./components/LayoutManager.js',
		'./help/Help.js',
		'./components/popStateListener.js',
		'./components/code-editor/refreshAnimationSetupFromTree.js'
	];
	for (const moduleURL of modulesURLs) {
		import(moduleURL);
		setLoadingStatusTitle(`loaded ${moduleURL}`);
	}
	setLoadingStatusTitle('all settings modules imported');
	allImported();
});

export { Settings };
