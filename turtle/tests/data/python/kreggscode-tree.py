import turtle

t = turtle.Turtle()
t.screen.bgcolor('black')
t.pensize(2)
t.color('green')
t.left(90)
t.backward(100)
t.speed(200)
t.shape('turtle')

def tree(i):
	if i < 10:
		return
	else:
		t.forward(i)
		t.color('orange')
		t.circle(2)
		t.color('brown')
		t.left(30)
		tree(3*i/4)
		t.right(60)
		tree(3*i/4)
		t.left(30)
		t.backward(i)

tree(100)

t.penup()
t.goto(0,-250)
t.right(90)
t.pendown()
t.color('orange')
t.begin_fill()
t.left(45)
t.forward(100)
t.circle(50, 100)
t.right(90)
t.circle(50, 180)
t.forward(100)
t.end_fill()

t.penup()
t.goto(0, -150)
t.pendown()
t.color('white')
t.write('luv u', align="center", font=("Arial", 20, "bold"))

t.hideturtle() # Hiding the turtle

turtle.done()