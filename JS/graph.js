document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('salesChart').getContext('2d');
    let salesChart;

    const buttons = document.querySelectorAll('.filter-buttons button');
    const filterText = document.getElementById('currentFilter');
    
    buttons.forEach(button => button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterData(button.id.replace('Btn', '')); // Convert button id to period
    }));

    function renderChart(data, labels, totalSales) {
        if (salesChart) {
            salesChart.destroy();
        }
        document.getElementById('totalSales').innerText = `Total Sales: AED ${totalSales.toFixed(2)}`;
        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales (AED)',
                    data: data,
                    borderColor: '#007bff',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Sales (AED)'
                        }
                    }
                }
            }
        });
    }

    function filterData(period) {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const now = new Date();
        let filteredData = [];
        let labels = [];
        let totalSales = 0;
        let data = [];

        switch (period) {
            case 'daily':
                filteredData = invoices.filter(item => new Date(item.date).toDateString() === now.toDateString());
                labels = filteredData.map(item => new Date(item.date).toLocaleTimeString());
                data = filteredData.map(item => item.items.reduce((sum, currentItem) => sum + currentItem.total, 0));
                totalSales = data.reduce((sum, current) => sum + current, 0);
                filterText.innerText = 'Showing data for: Today';
                break;
            case 'monthly':
                filteredData = invoices.filter(item => new Date(item.date).getMonth() === now.getMonth() && new Date(item.date).getFullYear() === now.getFullYear());
                labels = Array.from({ length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() }, (_, i) => i + 1);
                data = Array(labels.length).fill(0);
                filteredData.forEach(item => {
                    const day = new Date(item.date).getDate();
                    const sale = item.items.reduce((sum, currentItem) => sum + currentItem.total, 0);
                    totalSales += sale;
                    data[day - 1] += sale;
                });
                filterText.innerText = 'Showing data for: This Month';
                break;
            case 'yearly':
                filteredData = invoices.filter(item => new Date(item.date).getFullYear() === now.getFullYear());
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = Array(labels.length).fill(0);
                filteredData.forEach(item => {
                    const month = new Date(item.date).getMonth();
                    const sale = item.items.reduce((sum, currentItem) => sum + currentItem.total, 0);
                    totalSales += sale;
                    data[month] += sale;
                });
                filterText.innerText = 'Showing data for: This Year';
                break;
            default:
                break;
        }

        renderChart(data, labels, totalSales);
    }

    // Set initial filter to daily and add active class to daily button
    filterData('daily');
    document.getElementById('dailyBtn').classList.add('active');
});
