/*global window, pf_js, document, jQuery*/
window.pf_js = window.pf_js || {};
pf_js.util = pf_js.util || {};

(function ($, window) {
    //apply strict mode
    "use strict";

    // Create the defaults once
    var defaults = {
        source: null,
        resize: null,
        lclass: "lightbox-img",
        imgAttr: "data-content",
        controls: "controls",
        contentsContainer: "lightbox-content",
        leftArrow : "lightbox-left-arrow",
        rightArrow : "lightbox-right-arrow",
        disabledArrow : "disabled-arrow",
        closeButton : "close-button",
        callbackContent : false,
        fadeInTime : 300,
        fadeOutTime: 300,
        percentageOfDisplayUsage: 80
    };

    pf_js.util.LightBox = function (options) {

        var settings = $.extend({}, defaults, options),
            //initial state
            current = 0,
            total = 0,
            //elements that will be displayed
            elements,
            //global elements
            body = $('body'),
            win = $(window),
            doc = $(document),
            overlay,
            container,
            controls,
            lightBoxContentsContainer,
            leftArrow,
            rightArrow,
            closeButton,

            //build the entire html structure
            setupLightBoxStructure = function () {
                body.append('<div id="lightbox" style="display:none;"></div>');
                overlay = $("#lightbox");

                body.append('<div id="lightbox-container" style="display:none;"></div>');
                container = $("#lightbox-container");

                container.append('<div class="controls"></div>');
                controls = $("." + settings.controls);

                container.append('<div class="lightbox-content"></div>');
                lightBoxContentsContainer = $("." + settings.contentsContainer);

                controls.append('<div class="' + settings.leftArrow + '"></div>');
                leftArrow = $("." + settings.leftArrow);
                controls.append('<div class="' + settings.rightArrow + '"></div>');
                rightArrow = $("." + settings.rightArrow);
                controls.append('<div class="' + settings.closeButton + '"></div>');
                closeButton = $("." + settings.closeButton);
            },

            insertContent = function (c) {
                var content = c;

                //reset container content and insert the new one
                container.css('display', 'none');
                lightBoxContentsContainer.html('');
                lightBoxContentsContainer.append(content);

                //Resizing lightbox
                container.fadeIn(settings.fadeInTime);
            },

            resolveContent = function () {
                var element,
                    content,
                    contentWidth,
                    contentHeight;

                if (settings.source) {

                    window.source(current);

                } else {

                    element         = $(elements.get(current));
                    contentWidth    = element.data('width');
                    contentWidth    = (contentWidth) ? 'width = "' + contentWidth + 'px"' : '';
                    contentHeight   = element.data('height');
                    contentHeight   = (contentHeight) ? 'height = "' + contentHeight + 'px"' : '';
                    content         = '<img src="' + element.data('content') + '" ' + contentWidth + ' ' + contentHeight + '/>';

                    insertContent(content);
                }
            },

            // function that resizes the image when the lightbox is in image class mode
            imgResize = function (w, h) {
                //gets the image dimensions
                var currentImg      = lightBoxContentsContainer.find('img'),
                    currentWidth    = currentImg.width(),
                    currentHeight   = currentImg.height(),

                    //calculates screen aspect ratio
                    screenAspectRatio = h / w,

                    //calculates image aspect ratio
                    imageAspectRatio = currentHeight / currentWidth,

                    //the new Height and Width
                    nextHeight,
                    nextWidth;

                //compares screen aspect ratio with image aspect ratio to decide if its better to adjusta by heigth or by width
                if (screenAspectRatio < imageAspectRatio) {
                    // if screen wider than image adjust by height 
                    nextHeight = h * (settings.percentageOfDisplayUsage / 100);
                    nextWidth  = currentWidth * (nextHeight / currentHeight);
                } else {
                    //if foto wider than screen adjust by height
                    nextWidth  = w * (settings.percentageOfDisplayUsage / 100);
                    nextHeight = currentHeight * (nextWidth / currentWidth);
                }

                //sets calculated height and width
                currentImg.height(nextHeight);
                currentImg.width(nextWidth);
            },

            resizeLightBox = function () {
                var windowWidth,
                    windowHeight,
                    screenWidth,
                    screenHeight,
                    contentWidth,
                    contentHeight,
                    contentTop,
                    contentLeft,
                    arrowsTop;

                //Gets body size including scroll size for overlay
                windowWidth = win.width();
                windowHeight = win.height();

                //Gets window size 
                screenWidth = win.width();
                screenHeight = win.height();

                if (settings.resize !== null) { // if there is an external resize function call it
                    settings.resize(screenWidth, screenHeight);
                } else {
                    if (!settings.source) { // if there is no source than content is image and will be resized by internal function
                        imgResize(screenWidth, screenHeight);
                    }
                }

                //Gets content size
                contentWidth    = container.width();
                contentHeight   = container.height();

                //Left and top of public
                contentTop  = (screenHeight - contentHeight) / 2;
                contentLeft = (screenWidth - contentWidth) / 2;
                arrowsTop   = (contentHeight - 46) / 2;

                //Apply all css during resize
                container.css({"top": contentTop, "left": contentLeft});
                overlay.css("height", windowHeight);

                leftArrow.css("top", arrowsTop);
                rightArrow.css("top", arrowsTop);
            },

            navigation = function () {
                resolveContent();
                resizeLightBox();

                leftArrow.removeClass(settings.disabledArrow);
                rightArrow.removeClass(settings.disabledArrow);

                if (current >= total - 1) {
                    rightArrow.addClass(settings.disabledArrow);
                }

                if ((current - 1) <= -1) {
                    leftArrow.addClass(settings.disabledArrow);
                }
            },

            //NAVIGATION
            navLeft = function () {
                if (current > 0) {
                    current -= 1;
                    navigation();
                }
            },

            navRight = function () {
                if (current < total - 1) {
                    current += 1;
                    navigation();
                }
            },

            showOverlay = function () {
                overlay
                    .fadeIn(settings.fadeInTime);
            },

            closeLightBox = function () {
                container
                    .fadeOut(settings.fadeOutTime)
                    .empty()
                    .detach();

                overlay
                    .fadeOut(settings.fadeOutTime)
                    .empty()
                    .detach();

                win.unbind('.lightbox');
            },

            //config buttons actions
            bindMethods = function () {

                //Configuring lightbox navigation
                rightArrow
                    .bind('click', navRight);

                leftArrow
                    .bind('click', navLeft);

                //Closing lightbox
                overlay
                    .bind('click', closeLightBox);

                doc.bind('keyup', function (e) {
                    if (e.keyCode === 27) {
                        closeLightBox();
                    }
                });

                closeButton.bind('click', closeLightBox);

            },

            openLightBox = function (image) {
                setupLightBoxStructure();
                bindMethods();

                //update current
                current = elements.index(image);

                showOverlay();
                navigation();
            },

            //setup the initial state and start the application
            initialConfig = function () {
                if (!settings.source) {

                    elements = $('.' + settings.lclass);

                    if (elements.length === 0) {
                        throw "no elements has " + settings.lclass + " class and there's no source method";
                    } else {
                        total = elements.length;
                    }
                }

               	win.bind('resize.lightbox', resizeLightBox);

            };

        return {
            init: function () {
                initialConfig();
            },
            open: function () {
                setupLightBoxStructure();
            },
            initializeContent: function (content) {
                insertContent(content);
            }
        };

    };

}(jQuery, window));