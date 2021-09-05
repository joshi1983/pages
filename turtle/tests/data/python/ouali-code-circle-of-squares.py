from turtle import *
import colorsys

bgcolor('black')
tracer(20)
hideturtle()
pensize(1)

for i in range(360):
	h = i / 360
	rgb = colorsys.hsv_to_rgb(h, 1, 1)
	pencolor(rgb)
	
	for _ in range(4):
		forward(180)
		left(90)
	right(1)
done()