(function() {

    'use strict';

    window || (window = {});
    window.Core || (window.Core = {});
    window.Core.CaptureImage = (window.Core.CaptureImage = {});

    function CaptureImage(videoElement, imageElement, options) {
        this.videoElement = videoElement;
        this.imageElement = imageElement;
        this.defaults = {
            width: 200,
            height: 200,
        };
        this.options = this.setOptions(this.defaults, options);
    };

    CaptureImage.prototype.init = function() {
        if (!this.isAllowed())
            return this.errorHandler("Media stream is not supported");

        if (typeof this.videoElement === 'string')
            this.videoElement = document.getElementById(this.videoElement);

        if (typeof this.imageElement === 'string')
            this.imageElement = document.getElementById(this.imageElement);

        this.videoElement.style.width = this.options.width + 'px';
        this.videoElement.style.height = this.options.height + 'px';
        this.start();
    };

    CaptureImage.prototype.start = function() {
        this.getNavigatorApi().call(navigator, {
            video: true
        }, this.mediaStreamHandler.bind(this), this.errorHandler);
    };

    CaptureImage.prototype.mediaStreamHandler = function(stream) {
        var vendorURL = window.URL || window.webkitURL;
        this.videoElement.src = vendorURL.createObjectURL(stream);
    }

    CaptureImage.prototype.capture = function() {
        var canvas = document.createElement('canvas');
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        canvas.getContext('2d').drawImage(this.videoElement, 0, 0, this.options.width, this.options.height);
        if (this.imageElement) {
            canvas.toDataURL("image/png");
            this.imageElement.appendChild(canvas);
        }
        return canvas;
    };

    CaptureImage.prototype.errorHandler = function(message) {
        console.error(message);
    };

    CaptureImage.prototype.getNavigatorApi = function() {
        return (navigator.getUserMedia || navigator.webkitGetUserMedia);
    };

    CaptureImage.prototype.isAllowed = function() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia);
    };

    CaptureImage.prototype.setOptions = function(defaults, options) {
        for (var optionsProp in options) {
            var optionsVal = options[optionsProp];
            if (optionsVal && Object.prototype.toString.call(optionsVal) === "[object Object]") {
                defaults[optionsProp] = defaults[optionsProp] || {};
                this.setOptions(defaults[optionsProp], optionsVal);
            } else {
                defaults[optionsProp] = optionsVal;
            }
        }
        return defaults;
    };

    // var app = new CaptureImage('media', 'capture');
    // app.init();

    // setInterval(function() {
    //     app.capture();
    // }, 3000)

})();
