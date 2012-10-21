/*
 *  Project: Parafernalia Interativa Lightbox
 *  Description: 
 *  Author: Luiz Senna
 *  License: 
 *
 *
 *
 */
(function ( $, window ) {

    // Create the defaults once
    var defaults = 
    	{
            source: null,
            resize: null,
            lclass: "lightbox-img",
            img_attr: "data-content",
			left_arrow : "lightbox-left-arrow",
			right_arrow : "lightbox-right-arrow",
			disabled_arrow : "disabled-arrow",
			close_button : "close-button",
			callback_content : false,
        };
    
	var methods = 
	{
		init : function(options)
		{
			var scope = this;
		    var settings = $.extend({}, defaults, options);
		    var lb = this.vars;

			lb.current = 0;
			lb.total   = 0;

			lb.source 			    = settings.source;
			lb.resize				= settings.resize;
			lb.lclass  				= settings.lclass;
			lb.img_attr				= settings.img_attr;
			lb.left_arrow 		    = settings.left_arrow;
			lb.right_arrow 		    = settings.right_arrow;
			lb.disabled_arrow  		= settings.disabled_arrow;
			lb.close_bt 			= settings.close_button;
			lb.callback_content 	= settings.callback_content;


			if( !lb.source ){

				lb.elements=jQuery( '.' + lb.lclass );

				if( lb.elements.length==0 ){ 
					throw "no elements has " + lclass + " class and there's no source method"
				}

			}

		},

		open : function(options)
		{
		    var lb = this.vars;

		    var defaults = {
		            _current: lb.current,
					_total : lb.total
		        };

		    var settings = $.extend(defaults, options);
		    var scope = this;

			lb.total   = settings._total;
			lb.current = settings._current;
			//----------------------------
			//Adding HTML public
			//----------------------------
			jQuery("body").append('<div id="lightbox" style="display:none;"></div>');
			lb.overlay = jQuery("#lightbox");

			jQuery("body").append('<div id="lightbox-container" style="display:none;"></div>');
			lb.container = jQuery("#lightbox-container");
			
			lb.container.append('<div class="'+lb.left_arrow+'"></div>');
			lb.light_left_arrow = jQuery("."+lb.left_arrow);
					
			lb.container.append('<div class="'+lb.right_arrow+'"></div>');
			lb.light_right_arrow = jQuery("."+lb.right_arrow);
		
			lb.container.append('<div class="'+lb.close_bt+'"></div>');
			lb.close_button = jQuery("."+lb.close_bt);

			//Resizing lightbox
			resize.call(this)

			lb.overlay.fadeIn(500, function(){

				resolveContent( scope, lb );

			});

			//Configuring lightbox navigation
			lb.light_right_arrow.click(function() { 
				navRight.call(scope);
			});
			
			lb.light_left_arrow.click(function() { 
				navLeft.call(scope);
			});

			navigation.call(this);

			//Closing lightbox
			lb.overlay.click(function(){
				close.call(scope)
			});

			jQuery(document).keyup(function(e) {
				if (e.keyCode == 27) 
				{ 
					close.call(scope)
				}
			});
			
			lb.close_button.click(function(){
				close.call(scope)
			});

			jQuery(window).bind('resize.lightbox', function(){
				resize.call(scope)
			});
		},

		putContent : function(options)
		{
		    var defaults = {
		            c: "Default",
		        };

		    var settings = $.extend(defaults, options);
		    var lb = this.vars;
		    var scope = this;
		    
			lb.container.append('<div class="lbcontent">'+settings.c+'</div>');
			lb.content = jQuery("#lightbox-container .lbcontent");
			
			lb.content.show();
			lb.content.animate({ opacity: 0}, 0);
			//public.content.hide();

			resize.call(this);

			//Resizing lightbox
			lb.content.fadeIn("slow", function(){
				if(lb.callback_content)
				{
					lb.callback_content();				
				}
			});

			lb.content.animate({
				opacity: 1
			}, 'slow', function() {
			});		

			lb.container.fadeIn("slow");
		}	
	}
    // The actual plugin constructor
	$.fn.lightbox = function(arg0, arg1) 
	{
		if(!this.vars)
		{
			this.vars = new Object();
		}

		//check if first argument is a string. if so, it calls the method named in arg0
		if (typeof arguments[0] === 'string'){
			//check if it's a valid method
			if (methods[arguments[0]]){
	  			//check if two arguments are passed. if so, evaluate the second argument
		  		if(arguments.length >= 2){
		  			//check if second argument is an object. if so, call the method with custom options
		  			if( typeof arguments[1] === 'object') {
		  				return methods[arg0].apply(this, [arg1]);
		  			} else { 
						//if second argument is NOT an object, write error in console's log.
		  				$.error("Error in second argument. It must be a valid object.");  
		  				}
		  			
		  		} else {
		  			return methods[arg0].call(this);
		  			}
			} else {
				$.error("Error in first argument. Invalid arg0.");
			}
		}
		//check if only one argument is being passed and if it's an object. if so, evaluate as custom options and call init.
		else if (typeof arguments[0] === 'object' && arguments.length == 1)
		{
		return methods["init"].apply(this,[arg0]);			
		}
		//check if there isn't arguments being passed. if so, call init with default options
		else if(arguments.length == 0)
		{
			return methods["init"].apply(this,[defaults]);
		}
		else
		{
			$.error("An error has occurred while instantiating Lightbox. Verify your arguments.");
		}
	}

	var resolveContent = function( scope, lb ){

		var element, content, cwidth, cheight;

		if( lb.source ){

			lb.source(lb.current);

		} else { 

			element = $( lb.elements.get( lb.current ) );
			cwidth = element.attr('data-width');
			cwidth = (cwidth) ? 'width = "' + cwidth + 'px"':'';
			cheight = element.attr('data-height');
			cheight = (cheight) ? 'height = "' + cheight + 'px"':'';
			content = '<img src="' + element.attr('data-content') +'" ' + cwidth + ' ' + cheight + '/>';
			methods['putContent'].apply( scope, [{c:content}] );
			
		}

	}

    var navLeft = function() 
    {
    	var lb = this.vars;

		if (lb.current > 0) 
		{
			lb.current--;
			lb.content.fadeOut('slow').empty().detach();
			navigation.call(this);
			resolveContent( this, lb );
		}
    }

    var navRight = function() 
    {
    	var lb = this.vars;

		if (lb.current < lb.total-1) 
		{
			lb.current++;
			lb.content.fadeOut('slow').empty().detach();
			navigation.call(this);
			resolveContent( this, lb );
		}
    }

	var navigation = function() 
	{
		var lb = this.vars;
		
		lb.light_left_arrow.removeClass(lb.disabled_arrow);
		lb.light_right_arrow.removeClass(lb.disabled_arrow);

		if ( lb.current >= lb.total-1 ) 
		{
			lb.light_right_arrow.addClass(lb.disabled_arrow);
		}

		if ((lb.current-1) <= -1) 
		{
			lb.light_left_arrow.addClass(lb.disabled_arrow);
		}

	}

	// function that resizes the image when the lightbox is in image class mode
	var imgResize = function( w, h ){
					//this function runs on the scope of the lightbox content container
					
					//gets the image dimensions
					var currentimg=jQuery(this).children('img');
					var currentwidth=currentimg.width();
					var currentheight=currentimg.height();
					
					//calculates screen aspect ratio
					var sar=h/w;
					//calculates image aspect ratio
					var far=currentheight/currentwidth;
					
					//compares screen aspect ratio with image aspect ratio to decide if its better to adjusta by heigth or by width
					if( sar < far ){ 
						// if screen wider than image adjust by height 
						var nextheight=h*0.8;
						var nextwidth=currentwidth*(nextheight/currentheight);
					}else {
						//if foto wider than screen adjust by height
						var nextwidth=w*0.8;
						var nextheight=currentheight*(nextwidth/currentwidth);
					}
					
					//sets calculated height and width
					currentimg.height(nextheight);
					currentimg.width(nextwidth);
				
				}

	var resize = function()
	{
			var window_width, window_height, screen_width, screen_height;
			var lightbox_content_width, lightbox_content_height;
			var lightbox_content_top, lightbox_content_left, lightbox_arrows_top;
			var lb = this.vars;

			//Gets body size including scroll size for overlay
			window_width = jQuery(window).width();
			window_height = jQuery(window).height();

			//Gets window size 
			screen_width = jQuery(window).width();
			screen_height = jQuery(window).height();
			
			if( lb.resize!=null ){ // if there is an external resize function call it
				lb.resize.call(lb.content, screen_width, screen_height );
			} else {

				if( !lb.source ){ // if there is no source than content is image and will be resized by internal function

					imgResize.call(lb.content, screen_width, screen_height );

				}
			}

			//Gets content size
			lightbox_content_width = lb.container.width();
			lightbox_content_height = lb.container.height();

			//Left and top of public
			lightbox_content_top = (screen_height - lightbox_content_height)/2;
			lightbox_content_left = (screen_width - lightbox_content_width)/2;
			lightbox_arrows_top = (lightbox_content_height - 46) / 2

			//Apply all css during resize
			lb.container.css({"top":lightbox_content_top, "left":lightbox_content_left});
			lb.overlay.css("height", window_height);
			
			jQuery("."+lb.left_arrow).css("top", lightbox_arrows_top);
			jQuery("."+lb.right_arrow).css("top", lightbox_arrows_top);
	}

	//closes the lighbox
	var close = function() 
	{
		var lb = this.vars;
		lb.container.fadeOut('slow').empty().detach();
		lb.overlay.fadeOut('slow').empty().detach();
		jQuery(window).unbind('.lightbox');
	}	

}(jQuery, window));