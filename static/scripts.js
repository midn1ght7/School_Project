function createTable(orders_val, matrix, type)
{
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    table.appendChild(thead);
    table.appendChild(tbody);

    let table_first = document.createElement('table');
    let thead_first = document.createElement('thead');
    table_first.appendChild(thead_first);
    
    let row_1 = document.createElement('tr');
    let row_1_cell_1 = document.createElement('td');
    row_1_cell_1.innerHTML = "Decisions";
    row_1_cell_1.className = "headers";
    let row_1_cell_2 = document.createElement('td');
    row_1_cell_2.innerHTML = "States of nature";
    row_1_cell_2.className = "headers";

    row_1.appendChild(row_1_cell_1);
    row_1.appendChild(row_1_cell_2);
    thead_first.appendChild(row_1);

    // Adding the entire table to the body tag
    var tableTitle=document.createElement("h3");
    
    if(type == "Payment")
    {
        
        tableTitle.innerHTML='The Payment Table';
        var elementid = "payment-table";
    }
    else if(type == "Regret")
    {
        tableTitle.innerHTML='The Regret Table';
        var elementid = "regret-table";   
    }
    else
    {
        alert("There was an error");
        return;
    }

    document.getElementById(elementid).appendChild(tableTitle);
    document.getElementById(elementid).appendChild(table_first);
    document.getElementById(elementid).appendChild(table);

    let row_2 = document.createElement('tr');
    let row_2_cell_1 = document.createElement('td');
    row_2_cell_1.innerHTML = "Order for:";
    row_2_cell_1.className = "headers";
    row_2.appendChild(row_2_cell_1);
    for (var i=0;i<orders_val;i++){
        let row2_cell = document.createElement('td');
        row2_cell.innerHTML = "s"+(i+1)+":"+(i+1)*100;
        row2_cell.className = "headers";
        row_2.appendChild(row2_cell);
    }
    tbody.appendChild(row_2);

    for (var i=0;i<orders_val;i++)
    {
        let row = document.createElement('tr');
        let row_cell_1 = document.createElement('td');
        row_cell_1.innerHTML = "a"+(i+1)+":"+(i+1)*100;
        row_cell_1.className = "headers";
        row.appendChild(row_cell_1);
        for (var j=0;j<orders_val;j++)
        {
            let row_cell = document.createElement('td');
            row_cell.innerHTML = matrix[i][j]; 
            row.appendChild(row_cell);
        }
        tbody.appendChild(row);
    }
}

function calculateRegretTable(orders_val, matrix){
    var regretTable = [];
    var maxTable = getRowMaxTable(matrix);
    for (var i=0;i<orders_val;i++)
    {
        var row = [];
        for (var j=0; j<orders_val;j++)
        {
            //console.log("At:"+[i]+" "+[j]+" Matrix is: "+matrix[i][j]+" Max from row is: "+maxfromrow);
            row.push((maxTable[j] - matrix[i][j]));
            //console.log(regretTable[i][j]);
        }
        //console.log("Row: "+i+" "+row);
        regretTable.push(row);
    }
    console.log(regretTable);
    return regretTable;
}

function appendCriterion(title, value, index){
    let h3 = document.createElement("h3");
    h3.innerHTML = title;
    document.getElementById('criterions').appendChild(h3);
    let p = document.createElement("p");
    if(title == "Laplace Criterion")
    {
        p.innerHTML = "According to this criterion, the best strategy would be: a"+(index[0]+1);
    }
    else if(title == "Expected Payoff Criterion")
    {
        p.innerHTML = "According to this criterion, the best strategy would be: a"+(index[0]+1)+" with expected payment: "+(value);
    }
    else if(title == "Expected Loss Criterion")
    {
        p.innerHTML = "According to this criterion, the best strategy would be: a"+(index[0]+1)+" with expected loss: "+(value);
    }
    else if(title == "Expected Value given Perfect Information")
    {
        p.innerHTML = "According to this criterion the expected value given perfect information equals: "+value;
    }
    else if(title == "Expected Value of Perfect Information")
    {
        p.innerHTML = "According to this criterion the expected value of perfect information equals: "+value;
    }
    else
    {
        p.innerHTML = "According to this criterion, the best strategy would be: a"+(index[0]+1)+" and s"+(index[1]+1)+" equalling: "+value;
    }
    document.getElementById('criterions').appendChild(p);
}

function hurwiczCriterion(matrix){
    var title = "Hurwicz Criterion";
    var max = getMaxfromMatrix(matrix);
    var index = findIndexofMatrix(matrix, max);
    appendCriterion(title, max, index);
}

