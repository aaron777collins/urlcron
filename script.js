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
    let startTime = null;

    const fetchUrl = async (url, useCorsProxy) => {
        const finalUrl = useCorsProxy ? `${corsProxyUrlInput.value}${url}` : url;
        try {
            const response = await fetch(finalUrl, {
                method: 'GET',
                mode: useCorsProxy ? 'cors' : 'no-cors', // 'no-cors' for direct, 'cors' for proxy
                headers: useCorsProxy ? { 'X-Requested-With': 'XMLHttpRequest' } : {}
            });
            if (!response.ok && useCorsProxy) throw new Error(`HTTP error! status: ${response.status}`);
            const text = await response.text();
            return useCorsProxy ? text : `Response received. Content cannot be shown due to 'no-cors' mode.`;
        } catch (error) {
            return `Fetch error: ${error.message}`;
        }
    };

    const updateProgressBar = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = (elapsedTime / (intervalInput.value * 1000)) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        if (progress < 100) {
            requestAnimationFrame(updateProgressBar);
        }
    };

    startButton.onclick = async () => {
        if (timerId) return; // Prevent multiple timers

        const fetchAndSchedule = async () => {
            const url = urlInput.value;
            const useCorsProxy = useCorsProxyCheckbox.checked;
            responseContainer.textContent = 'Fetching...';
            progressBar.style.width = '0%';
            startTime = Date.now();
            requestAnimationFrame(updateProgressBar);

            try {
                const responseText = await fetchUrl(url, useCorsProxy);
                responseContainer.textContent = responseText;

                if (repeatCheckbox.checked) {
                    timerId = setTimeout(fetchAndSchedule, intervalInput.value * 1000);
                }
            } catch (error) {
                responseContainer.textContent = `Error: ${error}`;
            }
        };

        fetchAndSchedule();
    };

    stopButton.onclick = () => {
        clearTimeout(timerId);
        timerId = null;
        progressBar.style.width = '0%';
        responseContainer.textContent = 'Stopped.';
    };
});
