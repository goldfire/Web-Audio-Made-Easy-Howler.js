document.addEventListener('DOMContentLoaded', () => {
  const buttonContainer = document.querySelector('.start-container');
  const startBtn = document.querySelector('.start-container button');
  const speedBtn = document.querySelector('.countdown-container .speed');
  const countdownContainer = document.querySelector('.countdown-container');
  const countdown = document.querySelector('.countdown');

  // Handle starting the timer.
  let timerEnd;
  startBtn.addEventListener('click', () => {
    buttonContainer.style.display = 'none';
    countdownContainer.style.display = 'flex';

    // Start the countdown timer.
    timerEnd = Date.now() + 10000;
  });

  // Update the display with requestAnimationFrame.
  const tick = () => {
    // Update the timer.
    if (timerEnd) {
      const ms = timerEnd - Date.now();

      // Show the timer or reset the state.
      if (ms >= 0) {
        const rate = 1000;
        const mins = Math.floor(ms / 60000);
        const secs = Math.ceil((ms % 60000) / rate);
        const minsText = mins < 10 ? `0${mins}` : mins;
        const secsText = secs < 10 ? `0${secs}` : secs;
        countdown.innerHTML = `${minsText}:${secsText}`;
      } else {
        timerEnd = null;
        buttonContainer.style.display = 'flex';
        countdownContainer.style.display = 'none';
      }
    }

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
