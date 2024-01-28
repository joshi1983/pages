import { Colour } from './Colour.js';
import { Code } from './components/code-editor/Code.js';
import { CodeEditor } from './components/CodeEditor.js';
import { CommandBoxMessages } from './components/CommandBoxMessages.js';
import { CommandBoxParseLogger } from './parsing/loggers/CommandBoxParseLogger.js';
import { compile } from './parsing/compile.js';
import { DialogGroups } from './components/dialog/DialogGroups.js';
import { exceptionToString } from './exceptionToString.js';
import { GraphicsScreen } from './components/GraphicsScreen.js';
import { initializeSetMenu } from './set/initializeSetMenu.js';
import { LogoProgramExecuter } from './parsing/execution/LogoProgramExecuter.js';
import { ParseTreeToken } from './parsing/ParseTreeToken.js';
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

const Settings = new PrivateSettings();

setTimeout(function() {
	console.log('Settings.js loading dependencies which should lead to fileMenu.js loading');
	CodeEditor.loadDependencies();
	console.log('CodeEditor loadDependencies() should be complete');
	DialogGroups.loadDependencies();
	console.log('DialogGroups loadDependencies() should be complete');
	import('./zoom/initializeZoomMenu.js');
	console.log('initializeZoomMenu should be complete');
	import('./components/commander-buttons/ClearTextButton.js');
	console.log('ClearTextButton should be complete');
	import('./components/commander-buttons/CommanderPauseButton.js');
	console.log('CommanderPauseButton should be complete');
	import('./components/commandInput.js');
	console.log('commandInput.js should be complete');
	import('./file/fileMenu.js');
	import('./drawing-menu/download/DrawingDownload.js');
	import('./drawing-menu/ShapeExplorer.js');
	import('./debugging/commanderVisibilityMenuItem.js');
	import('./debugging/Debugger.js');
	import('./debugging/executionSpeedMenuItem.js');
	import('./components/LayoutManager.js');
	import('./help/Help.js');
	import('./components/popStateListener.js');
	import('./components/code-editor/refreshAnimationSetupFromTree.js');
}, 0);


export { Settings };