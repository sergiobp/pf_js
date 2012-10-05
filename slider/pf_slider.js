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

    // settings default
    var defaults = 
    	{ 
			"single_width" : 100,
			"single_margin" : 0,
			"arrow_left_class" : ".arrow.left",
			"arrow_right_class" : ".arrow.right",
			"arrow_off_class":"off",
			"paginator" : false,
			"auto_slide":false,
			"auto_time":1000
        };

    //slider DOM elements
    var parent, 
    	frame, 
    	itens, 
    	leftArrow, 
    	rightArrow;

    //status of the slider
    var currentSlide=0, // the item that is currrent on display
    	sizeItem, // width of one item
    	leftEnd, 
    	totalWidth, // sum of width of all itens, including margins
    	transBlock; //flag to block interaction during transitions

    //classes
    var arrowOffClass;

    //automatic sliding
    var autoTimer, autoSlide, autoTime;
    
	var methods = 
	{
		init : function(options)
		{
			var scope = this;
		    var settings = $.extend({}, defaults, options);
		    var sl = this.vars;
	
			sl.single_width  	 = settings.single_width;
			sl.single_margin 	 = settings.single_margin;
			leftArrow_class  = settings.arrow_left_class;
			rightArrow_class = settings.arrow_right_class;
			arrowOffClass = settings.arrow_off_class;
			autoSlide = settings.auto_slide;
			autoTime = settings.auto_time;

			parent 			= this;
			frame 			= parent.find('ul');
			itens 			= frame.find('li');
			sl.single_width = itens.first().width();
			sl.total 		= itens.size();
			leftArrow 	= jQuery(leftArrow_class);
			rightArrow 	= jQuery(rightArrow_class);
			
			sizeItem = sl.single_width + sl.single_margin;
			currentSlide = 1;
			leftEnd = 0;

			//calculate the total width of the ul
			totalWidth	= (sl.single_width* sl.total) + (sl.single_margin * (sl.total - 1));

			//have to add single margin because the last element break's into second line when it's margin is supressed.
			frame.width(totalWidth);

			if( totalWidth <= this.width() )
			{
				leftArrow.hide();
				rightArrow.hide();
				return
			}


			updateNavigation.call(this);

			//if auto_slide=true initiate automatic sliding
			if( autoSlide ){

				autoTimer = setInterval( autoSliding, autoTime )

			}

			leftArrow.click(function(){
				if(currentSlide>1 && !transBlock ){
					clearInterval( autoTimer );
					transBlock=true
					currentSlide--;
					leftEnd = sizeItem * (currentSlide - 1);
					frame.animate({left:'-'+leftEnd}, { duration:1500, easing:"easeInOutCubic", complete:function(){ updateNavigation(); transBlock=false; }});
					}
			});

			rightArrow.click(function(){
				if( ( ( frame.position().left + totalWidth ) >  parent.width() ) && !transBlock ){
					clearInterval( autoTimer );
					transBlock=true;
					leftEnd = sizeItem * currentSlide;
					frame.animate({left:'-'+leftEnd}, { duration:1500, easing:"easeInOutCubic", complete:function(){ updateNavigation(); transBlock=false; }});
					currentSlide++;
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
			
			rightArrow.removeClass(arrowOffClass);	
			leftArrow.removeClass(arrowOffClass);
			
			if( frame.position().left == 0)
			{ //slider is all to the left and we must disable left click
				leftArrow.addClass(arrowOffClass);				
			}
			
			
			if( ( frame.position().left + totalWidth ) <= ( parent.width() ) )
			{ //slider is all to the right 
				rightArrow.addClass(arrowOffClass);
			}
		}

	var autoSliding = function(){

		var firstItemCopy;

		if( !transBlock ){

			if( (( frame.position().left + totalWidth ) >  parent.width()) )
					{	
						transBlock = true;
						leftEnd = sizeItem * currentSlide;
						frame.animate({left:'-'+leftEnd}, { duration:1500, easing:"easeInOutCubic" , complete:function(){ updateNavigation();
							transBlock = false;
						 }});
						currentSlide++;

					} else {
						transBlock = true;
						// to go back to first element slider goes
						firstItemCopy = jQuery( itens[0] ).clone();
						frame.append( firstItemCopy );
						frame.width( totalWidth + sizeItem );
						leftEnd=totalWidth;
						frame.animate({left:'-'+leftEnd}, { duration:1500, easing:"easeInOutCubic", complete:function(){ 
							frame.css('left',0);
							parent.find('li').last().remove();
							frame.width( totalWidth );
							updateNavigation();
							transBlock = false;
							 }});
						currentSlide = 1 ;

					}
		}

		

	}   

}(jQuery, window));