import turtle
t = turtle.Turtle()
for i in range(1, 201):
	t.forward(i * 5/2.5)
	t.setheading(i*(88 + 4*(i*i/10000)))

turtle.done()