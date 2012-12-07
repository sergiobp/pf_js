	/*
 *  Project: pf_slider
 *  Description: multi use horizontal slider jquery plugin
 *  Author: Luiz Senna
 *  License: 
 
 * todo list
 * > slider assumes every item is of same width
 * > slider itens resize when slider resizes
 * > touch swipe
 * > layout das setas
 */
 
window.pf_js = window.pf_js || {};


(function($) {

	// the constructor receives the id of the root element of the slider and an optons object
	pf_js.slider = function ( root, options ) {

	    //slider DOM elements
	    var parent, 
	    	frame, 
	    	itens, 
	    	leftArrow, 
	    	rightArrow,
	    	paginator,
	    	pageCtrls,

	    //slider dimensions
	    	slideWidth,
	    	totalWidth,

	    //status of the slider
	        currentSlide=0, // the item that is currrent on display 
	    	totalWidth, // sum of width of all itens, including margins
	    	transBlock, //flag to block interaction during transitions
	    	savedPosition, //gets the position whre the user left the slider last time it was used

	    // paginator elements
	        paginate, // true if slider has a paginator
	    	paginator, // the paginator html element
	    	pageCtrls, // buttons to paginate. one por each item.
	    	pageCtrlActiveClass = 'active', // class that mark a pageCtrl as active. its a constant

	    //classes
	        arrowOffClass,
	    	leftArrowClass,
			rightArrowClass,

	    //automatic sliding
	        autoTimer, autoSlide, autoTime,

	    // settings default
	    	defaults = {
		    	"maskSelector": ".pfMask",
				"arrow_left_class" : ".arrow.left",
				"arrow_right_class" : ".arrow.right",
				"arrow_off_class":"off",
				"paginate" : false,
				"auto_slide":false,
				"auto_time":1000,
				"pageSlide":false,
				"mantainPosition":false
	    };


	    // add pages controls to the paginator
		function addPage( index ){
			index++;
			paginator.append( '<div class="page-ctrl" data-page="' + index.toString() + '" ></div>' )
		};

		// responds to a click in the paginator
		function gotoPage(){

			var whereTo = $( this ).attr( 'data-page' );

			if( !transBlock ){

				pageCtrls.removeClass( 'active' );
				$( this ).addClass( 'active' );

				clearInterval( autoTimer );
				transBlock=true
				currentSlide = whereTo;
				leftEnd = slideWidth * (currentSlide - 1);
				frame.animate({left:'-'+leftEnd}, { duration:1500, easing:"easeInOutCubic", complete:function(){ updateNavigation(); transBlock=false; }});
				
			}

		};
	        
	    // adjusts the view of arrows and paginator controls after moving the slider
		var updateNavigation = function() {
				
			//clear arrows display view state
			rightArrow.removeClass(arrowOffClass);	
			leftArrow.removeClass(arrowOffClass);

			if ( paginate ) {
				//clear paginator view state
				pageCtrls.removeClass( pageCtrlActiveClass );
				// adjusts page controls currents view state
				$( pageCtrls[ currentSlide-1 ] ).addClass( pageCtrlActiveClass );
			}
			
			if( frame.position().left == 0) { //slider is all to the left and we must disable left click
				leftArrow.addClass(arrowOffClass);				
			}
			
			
			if( ( frame.position().left + totalWidth ) <= ( mask.width() ) ) { //slider is all to the right 
				rightArrow.addClass(arrowOffClass);
			}

			sessionStorage.setItem( window.location.pathname, frame.position().left.toString() );


		};

		// called by the auto slide timer interval
		var autoSliding = function(){

			var firstItemCopy, leftEnd;

			if( !transBlock ){

				if( (( frame.position().left + totalWidth ) >  parent.width()) )
				{	
					transBlock = true;
					leftEnd = slideWidth * currentSlide;
					frame.animate({left:'-'+leftEnd}, { duration:1500, easing:"easeInOutCubic" , complete:function(){ updateNavigation();
						transBlock = false;
					 }});
					currentSlide++;

				} else {
					transBlock = true;
					// to go back to first element slider duplicates the first element on the end
					firstItemCopy = $( itens[0] ).clone();
					frame.append( firstItemCopy );
					frame.width( totalWidth + slideWidth );
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
		};
	    
	    var settings = $.extend({}, defaults, options);

	    // stores settings
		leftArrowClass  = settings.arrow_left_class;
		rightArrowClass = settings.arrow_right_class;
		arrowOffClass 	= settings.arrow_off_class;
		autoSlide 		= settings.auto_slide;
		autoTime 		= settings.auto_time;
		paginate 		= settings.paginate;

		//gets and stores html elements
		parent 			= $( '#' + root );
		mask 			= $( settings.maskSelector );
		frame 			= parent.find('ul');
		itens 			= frame.find('li');
		leftArrow 		= parent.find(leftArrowClass);
		rightArrow 		= parent.find(rightArrowClass);

		// gets deimensions
		slideWidth 	= itens.first().outerWidth(true);
		totalWidth	= slideWidth * itens.length;

		//initialize slider state
		currentSlide = 0; 		 //current slider = first slider
		frame.width(totalWidth); //sets the size of the slider object to hold all items
		savedPosition = sessionStorage.getItem( window.location.pathname ); //get the last position of the slider
		if( settings.mantainPosition ){
			if( savedPosition != null ){ 
				frame.css('left', savedPosition + 'px');
			}
		}

		//builds the paginator
		if ( paginate ) {

			parent.append( '<nav class="paginator"></nav>' );
			paginator = parent.find( 'nav.paginator' );
			itens.each( addPage );
			pageCtrls = $( '.paginator .page-ctrl' ).click( gotoPage );

		};

		//if auto_slide=true initiate automatic sliding
		if( autoSlide ){

			autoTimer = setInterval( autoSliding, autoTime )

		}

		// if there is no need for arrows hide then, other wise update their state.
		if( totalWidth <= parent.width() ){
			leftArrow.hide();
			rightArrow.hide();
		} else {
			updateNavigation();
		}

		// sets the click on the left arrow
		leftArrow.click(function(){
			if( ( frame.position().left < 0  ) && !transBlock ){
				clearInterval( autoTimer );
				transBlock=true
				
				if ( settings.pageSlide ){

					leftEnd = ( Math.floor( ( frame.position().left + mask.width() ) / slideWidth ) )* slideWidth;

					leftEnd =  - Math.min( leftEnd , 0 );

				} else {

					currentSlide--;
					leftEnd = slideWidth * ( currentSlide );
					
				}

				
				frame.animate({left:'-'+leftEnd}, { duration:1500, easing:"easeInOutCubic", complete:function(){ updateNavigation(); transBlock=false; }});
			}
		});

		//sets the click on the right arrow
		rightArrow.click(function(){

			if( ( ( frame.position().left + totalWidth ) >  mask.width() ) && !transBlock ){
				clearInterval( autoTimer );
				transBlock=true;

				if ( settings.pageSlide ){

					leftEnd = ( Math.floor( ( frame.position().left - mask.width() ) / slideWidth ) + 1 )* slideWidth;

					leftEnd =   - Math.max( leftEnd ,  -frame.width() + mask.width()  );

				} else {

					currentSlide++;
					leftEnd = Math.min ( slideWidth * ( currentSlide ), frame.width() - mask.width() ) ;
					
				}

				frame.animate({left:'-'+leftEnd}, { duration:1500, easing:"easeInOutCubic", complete:function(){ updateNavigation(); transBlock=false; }});

			}

		});   

	}

}(jQuery));