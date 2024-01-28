import { Colour } from '../../Colour.js';
import { getBestOrientation } from './pdf/getBestOrientation.js';
import { getJSPDFOptions } from './pdf/getJSPDFOptions.js';
import { getJSPDFStyle } from './pdf/getJSPDFStyle.js';
import { getTextRenderMode } from './pdf/getTextRenderMode.js';
import { isNumber } from '../../isNumber.js';
import { lineCapStyleToJSPDFCap } from './pdf/lineCapStyleToJSPDFCap.js';
import { lineJoinStyleToJSPDFJoin } from './pdf/lineJoinStyleToJSPDFJoin.js';
import { MathCommands } from '../../command-groups/MathCommands.js';
import { pathToJSPDFLines } from './pdf/pathToJSPDFLines.js';
import { setFont } from './pdf/setFont.js';
import { Transparent } from '../../Transparent.js';
import { Vector2D } from '../vector/Vector2D.js';
import { Vector2DDrawer } from '../vector/Vector2DDrawer.js';
await Colour.asyncInit();

/*
Official documentation for jsPDF is at:
https://artskydj.github.io/jsPDF/docs/jsPDF.html

PDFDrawer has a lot of limitations that are not shared by SVGVector2DDrawer.
These limitations include:
- gradients are ignored.
- alphablended/semitransparent colours are ignored.  They're all assumed to be 100% opaque.
- rotation on shapes like ellipse and text is ignored.  This could be fixed later by setting the transformation matrix.
- circular and elliptical arcs are not implemented.  This could be fixed later by approximating and transforming them into polygonal paths.
- arcs in path shapes are also not implemented yet.
- can not draw images yet.
*/
const jsPDF = window.jspdf.jsPDF;

export class PDFDrawer extends Vector2DDrawer {
	/*
	Dimensions are assumed to be in inches.
	*/
	constructor(width, height) {
		super();
		this.setDimensions(width, height);
	}

	clear() {
		if (isNumber(this.width) && isNumber(this.height)) {
			const options = getJSPDFOptions(this);
			this.doc = new jsPDF(options);
			// Help others know the PDF was made with WebLogo.
			this.doc.setProperties({
				'keywords': 'WebLogo',
				'creator': 'WebLogo'
			});
			if (this.screenColor !== undefined && this.screenColor !== Transparent && isNumber(this.width) && isNumber(this.height)) {
				this.doc.setFillColor(this.screenColor.rgbArray[0], this.screenColor.rgbArray[1], this.screenColor.rgbArray[2]);
				this.doc.rect(0, 0, this.width, this.height, 'F');
			}
		}
	}

	clearScreen() {
		this.clear();
	}

	drawCircle(circle) {
		this.updateStrokeStyle(circle.style);
		this.updateFillStyle(circle.style);
		const p = this.transformPoint(circle.position);
		this.doc.circle(p.getX(), p.getY(), circle.radius, getJSPDFStyle(circle.style));
	}

	drawEllipse(ellipse) {
		this.updateStrokeStyle(ellipse.style);
		this.updateFillStyle(ellipse.style);
		const p = this.transformPoint(ellipse.position);
		this.doc.ellipse(p.getX(), p.getY(), ellipse.radius1, ellipse.radius2, getJSPDFStyle(ellipse.style));
	}

	drawLine(line) {
		this.updateStrokeStyle(line.style);
		const p1 = this.transformPoint(line.position);
		const p2 = this.transformPoint(line.endPoint);
		this.doc.line(p1.getX(), p1.getY(), p2.getX(), p2.getY());
	}

	drawPath(path) {
		this.updateStrokeStyle(path.style);
		this.updateFillStyle(path.style);
		const p = this.transformPoint(path.elements[0]);
		const lines = pathToJSPDFLines(this, path, p);
		this.doc.lines(lines, p.getX(), p.getY(), [1, 1], getJSPDFStyle(path.style), path.isClosed);
	}

	drawText(textShape) {
		this.updateFillStyle(textShape.style);
		this.updateStrokeStyle(textShape.style);
		const p = this.transformPoint(textShape.position);
		const options = {
			'align': 'left',
			'angle': 90 - textShape.rotationRadians / MathCommands.degToRadianScale,
			'renderingMode': getTextRenderMode(textShape)
		};
		setFont(this.doc, textShape.style);
		this.doc.text(textShape.text, p.getX(), p.getY(), options);
	}

	setDimensions(width, height) {
		if (!isNumber(width))
			throw new Error('width must be a number');
		if (!isNumber(height))
			throw new Error('height must be a number');

		this.width = width;
		this.height = height;
		if (this.doc === undefined)
			this.clear();
		else {
			const mediaBox = this.doc.getCurrentPageInfo().pageContext.mediaBox;
			mediaBox.topRightX = width * 72;
			mediaBox.topRightY = height * 72;
		}
	}

	setScreenColor(c) {
		if (c !== Transparent && !(c instanceof Colour))
			throw new Error('screen colour must be transparent or a Colour.  Not: ' + c);
		this.screenColor = c;
		this.clearScreen();
	}

	transformPoint(p) {
		return new Vector2D(p.getX() + this.width * 0.5, -p.getY() + this.height * 0.5);
	}

	updateFillStyle(style) {
		const c = style.getFillColor();
		if (c !== Transparent)
			this.doc.setFillColor(c.rgbArray[0], c.rgbArray[1], c.rgbArray[2]);
	}

	updateStrokeStyle(style) {
		const c = style.getPenColor();
		if (c === Transparent)
			this.doc.setLineWidth(0);
		else {
			this.doc.setDrawColor(c.rgbArray[0], c.rgbArray[1], c.rgbArray[2]);
			this.doc.setLineWidth(style.getPenWidth());
			this.doc.setLineCap(lineCapStyleToJSPDFCap(style.getLineCap()));
			this.doc.setLineJoin(lineJoinStyleToJSPDFJoin(style.getLineJoinStyle()));
		}
	}
};