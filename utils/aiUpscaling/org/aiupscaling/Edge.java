package org.aiupscaling;

public abstract class Edge {
	protected double x, y, thickness;

	public Edge(double x, double y, double thickness) {
		this.x = x;
		this.y = y;
		this.thickness = thickness;
	}

	public abstract double getValue(byte[] pixels, int width, ValueGetter getter);
}