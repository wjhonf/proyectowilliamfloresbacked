document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000; 
    const localISOTime = (new Date(today - offset)).toISOString().split('T')[0];
    document.getElementById('searchButton').addEventListener('click', function() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        let query = '?';
        if (startDate) query += `fromDate=${startDate}&`;
        if (endDate) query += `toDate=${endDate}&`;
        window.location.href = `/listcarts/view${query}`;
      });
});