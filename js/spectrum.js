
function Spectrum() {
    var audioCtx;
    var source;
    var gainNode;
    var visualizerId;

    this.setElement = function(elem) {
        visualizerId = 'spectrum-canvas-' + Math.floor(1000000000 * Math.random());
        elem.insertAdjacentHTML('afterbegin', '<canvas id="' + visualizerId + '"></canvas>');
    }

    this.setVolume = function(vol) {
        gainNode.gain.value = vol;
    };

    this.setMedia = function(stream) {
        //var audio = document.querySelector('audio');
        // No necesito elemento <audio>
        // El AudioContext (audioCtx) ya emite el audio
        audioCtx = new AudioContext();
        source = audioCtx.createMediaStreamSource(stream);

        // Creo un gain
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 1;

        // Conecto el source al gain:  souce --> gain
        source.connect(gainNode);

        // analyser
        var analyser = getAnalyser();
        gainNode.connect(analyser);

        //// Conecto el gain a la salida del contexto: gain --> audioCtx.destination
        //gainNode.connect(audioCtx.destination);
        analyser.connect(audioCtx.destination);

        function getAnalyser() {
            ///////////////////////////////////////////////////////////////
            // Analyser
            var analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);

            var canvas = document.querySelector('#' + visualizerId);
            var WIDTH = canvas.width;
            var HEIGHT = canvas.height;
            var canvasCtx = canvas.getContext("2d");
            drawFrec();

            function draw() {

                drawVisual = requestAnimationFrame(draw);

                analyser.getByteTimeDomainData(dataArray);

                canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

                canvasCtx.beginPath();

                var sliceWidth = WIDTH * 1.0 / bufferLength;
                var x = 0;

                for(var i = 0; i < bufferLength; i++) {

                    var v = dataArray[i] / 128.0;
                    var y = v * HEIGHT/2;

                    if(i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(canvas.width, canvas.height/2);
                canvasCtx.stroke();
            };

            function drawFrec() {
                drawVisual = requestAnimationFrame(drawFrec);

                analyser.getByteFrequencyData(dataArray);

                canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                var barWidth = (WIDTH / bufferLength) * 2.5;
                var barHeight;
                var x = 0;

                for(var i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];

                    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                    canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

                    x += barWidth + 1;
                }
            };

            return analyser;
        }

    };
}

