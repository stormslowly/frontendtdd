/* global Raphael, wwp, $*/
wwp = {};

(function(){

  var paper;

  wwp.drawLine = function(startX, startY, endX, endY) {
    paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
  };

  wwp.initializeDrawingArea = function(drawingAreaElement) {
    paper = new Raphael(drawingAreaElement);

    var startX = null;
    var startY = null;

    var isDragging = false;


    var jqElement = $(drawingAreaElement);

    jqElement.mouseup(function(){
      isDragging = false;
    });

    jqElement.mousedown( function(event){
      var pageOffset = jqElement.offset();
      event.preventDefault();
      isDragging = true;
      startX = event.pageX - pageOffset.left;
      startY = event.pageY - pageOffset.top;
    } );

    jqElement.mousemove( function(event){
      var pageOffset = jqElement.offset();

      if(isDragging){
        wwp.drawLine(startX, startY,
          event.pageX - jqElement.offset().left,
          event.pageY - jqElement.offset().top );
      }

      startX = event.pageX - pageOffset.left;
      startY = event.pageY - pageOffset.top;

    });

    jqElement.click( function(event) {
      var pageOffset = jqElement.offset();
      if( startX === null ){
        startX = event.pageX - pageOffset.left;
        startY = event.pageY - pageOffset.top;
        return ;
      }

      wwp.drawLine(startX, startY,
        event.pageX - jqElement.offset().left,
        event.pageY - jqElement.offset().top );

      startX = event.pageX - jqElement.offset().left;
      startY = event.pageY - jqElement.offset().top;
    });

    return paper;
  };

})();
