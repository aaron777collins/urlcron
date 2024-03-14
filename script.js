document.getElementById('schedulerForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission

    const url = document.getElementById('url').value;
    const interval = document.getElementById('interval').value * 1000; // Convert seconds to milliseconds

    setInterval(() => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById('responseDisplay').textContent = data;
            })
            .catch(error => {
                document.getElementById('responseDisplay').textContent = 'Error: ' + error.message;
            });
    }, interval);
});
