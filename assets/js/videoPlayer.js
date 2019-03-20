const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const jsVolumeBtn = document.getElementById("jsVolumeBtn");
const jsFullScreen = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;
  
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
};

function setTotalTime() {
    const totalTimeString = formatDate(Math.floor(videoPlayer.duration));
    totalTime.innerHTML = totalTimeString;
}

function getCurrentTime() {
    currentTime.innerHTML = formatDate(videoPlayer.currentTime);
}

function handlePlayClick() {
    if(videoPlayer.paused) {
        setInterval(getCurrentTime, 200);
        videoPlayer.play();
        playBtn.innerHTML = "<i class='fas fa-pause'></i>";
    } else {
        clearInterval(getCurrentTime);
        videoPlayer.pause();
        playBtn.innerHTML = "<i class='fas fa-play'></i>";
    }
}

function handleVolumeClick() {
    if(videoPlayer.muted) {
        videoPlayer.muted = false;
        jsVolumeBtn.innerHTML = "<i class='fas fa-volume-up'></i>";
        volumeRange.value = videoPlayer.volume;
    } else {
        volumeRange.value = 0;
        videoPlayer.muted = true;
        jsVolumeBtn.innerHTML = "<i class='fas fa-volume-mute'></i>";
    }
}

function exitFullScreen() {
    jsFullScreen.innerHTML = "<i class='fas fa-expand'></i>";
    jsFullScreen.addEventListener("click", goFullScreen);
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
    }
}

function goFullScreen() {
    if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
    }
    jsFullScreen.innerHTML = "<i class='fas fa-compress'></i>";
    jsFullScreen.removeEventListener("click", goFullScreen);
    jsFullScreen.addEventListener("click", exitFullScreen);
}

function handleEnded() {
    videoPlayer.currentTime = 0;
    playBtn.innerHTML = "<i class='fas fa-play'></i>";
}

function handleDrag(event) {
    // console.log(event.target.value);
    const { target: { value } } = event;
    videoPlayer.volume = value;
    if (value >= 0.6) {
        jsVolumeBtn.innerHTML = "<i class='fas fa-volume-up'></i>";
    } else if (value >= 0.2) {
        jsVolumeBtn.innerHTML = "<i class='fas fa-volume-down'></i>";
    } else {
        jsVolumeBtn.innerHTML = "<i class='fas fa-volume-off'></i>";
    }
}

function init() {
    videoPlayer.volume = 0.5;
    playBtn.addEventListener("click", handlePlayClick);
    jsVolumeBtn.addEventListener("click", handleVolumeClick);
    jsFullScreen.addEventListener("click", goFullScreen);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleDrag);
}

if (videoContainer) {
    init();
}