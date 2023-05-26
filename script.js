const d = document;
const twAudio = new Audio("./media/20-sound.mp3"),
  alarmAudio = new Audio("./media/alarm-sound.mp3");

let continueTimer = false,
  minutes = 0,
  seconds = 0,
  firstTimer,
  secondTimer;

const $timer = d.getElementById("timer"),
  $btn = d.getElementById("start-stop-btn");

//------------------FORMATTING TIME OUTPUT---------------//

const formatTime = (min, sec) => {
  const formattedMinutes = min.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const formattedSeconds = sec.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });

  return `${formattedMinutes}:${formattedSeconds}`;
};

//------------------DELAY FUNCTION--------------------//

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//------------------TIMERS----------------------------//

const minutesTimer = () => {
  return new Promise((res) => {
    firstTimer = setInterval(() => {
      if (minutes === 19 && seconds >= 59) {
        clearInterval(firstTimer);
        minutes = 0;
        seconds = 0;
        $timer.innerHTML = formatTime(minutes, seconds);
        alarmAudio.play();
        twAudio.play();
        res(true);
      } else if (seconds >= 59) {
        minutes++;
        seconds = 0;
        $timer.innerHTML = formatTime(minutes, seconds);
      } else {
        seconds++;
        $timer.innerHTML = formatTime(minutes, seconds);
      }
    }, 1000);
  });
};

const secTimer = () => {
  return new Promise((res) => {
    secondTimer = setInterval(() => {
      if (seconds >= 20) {
        seconds = 0;
        $timer.innerHTML = formatTime(minutes, seconds);
        twAudio.pause();
        alarmAudio.play();
        clearInterval(secondTimer);
        startTimer();
      } else {
        seconds++;
        $timer.innerHTML = formatTime(minutes, seconds);
      }
    }, 1000);
    res(true);
  });
};

//------------------STARTING AND STOPPING TIMERS-----------//

const stopTimer = () => {
  clearInterval(firstTimer);
  clearInterval(secondTimer);
  $timer.innerHTML = "00:00";
  minutes = 0;
  seconds = 0;

  $btn.classList.remove("stop-btn");
  $btn.classList.add("start-btn");
  $btn.innerHTML = "Start";

  $btn.removeEventListener("click", stopTimer);
  $btn.addEventListener("click", startTimer);
  continueTimer = false;
};

const startTimer = async () => {
  $btn.removeEventListener("click", startTimer);
  $btn.addEventListener("click", stopTimer);
  continueTimer = true;

  $btn.classList.remove("start-btn");
  $btn.classList.add("stop-btn");
  $btn.innerHTML = "Stop";

  await minutesTimer();
  await delay(1500);
  await secTimer();
  await delay(1500);
};

$btn.addEventListener("click", startTimer);
