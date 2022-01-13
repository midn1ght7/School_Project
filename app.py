from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/fun1', methods=['POST'])
def fun1():
    data = request.json
    print(data)
    
    orders_val = int(data['orders_val'])
    print("Type of orders_val:",type(orders_val),orders_val)
    orders_matrix = []
    base = 100
    for i in range (orders_val):
        orders_matrix.append(base)
        base = base + 100
    
    prices_orders = data['prices_orders']
    print("Type of prices_orders:",type(prices_orders),prices_orders)
    #print("Type of prices_orders[0]:",type(prices_orders[0]),prices_orders[0])
    sell_days = int(data['sell_days'])
    print("Type of sell_days:",type(sell_days),sell_days)
    prices_days = data['prices_days']
    print("Type of prices_days:",type(prices_days),prices_days)
    
    #convert lists content to int
    for i in range(len(prices_orders)):
        prices_orders[i] = int(prices_orders[i])
    for i in range(len(prices_days)):
        prices_days[i] = int(prices_days[i])
    
    print("Type of prices_orders[0]:",type(prices_orders[0]),prices_orders[0])

    print("Array of prices")
    for i in range(orders_val):
        print(((i+1)*100),":",prices_orders[i])
    print("Array of sell prices")
    for i in range(sell_days):
        print((i+1),prices_days[i])

    compute_matrix = []

    # Compute the matrix
    for i in range(orders_val):          # A for loop for row entries
        a = []
        for j in range(orders_val):      # A for loop for column entries
            if(orders_matrix[j]>orders_matrix[i]):
                #print("--Entered IF")
                a.append(a[j-1])
            else:
                #print("--Entered ELSE")
                a.append((-orders_matrix[i]*prices_orders[i])+(orders_matrix[j]*prices_days[0]+(orders_matrix[i]-orders_matrix[j])*prices_days[1]))
        compute_matrix.append(a)
        #print(compute_matrix[i])

    # For printing the matrix
    for i in range(orders_val):
        for j in range(orders_val):
            print(compute_matrix[i][j], end = " ")
        print()
        

    return jsonify(compute_matrix)