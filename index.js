document.addEventListener('DOMContentLoaded', function() {
    const customerFilter = document.getElementById('customerFilter');
    const amountFilter = document.getElementById('amountFilter');
    const customerTableBody = document.querySelector('#customerTable tbody');
    const transactionChartCtx = document.getElementById('transactionChart').getContext('2d');

    let customers = [];
    let transactions = [];
    let chart;

    // Fetch data from API
    function fetchData() {
        fetch('https://my-json-server.typicode.com/mohamedhalemramadan/job-fair/customers')
            .then(response => response.json())
            .then(data => {
                customers = data;
                return fetch('https://my-json-server.typicode.com/mohamedhalemramadan/job-fair/transactions');
            })
            .then(response => response.json())
            .then(data => {
                transactions = data;
                displayTable(customers, transactions);
            });
    }
    // Display table with filtered data
    function displayTable(customers, transactions) {
        customerTableBody.innerHTML = '';

        transactions.forEach(transaction => {
            const customer = customers.find(c => c.id === transaction.customer_id);
            if (customer && filterTransaction(customer, transaction)) {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${customer.name}</td><td>${transaction.date}</td><td>${transaction.amount}</td>`;
                row.addEventListener('click', () => displayChart(customer.id));
                customerTableBody.appendChild(row);
            }
        });
    }

    // Filter transactions based on input
    function filterTransaction(customer, transaction) {
        const customerFilterValue = customerFilter.value.toLowerCase();
        const amountFilterValue = amountFilter.value;
        const customerNameMatch = customer.name.toLowerCase().includes(customerFilterValue);
        const amountMatch = !amountFilterValue || transaction.amount == amountFilterValue;

        return customerNameMatch && amountMatch;
    }

    // Display chart for selected customer
    function displayChart(customerId) {
        const customerTransactions = transactions.filter(t => t.customer_id === customerId);
        const dates = customerTransactions.map(t => t.date);
        const amounts = customerTransactions.map(t => t.amount);

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(transactionChartCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Transaction Amount',
                    data: amounts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { display: true, title: { display: true, text: 'Date' }},
                    y: { display: true, title: { display: true, text: 'Amount' }}
                }
            }
        });
    }

    // Event listeners for filters
    customerFilter.addEventListener('input', () => displayTable(customers, transactions));
    amountFilter.addEventListener('input', () => displayTable(customers, transactions));

    // Initial fetch
    fetchData();
});