function waldCriterion(matrix){
    var title = "Wald Criterion";
    var minTable = getRowMinTable(matrix);
    var max = getMaxfromTable(minTable);
    var index = findIndexofMatrix(matrix, max);
    appendCriterion(title, max, index);
}

function savageCriterion(matrix){
    var title = "Savage Criterion";
    var maxTable = getRowMaxTable(matrix);
    var min = getMinfromTable(maxTable);
    var index = findIndexofMatrix(matrix, min);
    appendCriterion(title, min, index);
}

function laplaceCriterion(payment){
    var title = "Laplace Criterion";
    var sum_table = [];
    for (var i=0;i<payment.length;i++)
    {
        var row_sum = 0;
        for (var j=0;j<payment[i].length;j++)
        {
            row_sum = row_sum + payment[i][j]*(1/payment[i].length);
        }
        sum_table.push(row_sum);
    }
    console.log(sum_table);
    var max = getMaxfromTable(sum_table);
    var index = [];
    index[0] = sum_table.indexOf(max); 
    appendCriterion(title, max, index);
}

function expectedProbabilites(matrix){
    var prob = [];
    if (matrix.length == 4){
        prob[0] = 0.2;
        prob[1] = 0.1;
        prob[2] = 0.5;
        prob[3] = 0.2;
    }
    else
    {
        for (var i=0;i<matrix.length;i++){
            prob[i] = 1/matrix.length;
        }
    }
    return prob;
}

function expectedPayoff(matrix){
    var title = "Expected Payoff Criterion";
    var prob = expectedProbabilites(matrix);
    var sum_table = [];
    for (var i=0;i<matrix.length;i++)
    {
        var row_sum = 0;
        for (var j=0;j<matrix[i].length;j++)
        {
            row_sum = row_sum + (matrix[i][j]*(prob[j]));
        }
        sum_table.push(row_sum);
    }
    console.log(sum_table);
    var max = getMaxfromTable(sum_table);
    //console.log(max);
    var index = [];
    index[0] = sum_table.indexOf(max);  
    appendCriterion(title, max, index);
    return max;
}

function expectedLoss(matrix){
    var title = "Expected Loss Criterion";
    var prob = expectedProbabilites(matrix);
    var sum_table = [];
    for (var i=0;i<matrix.length;i++)
    {
        var row_sum = 0;
        for (var j=0;j<matrix[i].length;j++)
        {
            row_sum = row_sum + (matrix[i][j]*(prob[j]));
        }
        sum_table.push(row_sum);
    }
    console.log(sum_table);
    var min = getMinfromTable(sum_table);
    var index = [];
    index[0] = sum_table.indexOf(min);  
    appendCriterion(title, min, index);
    return min;
}

function expectedPerfectPayoff(matrix){
    var title = "Expected Value given Perfect Information";
    var prob = expectedProbabilites(matrix);
    var max_table = getRowMaxTable(matrix);
    var result = 0
    for (var i=0;i<matrix.length;i++)
    {
        result = result + max_table[i]*prob[i];
    } 
    appendCriterion(title, result, 0);
    return result;
}

function expectedValueofPerfect(EP,EPP){
    var title = "Expected Value of Perfect Information";
    var result = EPP - EP;
    appendCriterion(title, result, 0);
}

function getRowMaxTable(matrix){
    var maxTable = [];
    for (var i=0;i<matrix.length;i++)
    {
        var largest = matrix[i][0];
        for (var j=0;j<matrix[i].length;j++)
        {
            if(matrix[i][j] > largest) 
            {
                largest = matrix[i][j];
                //alert("Max from row["+i+"] = "+maxfromrow);
            }
        }
        maxTable.push(largest);
    }
    //console.log(maxTable);
    return maxTable;
}

function getRowMinTable(matrix){
    var minTable = [];
    for (var i=0;i<matrix.length;i++)
    {
        var lowest = matrix[i][0];
        for (var j=0;j<matrix[i].length;j++)
        {
            if(matrix[i][j] < lowest) 
            {
                lowest = matrix[i][j];
            }
        }
        minTable.push(lowest);
    }
    return minTable;
}

function getMaxfromMatrix(matrix){
    var maxValue = matrix[0][0];
    for (var i=0;i<matrix.length;i++)
    {
        for (var j=0;j<matrix[i].length;j++)
        {
            if (matrix[i][j] > maxValue){
                maxValue = matrix[i][j];
            }
        }
    }
    return maxValue;
}

