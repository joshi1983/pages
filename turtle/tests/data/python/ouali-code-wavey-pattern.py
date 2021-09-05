# copied from:
# https://www.youtube.com/shorts/aqZgZ8R_7pc
from turtle import *
import math
import colorsys

tracer(10)
bgcolor("black")
hideturtle()
width(3)

penup()
for i in range(500):
	hue = i / 500
	rgb = colorsys.hsv_to_rgb(hue, 1, 1)
	color(rgb)
	home()
	setheading(i)
	length= 100 + 60 * math.sin(math.radians(i * 8))
	forward(length)
	dot(8 + 2 * math.sin(math.radians(i * 5)))

done()