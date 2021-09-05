# Copied from: https://www.youtube.com/watch?v=NynjHwS5S8E
import turtle

turtle.bgcolor('black')
turtle.pensize(5)
turtle.speed(0)

for i in range(5):
 for colours in ['red','magenta','blue','cyan','green','yellow','white','orange']:
  turtle.color(colours)
  turtle.circle(100)
  turtle.left(10)

turtle.exitonclick()