function getMaxfromTable(table){
    var maxValue = table[0];
    for (var i=0;i<table.length;i++)
    {
        if (table[i] > maxValue){
            maxValue = table[i];
        }
    }
    return maxValue;
}

function getMinfromTable(table){
    var minValue = table[0];
    for (var i=0;i<table.length;i++)
    {
        if (table[i] < minValue){
            minValue = table[i];
        }
    }
    return minValue;
}

function findIndexofMatrix(matrix, value){
    var position = [];
    for (var i=0;i<matrix.length;i++)
    {
        for (var j=0;j<matrix[i].length;j++)
        {
            if (matrix[i][j] == value){
                index_i = i;
                index_j = j;
                position.push(index_i);
                position.push(index_j);
                return position;
            }
        }
    }
    return "Couldn't find that value";
}

window.onload=function(){
    var orders_form = document.getElementById("orders-form");
    var prices_ord_form = document.getElementById("prices-to-no-form");
    var prices_day_form = document.getElementById("prices-to-days-form");

    var orders_val = 0;
    var prices_orders = [];
    var sell_days = 2;
    var prices_days = [];

    orders_form.addEventListener('submit', e =>{
        e.preventDefault();
        orders_val = document.getElementById("orders-input").value;
        if(orders_val != 0)
        {
            document.getElementById("orders-form").innerHTML = '';
            for (var i=0;i<orders_val;i++)
            {
                var label = document.createElement("label");
                label.htmlFor = "price" + i;
                label.textContent = "Price for order (" + (i+1)*100 +")";
                var input = document.createElement("input");
                input.type = "text";
                input.name = "price" + i;
                input.id = "price" + i;
                document.getElementById("prices-to-no-form").appendChild(label);
                document.getElementById("prices-to-no-form").appendChild(input);
                //document.getElementById("prices-to-no-form").appendChild(document.createElement("br"));
            }
            var submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Submit";
            document.getElementById("prices-to-no-form").appendChild(submit);
        }
        else
        {
            alert("Something went wrong.");
        }
    })

    prices_ord_form.addEventListener('submit', e =>{
        e.preventDefault();
        for (i=0; i<orders_val;i++)
        {
            prices_orders.push(document.getElementById("price"+i).value);
            //alert(prices_orders[i]);
        }
        //alert("weszło");
        if(prices_orders[0] != 0)
        {
            document.getElementById("prices-to-no-form").innerHTML = '';
            for (var i=0;i<sell_days;i++){
                var label = document.createElement("label");
                label.htmlFor = "price_day" + i;
                label.textContent = "Price for day no. " + (i+1);
                var input = document.createElement("input");
                input.type = "text";
                input.name = "price_day" + i;
                input.id = "price_day" + i;
                document.getElementById("prices-to-days-form").appendChild(label);
                document.getElementById("prices-to-days-form").appendChild(input);
            }
            var submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Submit";
            document.getElementById("prices-to-days-form").appendChild(submit);
        }
        else
        {
            alert("Something went wrong.");
        }
    })

    prices_day_form.addEventListener('submit', e =>{
        e.preventDefault();
        for (i=0; i<sell_days;i++)
        {
            prices_days.push(document.getElementById("price_day"+i).value);
        }
        if(prices_days[0] != 0)
        {
            document.getElementById("prices-to-days-form").innerHTML = '';
            var js_data = JSON.stringify({
                orders_val: orders_val,
                prices_orders: prices_orders,
                sell_days: sell_days,
                prices_days: prices_days
            });
            console.log(js_data);

            $.ajax({                        
                url: '/fun1',
                type : 'POST',
                contentType: 'application/json',
                dataType : 'json',
                data : js_data
            }).done(function(payment_matrix) 
            {
                console.log(payment_matrix);
                createTable(orders_val, payment_matrix, "Payment");
                var regret_matrix = calculateRegretTable(orders_val, payment_matrix);
                createTable(orders_val, regret_matrix , "Regret");
                hurwiczCriterion(payment_matrix);
                waldCriterion(payment_matrix);
                savageCriterion(regret_matrix);
                laplaceCriterion(payment_matrix);
                //expectedPayoff(payment_matrix);
                var EP = expectedPayoff(payment_matrix);
                expectedLoss(regret_matrix);
                //expectedPerfectPayoff(payment_matrix);
                var EPP = expectedPerfectPayoff(payment_matrix);
                expectedValueofPerfect(EP,EPP);
            });
        }
        else
        {
            alert("Something went wrong.");
        }
    })

}