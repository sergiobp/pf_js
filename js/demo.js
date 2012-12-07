jQuery(document).ready( function(){

					// var lResize=function( w, h ){
					// 	//this function runs on the scope of the lightbox content container
						
					// 	//gets the image dimensions
					// 	var currentimg=jQuery(this).children('img');
					// 	var currentwidth=currentimg.width();
					// 	var currentheight=currentimg.height();
						
					// 	//calculates screen aspect ratio
					// 	var sar=h/w;
					// 	//calculates image aspect ratio
					// 	var far=currentheight/currentwidth;
						
					// 	//compares screen aspect ratio with image aspect ratio to decide if its better to adjusta by heigth or by width
					// 	if( sar < far ){ 
					// 		// if screen wider than image adjust by height 
					// 		var nextheight=h*0.8;
					// 		var nextwidth=currentwidth*(nextheight/currentheight);
					// 	}else {
					// 		//if foto wider than screen adjust by height
					// 		var nextwidth=w*0.8;
					// 		var nextheight=currentheight*(nextwidth/currentwidth);
					// 	}
						
					// 	//sets calculated height and width
					// 	currentimg.height(nextheight);
					// 	currentimg.width(nextwidth);
					
					// }

					// var lSource = function( index ){

					// 	var imgUrl=jQuery('#slider-basico li:eq('+index.toString()+')').attr('data-content');

					// 	imgUrl='<img src="' + imgUrl + '"/>'

					// 	myLightbox.lightbox('putContent',{c:imgUrl})

					// };

					pf_js.slider('slider-basico', { "auto_slide" : true, "auto_time" : 5000, "paginate":true });

					// var myLightbox = jQuery('body');
					// myLightbox.lightbox( 'init')

					// var elementos = jQuery( '#slider-basico li' ).click( function() {
					// 	var lCurrent= parseInt( jQuery(this).attr('data-index') );
					// 	myLightbox.lightbox('open',{ _current:lCurrent, _total: elementos.length })
					// })

					// elementos.each( function(index){
					// 	jQuery(this).attr('data-index',index);
					// } )

});


$(function() {
	
	var elements = $('#slider-basico li'),

	lSource = function( index ){

		element 		= $(elements.get(index));
        contentWidth    = element.data('width');
        contentWidth    = (contentWidth) ? 'width = "' + contentWidth + 'px"' : '';
        contentHeight   = element.data('height');
        contentHeight   = (contentHeight) ? 'height = "' + contentHeight + 'px"' : '';
        content         = '<img src="' + element.data('content') + '" ' + contentWidth + ' ' + contentHeight + '/>';

        return content;

	},

	lightBox = new pf_js.util.LightBox( { source: lSource, resize: null, /*imageClass: 'lightbox-img',*/ imageResize: true } );

	lightBox.init();

	elements.click( function(){

		lightBox.open( elements.index( $(this) ), elements.length );

	});
});