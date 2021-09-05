from turtle import *
import colorsys
import math

bgcolor("black")
speed(0)
hideturtle()
pensize(2)
radius = 150

for i in range(80):
	angle = (i / 80) * 2 * math.pi
	x = radius * math.cos(angle)
	y = radius * math.sin(angle)
	h = i / 80
	rgb = colorsys.hsv_to_rgb(h, 1.0, 1.0)
	pencolor(rgb)
	penup()
	goto(x, y)
	pendown()
	circle(30)

done()