const {Howl} = require('howler');

document.addEventListener('DOMContentLoaded', () => {
  const buttonContainer = document.querySelector('.start-container');
  const startBtn = document.querySelector('.start-container button');
  const speedBtn = document.querySelector('.countdown-container .speed');
  const countdownContainer = document.querySelector('.countdown-container');
  const countdown = document.querySelector('.countdown');

  // Setup the audio sprite.
  const audio = new Howl({
    src: ['./sounds/sounds.webm', './sounds/sounds.mp3'],
    sprite: {
      tick: [0, 284.72],
      complete: [2000, 2102.09],
    },
  });
  const liveAudio = new Howl({
    src: ['http://tunein.streamguys1.com/cnn'],
    html5: true,
  });

  // Handle starting the timer.
  let timerEnd;
  startBtn.addEventListener('click', () => {
    buttonContainer.style.display = 'none';
    countdownContainer.style.display = 'flex';

    // Start the countdown timer.
    timerEnd = Date.now() + 10000;
  });

  // Change the rate of playback.
  speedBtn.addEventListener('click', () => {
    audio.rate(2);
    timerEnd -= (timerEnd - Date.now()) / 2;
  });

  // Update the display with requestAnimationFrame.
  const tick = () => {
    // Update the timer.
    if (timerEnd) {
      const ms = timerEnd - Date.now();

      // Show the timer or reset the state.
      if (ms >= 0) {
        const rate = 1000 * (1 / audio.rate());
        const mins = Math.floor(ms / 60000);
        const secs = Math.ceil((ms % 60000) / rate);
        const minsText = mins < 10 ? `0${mins}` : mins;
        const secsText = secs < 10 ? `0${secs}` : secs;
        const prevHtml = countdown.innerHTML;
        countdown.innerHTML = `${minsText}:${secsText}`;

        // Play a sound on each tick.
        if (prevHtml !== countdown.innerHTML) {
          const id = audio.play('tick');

          // Pan the ticks left/right.
          audio.stereo(secs % 2 ? -1 : 1, id);
        }
      } else {
        timerEnd = null;
        buttonContainer.style.display = 'flex';
        countdownContainer.style.display = 'none';

        // Play the alarm sound.
        audio.play('complete');
        liveAudio.play();
        liveAudio.once('play', () => {
          setTimeout(() => {
            liveAudio.fade(1, 0, 1000);
          }, 4000);
        });
      }
    }

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
