let timer;
let startTime = null;
let elapsedTime = 0;
let isRunning = false;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

// Connect to WebSocket server
const socket = new WebSocket('ws://192.168.29.111:8080');

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'start') {
        startTime = data.startTime;
        isRunning = true;
        runTimer();
    }
};

// Start button
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        socket.send(JSON.stringify({ type: 'start', startTime: Date.now() }));
    }
});

// Stop button
stopBtn.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        elapsedTime += Date.now() - startTime;
    }
});

// Reset button
resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    elapsedTime = 0;
    startTime = null;
    display.textContent = formatTime(0, 0);
});

// Run the timer
function runTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        const now = Date.now();
        const timePassed = elapsedTime + (now - startTime);
        const seconds = Math.floor(timePassed / 1000);
        const milliseconds = timePassed % 1000;
        display.textContent = formatTime(seconds, milliseconds);
    }, 10); // Update every 10ms
}

// Format time
function formatTime(seconds, milliseconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const ms = Math.floor(milliseconds / 10);
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${pad(ms, 2)}`;
}

// Pad numbers with leading zeros
function pad(num, size = 2) {
    return num.toString().padStart(size, '0');
}
