(function() {
    'use strict';

    window.onload = function() {
        var sptr = new Spectrum();

        sptr.setElement(document.querySelector('#spectrum1'));


        navigator.getMedia (
            { video: true, audio: true },
            function(stream) {
                sptr.setMedia(stream);
            },
            function(err) {
                console.log("Error: " + err);
            }
        );

        var muteBtn = document.querySelector('#muteBtn');
        var unmuteBtn = document.querySelector('#unmuteBtn');

        muteBtn.onclick = function() {
            sptr.setVolume(0);
        };
        unmuteBtn.onclick = function() {
            sptr.setVolume(1);
        };
    };


})();
