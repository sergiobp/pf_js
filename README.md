pf_js
=====

Biblioteca javascript da Parafernália

Slider.js
=========
Slider is a jQuery Plugin that lets users browse elements inside a div by sliding them horizontally

>>> html structure of the slider

<div id="myslider"> 
   <div class='pf-mask'>
      <ul>
         <li>
            element 1
         </li>
         <li>
            element 2
         </li>
      <ul>
   </div>
   <button class="arrow-left" ><button>
   <button class="arrow-left" ><button>
</div>

>>> como ativar o slider
jQuery("#myslider").slider("myslider");

Lightbox.js
===========
Lightbox is a plugin that opens a modal box so users can see a image or html

how to use:

var myLightbox = $(window).lightbox( operation, parameters );

operations:
   init : setup the slider
   open : opens the lightBox
   putContent : changes the content of the lightbox

parameters for init
   source : function that will change the content
   resize : function that will resize the content
   class : class of elements that has lightbox data. Use class or source to tell the lightbox where to get its contents. if you use class there's no need for a resizing function too.
   left_arrow : class of the left arrow
   right_arrow : class of the right arrow
   disabled_arrow : class of the disabled arrow
   close_button : class of the closebutton
   callback_content: function that is called when the content is already on the lightbox

parameters for open
   _current: the number of the current element. the lightbox will open on this element.
   _total: the total number of elements

parameters for putContent
   c: html content to put on the lightbox



