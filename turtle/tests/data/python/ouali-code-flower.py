# copied from:
# https://www.youtube.com/shorts/5gSwLe2MMCg
from turtle import *
bgcolor("black")
speed(0)
width(2)
colors = ["#FF6B6B", "#4ECDC4",
		"#45B701", "#FFA07A",
		"#98D8C8", "#FFD930", "#68BC77"]
def draw_petal(size):
	circle(size, 60)
	left(120)
	circle(size, 60)
	left(120)
def draw_flower(petals, petal_size):
	for i in range(petals):
		color(colors[i % len(colors)])
		begin_fill()
		draw_petal(petal_size)
		end_fill()
		right(360 / petals)
hideturtle()
penup()
goto(0, 50)
setheading(90)
pendown()
draw_flower(petals=26, petal_size=200)
done()