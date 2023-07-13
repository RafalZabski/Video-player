// funkcja która odrazu się wywoła po załadowaniu pliku js
(function(window,document){

    const video = document.getElementById("video");
    const playPauseButton = document.getElementById("play-pause");
    const progressInput = document.getElementById("progress-input");
    const videoProgress = document.getElementById("video-progress");
    const muteButton = document.getElementById("mute");
    const fullScreenButton = document.getElementById("fullscreen");
    const forwardButton = document.getElementById("move-movie-forwards");
    const backwardButton = document.getElementById("move-movie-backwards");

    //uzyskanie wartości false z wartości undefined

    const fullScreenSupported = !!document.fullscreenEnabled;
 
 //Przycisk play   
        function playPauseClicked(){

            if(video.paused){
                video.play();
            }else{
                video.pause();
            }

        }
//Przycisk zapauzowania filmu
        function updatePlayPauseIcon(){


            if(video.paused){
                playPauseButton.innerHTML = '<i class = "fa fa-play"></i>';
            }else{
                playPauseButton.innerHTML = '<i class = "fa fa-pause"></i>';
            }


        }

        //Przesuwanie czasu co kilka sekund

        function moveVideoForwards(){
            if(video.currentTime>video.duration)return;
            video.currentTime+=5;
        };
        function moveVideoBackwards(){
            if(video.currentTime<0)return;
            video.currentTime-=5;
        };

// Wyświetlanie czasu odtwarzania
        function updateVideoProgress(){

            progressInput.value = (video.currentTime/video.duration)*100;

            let minutes  = Math.floor(video.currentTime/60);
                if(minutes<10) minutes = "0"+minutes;
            let seconds  = Math.floor(video.currentTime % 60);
                if(seconds<10) seconds = "0"+seconds;
            let hours = Math.floor(video.currentTime/3600);
            if(hours<10) hours = "0"+hours;
            let filmTimeHours = Math.floor(video.duration/3600);
            let filmTimeMinutes = Math.floor(video.duration/60);
            let filmTimeSeconds = Math.floor(video.duration%60);
            let finalFilmTime = `${filmTimeHours}:${filmTimeMinutes}:${filmTimeSeconds}`

            videoProgress.innerHTML = `${hours}:${minutes}:${seconds}/${finalFilmTime}`

        }
// Przesunięcie filmiku suwakiem
        function seekVideo(){

            let seekToTime = (progressInput.value*video.duration)/100;

            if(seekToTime<0||seekToTime>video.duration)return;

            video.pause();

            video.currentTime = seekToTime;

            let timer = setInterval(function(){

                //video.readyState==4 określa maksymalny zasób danych do odtworzenia wideo

                if(video.paused && video.readyState ==4){
                    video.play();
                    clearInterval(timer);
                };

            },100);

            console.log("seekVideo"+seekToTime);


        }

// Przycisk wyciszenia dźwięku
        function muteButtonClicked(){
            
            video.muted = !video.muted;

            if(video.muted){
                muteButton.innerHTML = '<i class="fa fa-volume-mute"></i>';
            }else{

                muteButton.innerHTML = '<i class="fa fa-volume-up"></i>';

            }


        }

        function handleFullScreen(){
            if(!fullScreenSupported)return;

            if(!document.fullscreenElement){
                document.documentElement.requestFullscreen();
                fullScreenButton.innerHTML = '<i class="fa fa-compress"></i>'
            }else{
                document.exitFullscreen();
                fullScreenButton.innerHTML = '<i class="fa fa-expand"></i>';
            }

            if(fullScreenSupported){
                let video = document.getElementById("video");
                let controls = document.getElementById("controls");
                let slider = document.getElementById("progress-input");
                slider.style.display = "none";
                controls.style.display = "none";
                video.style.height = "100vh";}
        }

           



        function keyDown(e){

    
            switch(e.keyCode){
    
                case 37://left
                case 65://a
                    moveVideoBackwards()
                    break;
    
                case 39://right
                case 68://d
                    moveVideoForwards()
                    break;
                case 32://space
                    playPauseClicked();
                    break;
                case 27://escape fullscreen
                    let video = document.getElementById("video");
                    let controls = document.getElementById("controls");
                    let slider = document.getElementById("progress-input");
                    slider.style.display = "block";
                    controls.style.display = "block";
                    video.style.height = "93vh";
                    break;
    
            };
    
        }

    function init(){

            video.controls = false;

            playPauseButton.addEventListener("click",playPauseClicked);
            muteButton.addEventListener("click",muteButtonClicked);
            forwardButton.addEventListener("click",moveVideoForwards);
            backwardButton.addEventListener("click",moveVideoBackwards);
            video.addEventListener("play",updatePlayPauseIcon);
            video.addEventListener("pause",updatePlayPauseIcon);
            video.addEventListener("timeupdate",updateVideoProgress);
            progressInput.addEventListener("change",seekVideo);
            document.addEventListener("keydown",keyDown);
           

            if(fullScreenSupported){
                fullScreenButton.addEventListener("click",handleFullScreen);
            }else{
                //wyłączenie przycisku gdy nie jest dostępne fullscreen api
                fullScreenButton.style.display="none";
            }
            
            //restartuje suwak czasu filmu na 0 w momencie przeładowania strony
            function restartRangeBar(){
                if(progressInput.value!=0){
                    progressInput.value = 0;
                }
            };

            restartRangeBar();

            console.log("start");
        }


        window.onload = init;


    

})(window, document)