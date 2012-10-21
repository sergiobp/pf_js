window.pf_js = window.pf_js || {};
pf_js.util = pf_js.util || {};

(function($, window) {

	// Create the defaults once
    var defaults = 
	{
        source: null,
        resize: null,
        lclass: "lightbox-img",
        imgAttr: "data-content",
		leftArrow : "lightbox-left-arrow",
		rightArrow : "lightbox-right-arrow",
		disabledArrow : "disabled-arrow",
		closeButton : "close-button",
		callbackContent : false,
		fadeInTime : 300,
		fadeOutTime: 300,
		percentageOfDisplayUsage: 80
    };

	pf_js.util.LightBox = function(options) {

	    var settings = $.extend({}, defaults, options);

	    //initial state
	    var current = 0,
	    total = 0;

	    //elements that will be displayed
	    var elements;

	    //global elements
	   	var body = $('body'),
	   	win = window,
		doc = $(document),
	   	overlay,
	   	container,
	   	leftArrow,
	   	rightArrow,
	   	closeButton;


	    //setup the initial state and start the application
		var initialConfig = function() {
			if(!settings.source){

				elements = $('.' + settings.lclass);

				if(elements.length == 0){ 
					throw "no elements has " + settings.lclass + " class and there's no source method"
				}
			}
		};

		//build the entire html structure
		var setupLightBoxStructure = function() {
			body.append('<div id="lightbox" style="display:none;"></div>');
			overlay = $("#lightbox");

			body.append('<div id="lightbox-container" style="display:none;"></div>');
			container = $("#lightbox-container");
			
			container.append('<div class="' + settings.leftArrow + '"></div>');
			leftArrow = $("." + settings.left_arrow);
					
			container.append('<div class="' + settings.rightArrow + '"></div>');
			rightArrow = $("." + settings.rightArrow);
		
			container.append('<div class="' + settings.closeButton + '"></div>');
			closeButton = $("." + settings.closeButton);

			startMethodsBind();
		};

		//config buttons actions
		var startMethodsBind = function() {

			overlay
				.fadeIn(500, resolveContent);

			//Configuring lightbox navigation
			rightArrow
				.bind('click', navRight);
			
			leftArrow
				.bind('click', navLeft);

			navigation(this);

			//Closing lightbox
			overlay
				.bind('click', closeLightBox);

			doc.bind('keyup', function(e) {
				if (e.keyCode == 27) 
				{ 
					closeLightBox();
				}
			});
			
			closeButton.bind('click', closeLightBox);

			win.bind('resize.lightbox', resize);

			resize();
		};

		var resolveContent = function() {
			var element, content, contentWidth, contentHeight;

			if( settings.source ){

				source(current);

			} else { 

				element 		= $(elements.get(current));
				contentWidth 	= element.data('width');
				contentWidth 	= (contentWidth) ? 'width = "' + contentWidth + 'px"':'';
				contentHeight 	= element.data('height');
				contentHeight 	= (contentHeight) ? 'height = "' + contentHeight + 'px"':'';
				content 		= '<img src="' + element.data('content') +'" ' + contentWidth + ' ' + contentHeight + '/>';

				insertContent(content);
			}
		};

		var insertContent = function(c) {
			var content = c;
		    
		    //reset container content and insert the new one
		    container.css('opacity', 0);
		    container.html('');
			container.append(content);

			resize();

			//Resizing lightbox
			container.fadeIn(settings.fadeInTime);
		};


		//NAVIGATION
		var navLeft = function() 
	    {
			if (current > 0) 
			{
				current--;
				navigation();
			}
	    };

	    var navRight = function() 
	    {
			if (current < total - 1) 
			{
				lb.current++;
				navigation();
			}
	    };

		var navigation = function() 
		{
			resolveContent();
			
			leftArrow.removeClass(disabledArrow);
			rightArrow.removeClass(disabledArrow);

			if (current >= total - 1) 
			{
				lb.light_right_arrow.addClass(disabledArrow);
			}

			if ((current - 1) <= - 1) 
			{
				leftArrow.addClass(disabledArrow);
			}
		};


		// function that resizes the image when the lightbox is in image class mode
		var imgResize = function( w, h ){
			//gets the image dimensions
			var currentImg 		= container.children('img');
			var currentWidth 	= currentImg.width();
			var currentHeight 	= currentImg.height();
			
			//calculates screen aspect ratio
			var screenAspectRatio = h / w;

			//calculates image aspect ratio
			var imageAspectRatio = currentHeight / currentWidth;

			//the new Height and Width
			var nextHeight, nextWidth;

			//compares screen aspect ratio with image aspect ratio to decide if its better to adjusta by heigth or by width
			if(screenAspectRatio < imageAspectRatio){ 
				// if screen wider than image adjust by height 
				nextHeight = h * (settings.percentageOfDisplayUsage / 100);
				nextWidth  = currentWidth * (nextHeight / currentHeight);
			}else {
				//if foto wider than screen adjust by height
				nextWidth  = w * (settings.percentageOfDisplayUsage / 100);
				nextheight = currentHeight * (nextwidth / currentWidth);
			}
			
			//sets calculated height and width
			currentImg.height(nextheight);
			currentImg.width(nextWidth);
		};


		var resizeLightBox = function() {
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
			
			if(resize != null){ // if there is an external resize function call it
				resize.(content, screenWidth, screenHeight);
			} else {
				if(settings.source){ // if there is no source than content is image and will be resized by internal function
					imgResize.(content, screenWidth, screenHeight);
				}
			}

			//Gets content size
			contentWidth 	= container.width();
			contentHeight 	= container.height();

			//Left and top of public
			contentTop 	= (screenHeight - contentHeight) / 2;
			contentLeft = (screenWidth - contentWidth) / 2;
			arrowsTop 	= (contentHeight - 46) / 2;

			//Apply all css during resize
			container.css({"top": contentTop, "left": contentLeft});
			overlay.css("height", windowHeight);
			
			leftArrow.css("top", arrowsTop);
			rightArrow.css("top", arrowsTop);
		};

		var closeLightBox = function() {
			container
				.fadeOut(settings.fadeOutTime)
				.empty()
				.detach();

			overlay
				.fadeOut(settings.fadeOutTime)
				.empty()
				.detach();

			win.unbind('.lightbox');
		};

		return {
			init: function() {
				initialConfig();
			},
			open: function() {
				setupLightBoxStructure();
			},
			initializeContent: function(content) {
				insertContent(content);
			}
		}

	};

}(jQuery, window));