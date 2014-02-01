/* global $, jQuery, chai, describe, beforeEach, afterEach, wwp, it, xit */
"use strict";

describe("wwp api",function(){

  var expect = chai.expect;
  var drawingElement;
  var paper;

  beforeEach( function setup(){
    drawingElement = $("<div style='height: 300px; width: 600px'>hi</div>");
    $(document.body).append(drawingElement);
    paper = wwp.initializeDrawingArea(drawingElement[0]);
  });

  afterEach( function teardown(){
    drawingElement.remove();
  });


  function pathFor(element) {
    var box = element.getBBox();
    return [box.x,box.y,box.x2,box.y2];
  }

  function drawingElements(paper) {
    var result = [];
    paper.forEach(function(element) {
      result.push(element);
    });
    return result;
  }

  it("has the div size",function(){
    expect(paper.height).to.equal(300);
    expect(paper.width ).to.equal(600);
  });

  it("can draw a line on paper",function(){
    wwp.drawLine(0,0,100,100);
    var elements = drawingElements(paper);
    expect(elements).to.have.length(1);
    expect(pathFor(elements[0])).to.deep.equal([0,0,100,100]);
  });


  function clickMouseOn(jQElement,relativeX,relativeY){

    var topLeftOfDrawingArea = jQElement.offset();
    var pageX = relativeX + topLeftOfDrawingArea.left;
    var pageY = relativeY + topLeftOfDrawingArea.top;


    var clickEvent = new jQuery.Event();
    clickEvent.pageX = pageX;
    clickEvent.pageY = pageY;
    clickEvent.type = "click";
    jQElement.trigger(clickEvent);
  }

  function relativePosition(jqElement,pageX,pageY){
    var newX = pageX - jqElement.offset().left;
    var newY = pageY - jqElement.offset().top;

    return {x:newX,y:newY};
  }

  it("can response to mutil clicks",function(){

    clickMouseOn(drawingElement,50,50);
    clickMouseOn(drawingElement,100,100);
    clickMouseOn(drawingElement,35,36);

    var expect1 = relativePosition(drawingElement,50,50);
    var expect2 = relativePosition(drawingElement,100,100);
    var expect3 = relativePosition(drawingElement,35,36);
    var elements = drawingElements(paper);

    expect(elements).to.have.length(2);
    expect(pathFor(elements[0])).to.deep.equal(
      [expect1.x, expect1.y, expect2.x, expect2.y]);
    expect(pathFor(elements[1])).to.deep.equal(
      [expect3.x, expect3.y, expect2.x, expect2.y]);

  });

});