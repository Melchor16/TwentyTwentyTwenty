const d = document;
const mediaFolder = "./media/",
  alarmAudio = new Audio("./media/alarm-sound.mp3");

let continueTimer = false,
  minutes = 0,
  seconds = 0,
  firstTimer,
  secondTimer;

const $timer = d.getElementById("timer"),
  $btn = d.getElementById("start-stop-btn"),
  $loading = d.getElementById("loading");

//------------------RANDOM AUDIO-------------------------//

let twAudio;
const audioArray = [
  "20-sound-1.mp3",
  "20-sound-2.mp3",
  "20-sound-3.mp3",
  "20-sound-4.mp3",
  "20-sound-5.mp3",
  "20-sound-6.mp3",
];

const randomAudio = (vol) => {
  const audioIndex = Math.floor(Math.random() * audioArray.length);
  twAudio = new Audio(`${mediaFolder}${audioArray[audioIndex]}`);
  twAudio.volume = vol;
  twAudio.play();
};

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
      if (minutes === 1 && seconds >= 2) {
        clearInterval(firstTimer);
        minutes = 0;
        seconds = 0;
        $timer.innerHTML = formatTime(minutes, seconds);
        alarmAudio.play();
        randomAudio(0.5);
        res(true);
      } else if (seconds >= 59) {
        minutes++;
        seconds = 0;
        $timer.innerHTML = formatTime(minutes, seconds);
      } else {
        seconds++;
        $timer.innerHTML = formatTime(minutes, seconds);
      }
    }, 250);
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
        twAudio.currentTime = 0;
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
  twAudio.pause();
  twAudio.currentTime = 0;
};

const startTimer = async () => {
  $btn.removeEventListener("click", startTimer);
  $btn.addEventListener("click", stopTimer);
  continueTimer = true;

  $btn.classList.remove("start-btn");
  $btn.classList.add("stop-btn");
  $btn.innerHTML = "Stop";

  $loading.classList.toggle("hidden");
  await delay(1000);
  $loading.classList.toggle("hidden");
  await minutesTimer();
  await delay(1500);
  await secTimer();
};

$btn.addEventListener("click", startTimer);
