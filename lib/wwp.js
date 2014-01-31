/* global Raphael, wwp, $*/
wwp = {};

(function(){

  var paper;

  wwp.drawLine = function(startX, startY, endX, endY) {
    paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
  };

  wwp.initializeDrawingArea = function(drawingAreaElement) {
    paper = new Raphael(drawingAreaElement);

    var jqElement = $(drawingAreaElement);
    jqElement.click(function(event) {
      wwp.drawLine(0, 0,
        event.pageX - jqElement.offset().left,
        event.pageY - jqElement.offset().top );
    });

    return paper;
  };



})();

//      var prevX = null;
//      var prevY = null;
//
//      var jqArea = $(drawingAreaElement);
//
//      var isDragging = false;
//
//
//      // TODO in test: if mouse clicked when outside of element, or let go outside of element,
//      // then the 'isDragging' state could get stuck
//      $(document).mousedown(function(event) {
//        isDragging = true;
//      });
//      $(document).mouseup(function(event) {
//        isDragging = false;
//      });
//
//      jqArea.mousemove(function(event) {
//        // TODO in test: account for padding, border, margin (manual tests too)
//        var divPageX = jqArea.offset().left;
//        var divPageY = jqArea.offset().top;
//
//        var relativeX = event.pageX - divPageX;
//        var relativeY = event.pageY - divPageY;
//
//        if (prevX !== null && isDragging) wwp.drawLine(prevX, prevY, relativeX, relativeY);
//        prevX = relativeX;
//        prevY = relativeY;
//      });
