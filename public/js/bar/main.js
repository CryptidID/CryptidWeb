/*!
 * WebCodeCamJS 2.0.0 javascript Bar code and QR code decoder
 * Author: Tóth András
 * Web: http://atandrastoth.co.uk
 * email: atandrastoth@gmail.com
 * Licensed under the MIT license
 */
(function(undefined) {
    'use strict';

    function Q(el) {
        if (typeof el === 'string') {
            var els = document.querySelectorAll(el);
            return typeof els === 'undefined' ? undefined : els.length > 1 ? els : els[0];
        }
        return el;
    }
    var txt = "innerText" in HTMLElement.prototype ? "innerText" : "textContent";
    var scannerLaser = Q(".scanner-laser"),
        imageUrl = new Q("#image-url"),
        play = Q("#play"),
        scannedImg = Q("#scanned-img"),
        scannedQR = Q("#scanned-QR"),
        grabImg = Q("#grab-img"),
        decodeLocal = Q("#decode-img"),
        pause = Q("#pause"),
        stop = Q("#stop"),
        contrast = Q("#contrast"),
        contrastValue = Q("#contrast-value"),
        zoom = Q("#zoom"),
        zoomValue = Q("#zoom-value"),
        brightness = Q("#brightness"),
        brightnessValue = Q("#brightness-value"),
        threshold = Q("#threshold"),
        thresholdValue = Q("#threshold-value"),
        sharpness = Q("#sharpness"),
        sharpnessValue = Q("#sharpness-value"),
        grayscale = Q("#grayscale"),
        grayscaleValue = Q("#grayscale-value"),
        flipVertical = Q("#flipVertical"),
        flipVerticalValue = Q("#flipVertical-value"),
        flipHorizontal = Q("#flipHorizontal"),
        flipHorizontalValue = Q("#flipHorizontal-value");
    var args = {
        autoBrightnessValue: 100,
        resultFunction: function(res) {
            [].forEach.call(scannerLaser, function(el) {
                fadeOut(el, 0.5);
                setTimeout(function() {
                    fadeIn(el, 0.5);
                }, 300);
            });
            scannedImg.src = res.imgData;
            scannedQR[txt] = res.format + ': ' + res.code;
        },
        getDevicesError: function(error) {
            var p, message = "Error detected with the following parameters:\n";
            for (p in error) {
                message += p + ": " + error[p] + "\n";
            }
            // alert(message);
        },
        getUserMediaError: function(error) {
            var p, message = "Error detected with the following parameters:\n";
            for (p in error) {
                message += p + ": " + error[p] + "\n";
            }
            // alert(message);
        },
        cameraError: function(error) {
            var p, message = "Error detected with the following parameters:\n";
            for (p in error) {
                message += p + ": " + error[p] + "\n";
            }
            // alert(message);
        },
        cameraSuccess: function() {
            grabImg.classList.remove("disabled");
        }
    };
    var decoder = new WebCodeCamJS("#webcodecam-canvas");
    decoder.buildSelectMenu("#camera-select").init(args);
    // decodeLocal.addEventListener("click", function() {
    //     Page.decodeLocalImage();
    // }, false);
    play.addEventListener("click", function() {
        if (!decoder.isInitialized()) {
            scannedQR[txt] = "Scanning ...";
        } else {
            scannedQR[txt] = "Scanning ...";
            decoder.play();
        }
        $('#webcodecam-canvas').show();
        $('.fixed-top-center').show();
        $('#webcodecam-canvas').toggleClass("show-fullscreen");
    }, false);
    document.querySelector('#camera-select').addEventListener('change', function() {
        if (decoder.isInitialized()) {
            decoder.stop().play();
        }
    });
}).call(window.Page = window.Page || {});

$(function() {
    $('#verify-submit').click(function() {
        alert("clicked");
        $.getJSON("http://localhost:50404/api/candidate/GetCandidateFromChain/" + $('#chainIDBase64').val() + "/"+ $('#verify-id-form input[type="password"]').val() +"/", function( data ) {
            alert(data.Uid);
        });
    });
});
