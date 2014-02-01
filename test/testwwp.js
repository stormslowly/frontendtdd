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
    return "M" + box.x + "," + box.y + "L" + box.x2 + "," + box.y2;
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
    expect(pathFor(elements[0])).to.equal("M0,0L100,100");
  });


  function click(jQElement,pageX,pageY){
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

    click(drawingElement,50,50);
    click(drawingElement,100,100);

    var expectStart = relativePosition(drawingElement,50,50);
    var expectEnd = relativePosition(drawingElement,100,100);
    var elements = drawingElements(paper);

    expect(elements).to.have.length(1);
    expect(pathFor(elements[0])).to.equal(
      "M" + expectStart.x +"," + expectStart.y +
      "L" + expectEnd.x   +"," + expectEnd.y);

  });

});