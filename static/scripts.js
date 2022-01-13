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
    let row_1_cell_2 = document.createElement('td');
    row_1_cell_2.innerHTML = "States of nature";

    row_1.appendChild(row_1_cell_1);
    row_1.appendChild(row_1_cell_2);
    thead_first.appendChild(row_1);

    // Adding the entire table to the body tag
    if(type == "Payment")
    {
        var tableTitle=document.createElement("h3");
        tableTitle.innerHTML='The Payment Table';
        document.getElementById('payment-table').appendChild(tableTitle);
        document.getElementById('payment-table').appendChild(table_first);
        document.getElementById('payment-table').appendChild(table);
    }

    if(type == "Regret")
    {
        var tableTitle=document.createElement("h3");
        tableTitle.innerHTML='The Regret Table';
        document.getElementById('regret-table').appendChild(tableTitle);
        document.getElementById('regret-table').appendChild(table_first);
        document.getElementById('regret-table').appendChild(table);
    }

    let row_2 = document.createElement('tr');
    let row_2_cell_1 = document.createElement('td');
    row_2_cell_1.innerHTML = "Order for:";
    row_2.appendChild(row_2_cell_1);
    for (var i=0;i<orders_val;i++){
        let row2_cell = document.createElement('td');
        row2_cell.innerHTML = "s1:"+(i+1)*100;
        row_2.appendChild(row2_cell);
    }
    tbody.appendChild(row_2);

    for (var i=0;i<orders_val;i++)
    {
        let row = document.createElement('tr');
        let row_cell_1 = document.createElement('td');
        row_cell_1.innerHTML = "a1:"+(i+1)*100;
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

function calculateMaxTable(orders_val,matrix){
    var maxTable = [];
    var maxfromrow = 0;
    for (var i=0;i<orders_val;i++)
    {
        for (var j=0;j<orders_val;j++)
        {
            var largest = matrix[i][j];
            if(largest > maxfromrow) 
            {
                maxfromrow = largest;
                //alert("Max from row["+i+"] = "+maxfromrow);
            }
        }
        maxTable.push(maxfromrow);
    }
    //console.log(maxTable);
    return maxTable;
}

function calculateRegretTable(orders_val, matrix){
    var regretTable = [];
    var maxTable = calculateMaxTable(orders_val, matrix);
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
            }).done(function(response) 
            {
                console.log(response);
                createTable(orders_val, response, "Payment");
                createTable(orders_val, calculateRegretTable(orders_val, response), "Regret");
            });
        }
        else
        {
            alert("Something went wrong.");
        }
    })

}