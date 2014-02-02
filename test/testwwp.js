/* global $, jQuery, chai, describe, beforeEach, afterEach, wwp, it,
Raphael */
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
    expect(paperPaths(paper)).to.deep.equal([["0","0","100","100"]]);
  });

  function downMouseOn(jQElement,relativeX,relativeY){
    var topLeftOfDrawingArea = jQElement.offset();
    var pageX = relativeX + topLeftOfDrawingArea.left;
    var pageY = relativeY + topLeftOfDrawingArea.top;

    var clickEvent = new jQuery.Event();
    clickEvent.pageX = pageX;
    clickEvent.pageY = pageY;
    clickEvent.type = "mousedown";
    jQElement.trigger(clickEvent);
  }

  function upMouseOn(jQElement,relativeX,relativeY){
    var topLeftOfDrawingArea = jQElement.offset();
    var pageX = relativeX + topLeftOfDrawingArea.left;
    var pageY = relativeY + topLeftOfDrawingArea.top;

    var clickEvent = new jQuery.Event();
    clickEvent.pageX = pageX;
    clickEvent.pageY = pageY;
    clickEvent.type = "mouseup";
    jQElement.trigger(clickEvent);
  }

  function moveMouseOn(jQElement,relativeX,relativeY){
    var topLeftOfDrawingArea = jQElement.offset();
    var pageX = relativeX + topLeftOfDrawingArea.left;
    var pageY = relativeY + topLeftOfDrawingArea.top;

    var clickEvent = new jQuery.Event();
    clickEvent.pageX = pageX;
    clickEvent.pageY = pageY;
    clickEvent.type = "mousemove";
    jQElement.trigger(clickEvent);
  }

  it("can response to mouse drag ",function(){

    downMouseOn(drawingElement,50,50);
    moveMouseOn(drawingElement,100,100);
    upMouseOn(drawingElement,100,100);

    var elements = drawingElements(paper);
    expect(elements).to.have.length(1);
    expect(paperPaths(paper)).to.deep.equal([["50","50","100","100"],]);
  });

  function paperPaths(paper) {
    // Note: Paths are normalized with left side first in all cases
    var box;
    var result = [];
    for (var i = 0; i < drawingElements(paper).length; i++) {
      box = pathFor(drawingElements(paper)[i]);
      result.push([ box.x, box.y, box.x2, box.y2 ]);
    }
    return result;
  }

  function drawingElements(paper) {
    var result = [];
    paper.forEach(function(element) {
      result.push(element);
    });
    return result;
  }

  function pathFor(element) {
    if (Raphael.vml) return vmlPathFor(element);
    else if (Raphael.svg) return svgPathFor(element);
    else throw new Error("Unknown Raphael type");
  }

  function svgPathFor(element) {
    var pathRegex;

    var path = element.node.attributes.d.value;
    if (path.indexOf(",") !== -1)
      // We're in Firefox, Safari, Chrome, which uses format "M20,30L30,300"
      pathRegex = /M(\d+),(\d+)L(\d+),(\d+)/;
    else {
      // We're in IE9, which uses format "M 20 30 L 30 300"
      pathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
    }
    var pathComponents = path.match(pathRegex);
    return {
      x: pathComponents[1],
      y: pathComponents[2],
      x2: pathComponents[3],
      y2: pathComponents[4]
    };
  }

  function vmlPathFor(element) {
    // We're in IE 8, which uses format "m432000,648000 l648000,67456800 e"
    var VML_MAGIC_NUMBER = 21600;

    var path = element.node.path.value;

    var ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/;
    var ie8 = path.match(ie8PathRegex);

    var startX = ie8[1] / VML_MAGIC_NUMBER;
    var startY = ie8[2] / VML_MAGIC_NUMBER;
    var endX = ie8[3] / VML_MAGIC_NUMBER;
    var endY = ie8[4] / VML_MAGIC_NUMBER;

    return {
      x: startX,
      y: startY,
      x2: endX,
      y2: endY
    };
  }


});