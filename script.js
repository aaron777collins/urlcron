document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const urlInput = document.getElementById('url');
    const intervalInput = document.getElementById('interval');
    const useCorsProxyCheckbox = document.getElementById('useCorsProxy');
    const corsProxyUrlInput = document.getElementById('corsProxyUrl');
    const repeatCheckbox = document.getElementById('repeat');
    const progressBar = document.getElementById('progressBar');
    const responseContainer = document.getElementById('responseContainer');

    let timerId = null;
    let progressInterval = null;

    const fetchUrl = async (url, useCorsProxy) => {
        const proxyUrl = useCorsProxy ? `${corsProxyUrlInput.value}` : '';
        try {
            const response = await fetch(`${proxyUrl}${url}`, {
                method: 'GET',
                mode: 'cors', // Needed for CORS request to work with proxy
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            return `Fetch error: ${error.message}`;
        }
    };

    const updateProgressBar = () => {
        const elapsedTime = Date.now() - timerId;
        const progress = (elapsedTime / (intervalInput.value * 1000)) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        if (progress >= 100 && progressInterval) {
            clearInterval(progressInterval);
            progressBar.style.width = '0%'; // Reset for next interval
        }
    };

    const startProgress = () => {
        if (progressInterval) clearInterval(progressInterval);
        timerId = Date.now();
        progressInterval = setInterval(updateProgressBar, 100);
    };

    startButton.onclick = async () => {
        clearTimeout(timerId); // Clear previous timer if exists
        clearInterval(progressInterval); // Clear previous progress interval if exists

        const fetchAndSchedule = async () => {
            const url = urlInput.value;
            const useCorsProxy = useCorsProxyCheckbox.checked;
            responseContainer.textContent = 'Fetching...';
            startProgress();

            const responseText = await fetchUrl(url, useCorsProxy);
            responseContainer.textContent = responseText;

            if (repeatCheckbox.checked) {
                timerId = setTimeout(fetchAndSchedule, intervalInput.value * 1000);
            } else {
                clearInterval(progressInterval);
                progressBar.style.width = '100%';
            }
        };

        fetchAndSchedule();
    };

    stopButton.onclick = () => {
        clearTimeout(timerId);
        clearInterval(progressInterval);
        timerId = null;
        progressBar.style.width = '0%';
        responseContainer.textContent = 'Stopped.';
    };
});
