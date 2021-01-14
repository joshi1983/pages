package org.aiupscaling;

public class StraightEdge extends Edge {
	private double angle;
	private double a, b, c;
	private double dx, dy; // vector components corresponding with the angle

	public StraightEdge(double x, double y, double thickness, double angle) {
		super(x, y, thickness);
		this.angle = angle;
		dx = Math.cos(angle);
		dy = Math.sin(angle);
		// how does this line fit in a*x + b * y + c = 0?
		b = -1;
		c = y - x * dy / dx; // c = y when x = 0.
		a = dy/dx; // a is the slope of the line.
	}

	public double getDistanceFrom(double x, double y) {
		return 0;
	}

	public double getValue(byte[] pixels, int width, ValueGetter getter) {
		int height = pixels.length / width / 3;
		double defaultR = 3;
		if (Math.abs(dx) > Math.abs(dy)) {
			double y1 = dy * defaultR + y;
			double y2 = y - dy * defaultR;
			int maxY = (int)(Math.max(0, Math.min(height - 1, Math.max(y1, y2))));
			int minY = (int)(Math.max(0, Math.min(height - 1, Math.min(y1, y2))));
			double result = 0;
			for (int py = minY; py <= maxY; py++) {
				int minX = py; // FIXME: correct the calculation.
				int maxX = minX + 2;
				for (int px = minX; px <= maxX; px++) {
					double distance = getDistanceFrom(px, py);
					// FIXME: do the math with the distance.
				}
			}
		}
		
		/*
		double minR = ;
		double maxR = ;
		*/
		return 0;
	}
}