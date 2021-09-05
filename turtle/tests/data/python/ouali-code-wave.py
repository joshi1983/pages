# copied from:
# https://www.youtube.com/shorts/6U_PB2wZmaw
from turtle import *
import math
import colorsys as cs
bgcolor('black')
tracer(30)
hideturtle()
speed(0)
width(1.5)
h = 0.3
R = 220
r = 67

for layer in range(3):
	d = 90 + layer * 15
	penup()
	for i in range(6000):
		th = (i / 6000) * 20 * math.pi
		x = (R - r) * math.cos(th) + d * math.cos(
			((R - r)) * th
		)
		y = (R - r) * math.sin(th) - d * math.sin(
			((R - r)) * th
		)
		rgb = cs.hsv_to_rgb(h, 0.9, 1)
		color(rgb)
		if i == 0:
			goto(x,y)
			pendown()
		else:
			goto(x,y)
		h += 0.004
done()