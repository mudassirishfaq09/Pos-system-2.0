document.addEventListener("DOMContentLoaded", () => {
    const invoiceData = JSON.parse(localStorage.getItem('invoices')) || [];
    renderTable(invoiceData);
    populateYearSelect(invoiceData);

});
function renderTable(data) {
    const tbody = document.getElementById('invoiceRecords');
    tbody.innerHTML = '';
    let totalSalesWithVAT = 0;
    let totalVAT = 0;

    data.forEach(item => {
        const itemTotal = item.items.reduce((sum, currentItem) => sum + currentItem.total, 0);
        const vat = itemTotal * 0.05;
        const total = itemTotal + vat;
        totalSalesWithVAT += total;
        totalVAT += vat;

        item.items.forEach(invoiceItem => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${invoiceItem.name} (${invoiceItem.size})</td>
                <td>${invoiceItem.price.toFixed(2)} AED</td>
                <td>${invoiceItem.quantity}</td>
                <td>${(invoiceItem.total * 0.05).toFixed(2)} AED</td>
                <td>${(invoiceItem.total * 1.05).toFixed(2)} AED</td>
                <td>${new Date(item.date).toLocaleDateString()}</td>
            `;
            tbody.appendChild(row);
        });
    });

    document.getElementById('totalSalesWithVAT').innerText = `Grand Total Sales (with VAT): ${totalSalesWithVAT.toFixed(2)} AED`;
    document.getElementById('totalVAT').innerText = `Total VAT: ${totalVAT.toFixed(2)} AED`;
}

function filterData(period) {
    const data = JSON.parse(localStorage.getItem('invoices')) || [];
    const now = new Date();
    const filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        switch (period) {
            case 'today':
                return now.toDateString() === itemDate.toDateString();
            case 'monthly':
                return now.getMonth() === itemDate.getMonth() && now.getFullYear() === itemDate.getFullYear();
            case 'yearly':
                return now.getFullYear() === itemDate.getFullYear();
            default:
                return true;
        }
    });

    if (period === 'yearly') {
        renderYearlyData(filteredData, document.getElementById('yearSelect').value);
    } else {
        renderTable(filteredData);
    }

    updateActiveButton(period);
    updateHeading(period);
}

function updateActiveButton(period) {
    document.querySelectorAll('.filter-buttons button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(`${period}Btn`).classList.add('active');
}

function updateHeading(period) {
    const headings = {
        'today': "Today's Invoice Data",
        'monthly': "Monthly Invoice Data",
        'yearly': "Yearly Invoice Data"
    };
    document.getElementById('filterHeading').innerText = headings[period] || "Select a filter to view data";
}

function showMonthlyFilters() {
    document.getElementById('monthlyFilters').style.display = 'block';
    document.getElementById('yearlyFilters').style.display = 'none';
    document.getElementById('yearlyData').style.display = 'none';
    filterData('monthly');
}

function showYearlyData() {
    document.getElementById('monthlyFilters').style.display = 'none';
    document.getElementById('yearlyFilters').style.display = 'block';
    document.getElementById('yearlyData').style.display = 'block';
    filterData('yearly');
}

function showDailyData() {
    document.getElementById('monthlyFilters').style.display = 'none';
    document.getElementById('yearlyFilters').style.display = 'none';
    document.getElementById('yearlyData').style.display = 'none';
    filterData('today');
}

function filterMonthlyData() {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    const data = JSON.parse(localStorage.getItem('invoices')) || [];
    const filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
    });
    renderTable(filteredData);
    updateActiveButton('monthly');
    updateHeading('monthly');
}

function populateYearSelect(data) {
    const yearSelect = document.getElementById('yearSelect');
    const years = [...new Set(data.map(item => new Date(item.date).getFullYear()))];
    yearSelect.innerHTML = years.map(year => `<option value="${year}">${year}</option>`).join('');
    if (years.length > 0) {
        yearSelect.value = years[0];
    }
}

function renderYearlyData(data, selectedYear) {
    const monthlyData = Array.from({ length: 12 }, () => ({
        items: 0,
        vat: 0,
        sales: 0
    }));

    let totalVAT = 0;

    data.forEach(item => {
        const itemDate = new Date(item.date);
        if (itemDate.getFullYear() === parseInt(selectedYear)) {
            const monthIndex = itemDate.getMonth();
            const itemTotal = item.items.reduce((sum, currentItem) => sum + currentItem.total, 0);
            const vat = itemTotal * 0.05;
            const total = itemTotal + vat;

            monthlyData[monthIndex].items += item.items.length;
            monthlyData[monthIndex].vat += vat;
            monthlyData[monthIndex].sales += total;

            totalVAT += vat;
        }
    });

    const tbody = document.getElementById('yearlyTable');
    tbody.innerHTML = '';
    const now = new Date();

    monthlyData.forEach((data, index) => {
        const row = document.createElement('tr');
        const monthName = new Date(now.getFullYear(), index).toLocaleString('default', { month: 'long' });
        row.innerHTML = `
            <td class="${now.getMonth() === index ? 'highlight' : ''}">${monthName}, ${selectedYear}</td>
            <td class="${now.getMonth() === index ? 'highlight' : ''}">${data.items}</td>
            <td class="${now.getMonth() === index ? 'highlight' : ''}">${data.vat.toFixed(2)} AED</td>
            <td class="${now.getMonth() === index ? 'highlight' : ''}">${data.sales.toFixed(2)} AED</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('totalVAT').innerText = `Total VAT: ${totalVAT.toFixed(2)} AED`;
}

function filterYearlyData() {
    const selectedYear = document.getElementById('yearSelect').value;
    const data = JSON.parse(localStorage.getItem('invoices')) || [];
    renderYearlyData(data, selectedYear);
};