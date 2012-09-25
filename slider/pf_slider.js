/*
 *  Project: pf_slider
 *  Description: multi use horizontal slider jquery plugin
 *  Author: Luiz Senna
 *  License: 
 
 * todo list
 * > slider assumes every item is of same width
 * > slider itens resize when slider resizes
 * > navigation indicator
 # > easing on the animation
 * > use css animation to fade the disabled arrows
 * > touch swipe
 * > layout das setas
 */
 
 
(function ( $, window, undefined ) {

    // Create the defaults once
    var defaults = 
    	{ 
			"single_width" : 100,
			"single_margin" : 0,
			"arrow_left_class" : ".arrow.left",
			"arrow_right_class" : ".arrow.right",
			"arrow_off_class":"off",
			"paginator" : false
        };
    
	var methods = 
	{
		init : function(options)
		{
			var scope = this;
		    var settings = $.extend({}, defaults, options);
		    var sl = this.vars;
	
			sl.single_width  	 = settings.single_width;
			sl.single_margin 	 = settings.single_margin;
			sl.arrow_left_class  = settings.arrow_left_class
			sl.arrow_right_class = settings.arrow_right_class
			sl.arrow_off_class = settings.arrow_off_class

			sl.parent 		= this;
			sl.frame 		= sl.parent.find('ul');
			sl.itens 		= sl.frame.find('li');
			sl.single_width = sl.itens.first().width();
			sl.total 		= sl.itens.size();
			sl.arrow_left 	= jQuery(sl.arrow_left_class);
			sl.arrow_right 	= jQuery(sl.arrow_right_class);
			
			sl.size = sl.single_width + sl.single_margin;
			sl.current = 1;
			sl.left_end = 0;

			//calculate the total width of the ul
			sl.totalWidth	= (sl.single_width* sl.total) + (sl.single_margin * (sl.total - 1));

			//have to add single margin because the last element break's into second line when it's margin is supressed.
			sl.frame.width(sl.totalWidth);

			if(sl.totalWidth <= this.width())
			{
				sl.arrow_left.hide();
				sl.arrow_right.hide();
				return
			}


			updateNavigation.call(this);

			sl.arrow_left.click(function(){
				if(sl.current>1 && !sl.block ){
					sl.block=true
					sl.current--;
					sl.left_end = sl.size * (sl.current - 1);
					sl.frame.animate({left:'-'+sl.left_end}, {speed:"slow", complete:function(){ updateNavigation.call(scope); sl.block=false; }});
					}
			});

			sl.arrow_right.click(function(){
				if( ( ( sl.frame.position().left + sl.totalWidth ) >  sl.parent.width() ) && !sl.block )
				{
					sl.block=true;
					sl.left_end = sl.size * sl.current;
					sl.frame.animate({left:'-'+sl.left_end}, {speed:"slow", complete:function(){ updateNavigation.call(scope); sl.block=false; }});
					sl.current++;
				}

			}); 
		},

	}

    // The actual plugin constructor
	$.fn.slider = function(arg0, arg1) 
	{
		if(!this.vars)
		{
			this.vars = new Object();
		}

		//check if first argument is a string. if so, it calls the method named in arg0
		if (typeof arguments[0] === 'string')
		{
			//check if it's a valid method
			if (methods[arguments[0]])
			{
	  		//check if two arguments are passed. if so, evaluate the second argument
	  		if(arguments.length >= 2)
	  		{
	  			//check if second argument is an object. if so, call the method with custom options
	  			if( typeof arguments[1] === 'object')
	  			{
	  				return methods[arg0].apply(this, [arg1]);
	  			}
	  			//if second argument is NOT an object, write error in console.
	  			else
	  			{
	  				$.error("Error in second argument. It must be a valid object.");    				
	  			}
	  		}
	  		else
	  		{
	  			return methods[arg0].call(this);
	  		}
			}
			else
			{
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
        
	var updateNavigation = function() {
	
			var sl = this.vars;
			var scope = this;
			
			sl.arrow_right.removeClass(sl.arrow_off_class);	
			sl.arrow_left.removeClass(sl.arrow_off_class);
			
			if(sl.frame.position().left == 0)
			{ //slider is all to the left and we must disable left click
				sl.arrow_left.addClass(sl.arrow_off_class);				
			}
			
			
			if( ( sl.frame.position().left + sl.totalWidth ) <= ( sl.parent.width() ) )
			{ //slider is all to the right 
				sl.arrow_right.addClass(sl.arrow_off_class);
			}
		}   

}(jQuery, window));