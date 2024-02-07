/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/libs/CustomEase.js":
/*!***********************************!*\
  !*** ./assets/libs/CustomEase.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomEase: () => (/* binding */ CustomEase),
/* harmony export */   "default": () => (/* binding */ CustomEase)
/* harmony export */ });
function transformRawPath(rawPath, a, b, c, d, tx, ty) {
  var j = rawPath.length,
    segment,
    l,
    i,
    x,
    y;
  while (--j > -1) {
    segment = rawPath[j];
    l = segment.length;
    for (i = 0; i < l; i += 2) {
      x = segment[i];
      y = segment[i + 1];
      segment[i] = x * a + y * c + tx;
      segment[i + 1] = x * b + y * d + ty;
    }
  }
  rawPath._dirty = 1;
  return rawPath;
}
function rawPathToString(rawPath) {
  if (_isNumber(rawPath[0])) {
    //in case a segment is passed in instead
    rawPath = [rawPath];
  }
  var result = "",
    l = rawPath.length,
    sl,
    s,
    i,
    segment;
  for (s = 0; s < l; s++) {
    segment = rawPath[s];
    result += "M" + _round(segment[0]) + "," + _round(segment[1]) + " C";
    sl = segment.length;
    for (i = 2; i < sl; i++) {
      result += _round(segment[i++]) + "," + _round(segment[i++]) + " " + _round(segment[i++]) + "," + _round(segment[i++]) + " " + _round(segment[i++]) + "," + _round(segment[i]) + " ";
    }
    if (segment.closed) {
      result += "z";
    }
  }
  return result;
}
function stringToRawPath(d) {
  var a = (d + "").replace(_scientific, function (m) {
      var n = +m;
      return n < 0.0001 && n > -0.0001 ? 0 : n;
    }).match(_svgPathExp) || [],
    //some authoring programs spit out very small numbers in scientific notation like "1e-5", so make sure we round that down to 0 first.
    path = [],
    relativeX = 0,
    relativeY = 0,
    twoThirds = 2 / 3,
    elements = a.length,
    points = 0,
    errorMessage = "ERROR: malformed path: " + d,
    i,
    j,
    x,
    y,
    command,
    isRelative,
    segment,
    startX,
    startY,
    difX,
    difY,
    beziers,
    prevCommand,
    flag1,
    flag2,
    line = function line(sx, sy, ex, ey) {
      difX = (ex - sx) / 3;
      difY = (ey - sy) / 3;
      segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
    };
  if (!d || !isNaN(a[0]) || isNaN(a[1])) {
    console.log(errorMessage);
    return path;
  }
  for (i = 0; i < elements; i++) {
    prevCommand = command;
    if (isNaN(a[i])) {
      command = a[i].toUpperCase();
      isRelative = command !== a[i]; //lower case means relative
    } else {
      //commands like "C" can be strung together without any new command characters between.
      i--;
    }
    x = +a[i + 1];
    y = +a[i + 2];
    if (isRelative) {
      x += relativeX;
      y += relativeY;
    }
    if (!i) {
      startX = x;
      startY = y;
    } // "M" (move)

    if (command === "M") {
      if (segment) {
        if (segment.length < 8) {
          //if the path data was funky and just had a M with no actual drawing anywhere, skip it.
          path.length -= 1;
        } else {
          points += segment.length;
        }
      }
      relativeX = startX = x;
      relativeY = startY = y;
      segment = [x, y];
      path.push(segment);
      i += 2;
      command = "L"; //an "M" with more than 2 values gets interpreted as "lineTo" commands ("L").
      // "C" (cubic bezier)
    } else if (command === "C") {
      if (!segment) {
        segment = [0, 0];
      }
      if (!isRelative) {
        relativeX = relativeY = 0;
      } //note: "*1" is just a fast/short way to cast the value as a Number. WAAAY faster in Chrome, slightly slower in Firefox.

      segment.push(x, y, relativeX + a[i + 3] * 1, relativeY + a[i + 4] * 1, relativeX += a[i + 5] * 1, relativeY += a[i + 6] * 1);
      i += 6; // "S" (continuation of cubic bezier)
    } else if (command === "S") {
      difX = relativeX;
      difY = relativeY;
      if (prevCommand === "C" || prevCommand === "S") {
        difX += relativeX - segment[segment.length - 4];
        difY += relativeY - segment[segment.length - 3];
      }
      if (!isRelative) {
        relativeX = relativeY = 0;
      }
      segment.push(difX, difY, x, y, relativeX += a[i + 3] * 1, relativeY += a[i + 4] * 1);
      i += 4; // "Q" (quadratic bezier)
    } else if (command === "Q") {
      difX = relativeX + (x - relativeX) * twoThirds;
      difY = relativeY + (y - relativeY) * twoThirds;
      if (!isRelative) {
        relativeX = relativeY = 0;
      }
      relativeX += a[i + 3] * 1;
      relativeY += a[i + 4] * 1;
      segment.push(difX, difY, relativeX + (x - relativeX) * twoThirds, relativeY + (y - relativeY) * twoThirds, relativeX, relativeY);
      i += 4; // "T" (continuation of quadratic bezier)
    } else if (command === "T") {
      difX = relativeX - segment[segment.length - 4];
      difY = relativeY - segment[segment.length - 3];
      segment.push(relativeX + difX, relativeY + difY, x + (relativeX + difX * 1.5 - x) * twoThirds, y + (relativeY + difY * 1.5 - y) * twoThirds, relativeX = x, relativeY = y);
      i += 2; // "H" (horizontal line)
    } else if (command === "H") {
      line(relativeX, relativeY, relativeX = x, relativeY);
      i += 1; // "V" (vertical line)
    } else if (command === "V") {
      //adjust values because the first (and only one) isn't x in this case, it's y.
      line(relativeX, relativeY, relativeX, relativeY = x + (isRelative ? relativeY - relativeX : 0));
      i += 1; // "L" (line) or "Z" (close)
    } else if (command === "L" || command === "Z") {
      if (command === "Z") {
        x = startX;
        y = startY;
        segment.closed = true;
      }
      if (command === "L" || _abs(relativeX - x) > 0.5 || _abs(relativeY - y) > 0.5) {
        line(relativeX, relativeY, x, y);
        if (command === "L") {
          i += 2;
        }
      }
      relativeX = x;
      relativeY = y; // "A" (arc)
    } else if (command === "A") {
      flag1 = a[i + 4];
      flag2 = a[i + 5];
      difX = a[i + 6];
      difY = a[i + 7];
      j = 7;
      if (flag1.length > 1) {
        // for cases when the flags are merged, like "a8 8 0 018 8" (the 0 and 1 flags are WITH the x value of 8, but it could also be "a8 8 0 01-8 8" so it may include x or not)
        if (flag1.length < 3) {
          difY = difX;
          difX = flag2;
          j--;
        } else {
          difY = flag2;
          difX = flag1.substr(2);
          j -= 2;
        }
        flag2 = flag1.charAt(1);
        flag1 = flag1.charAt(0);
      }
      beziers = arcToSegment(relativeX, relativeY, +a[i + 1], +a[i + 2], +a[i + 3], +flag1, +flag2, (isRelative ? relativeX : 0) + difX * 1, (isRelative ? relativeY : 0) + difY * 1);
      i += j;
      if (beziers) {
        for (j = 0; j < beziers.length; j++) {
          segment.push(beziers[j]);
        }
      }
      relativeX = segment[segment.length - 2];
      relativeY = segment[segment.length - 1];
    } else {
      console.log(errorMessage);
    }
  }
  i = segment.length;
  if (i < 6) {
    //in case there's odd SVG like a M0,0 command at the very end.
    path.pop();
    i = 0;
  } else if (segment[0] === segment[i - 2] && segment[1] === segment[i - 1]) {
    segment.closed = true;
  }
  path.totalPoints = points + i;
  return path;
}
var gsap,
  _coreInitted,
  _getGSAP = function _getGSAP() {
    return gsap || typeof window !== 'undefined' && (gsap = window.gsap) && gsap.registerPlugin && gsap;
  },
  _initCore = function _initCore() {
    gsap = _getGSAP();
    if (gsap) {
      gsap.registerEase('_CE', CustomEase.create);
      _coreInitted = 1;
    } else {
      console.warn('Please gsap.registerPlugin(CustomEase)');
    }
  },
  _bigNum = 1e20,
  _round = function _round(value) {
    return ~~(value * 1000 + (value < 0 ? -0.5 : 0.5)) / 1000;
  },
  _bonusValidated = 1,
  //<name>CustomEase</name>
  _numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
  //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
  _needsParsingExp = /[cLlsSaAhHvVtTqQ]/g,
  _findMinimum = function _findMinimum(values) {
    var l = values.length,
      min = _bigNum,
      i;
    for (i = 1; i < l; i += 6) {
      +values[i] < min && (min = +values[i]);
    }
    return min;
  },
  //takes all the points and translates/scales them so that the x starts at 0 and ends at 1.
  _normalize = function _normalize(values, height, originY) {
    if (!originY && originY !== 0) {
      originY = Math.max(+values[values.length - 1], +values[1]);
    }
    var tx = +values[0] * -1,
      ty = -originY,
      l = values.length,
      sx = 1 / (+values[l - 2] + tx),
      sy = -height || (Math.abs(+values[l - 1] - +values[1]) < 0.01 * (+values[l - 2] - +values[0]) ? _findMinimum(values) + ty : +values[l - 1] + ty),
      i;
    if (sy) {
      //typically y ends at 1 (so that the end values are reached)
      sy = 1 / sy;
    } else {
      //in case the ease returns to its beginning value, scale everything proportionally
      sy = -sx;
    }
    for (i = 0; i < l; i += 2) {
      values[i] = (+values[i] + tx) * sx;
      values[i + 1] = (+values[i + 1] + ty) * sy;
    }
  },
  //note that this function returns point objects like {x, y} rather than working with segments which are arrays with alternating x, y values as in the similar function in paths.js
  _bezierToPoints = function _bezierToPoints(x1, y1, x2, y2, x3, y3, x4, y4, threshold, points, index) {
    var x12 = (x1 + x2) / 2,
      y12 = (y1 + y2) / 2,
      x23 = (x2 + x3) / 2,
      y23 = (y2 + y3) / 2,
      x34 = (x3 + x4) / 2,
      y34 = (y3 + y4) / 2,
      x123 = (x12 + x23) / 2,
      y123 = (y12 + y23) / 2,
      x234 = (x23 + x34) / 2,
      y234 = (y23 + y34) / 2,
      x1234 = (x123 + x234) / 2,
      y1234 = (y123 + y234) / 2,
      dx = x4 - x1,
      dy = y4 - y1,
      d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx),
      d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx),
      length;
    if (!points) {
      points = [{
        x: x1,
        y: y1
      }, {
        x: x4,
        y: y4
      }];
      index = 1;
    }
    points.splice(index || points.length - 1, 0, {
      x: x1234,
      y: y1234
    });
    if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
      length = points.length;
      _bezierToPoints(x1, y1, x12, y12, x123, y123, x1234, y1234, threshold, points, index);
      _bezierToPoints(x1234, y1234, x234, y234, x34, y34, x4, y4, threshold, points, index + 1 + (points.length - length));
    }
    return points;
  };
var CustomEase = /*#__PURE__*/function () {
  function CustomEase(id, data, config) {
    _coreInitted || _initCore();
    this.id = id;
    _bonusValidated && this.setData(data, config);
  }
  var _proto = CustomEase.prototype;
  _proto.setData = function setData(data, config) {
    config = config || {};
    data = data || '0,0,1,1';
    var values = data.match(_numExp),
      closest = 1,
      points = [],
      lookup = [],
      precision = config.precision || 1,
      fast = precision <= 1,
      l,
      a1,
      a2,
      i,
      inc,
      j,
      point,
      prevPoint,
      p;
    this.data = data;
    if (_needsParsingExp.test(data) || ~data.indexOf('M') && data.indexOf('C') < 0) {
      values = stringToRawPath(data)[0];
    }
    l = values.length;
    if (l === 4) {
      values.unshift(0, 0);
      values.push(1, 1);
      l = 8;
    } else if ((l - 2) % 6) {
      throw 'Invalid CustomEase';
    }
    if (+values[0] !== 0 || +values[l - 2] !== 1) {
      _normalize(values, config.height, config.originY);
    }
    this.segment = values;
    for (i = 2; i < l; i += 6) {
      a1 = {
        x: +values[i - 2],
        y: +values[i - 1]
      };
      a2 = {
        x: +values[i + 4],
        y: +values[i + 5]
      };
      points.push(a1, a2);
      _bezierToPoints(a1.x, a1.y, +values[i], +values[i + 1], +values[i + 2], +values[i + 3], a2.x, a2.y, 1 / (precision * 200000), points, points.length - 1);
    }
    l = points.length;
    for (i = 0; i < l; i++) {
      point = points[i];
      prevPoint = points[i - 1] || point;
      if ((point.x > prevPoint.x || prevPoint.y !== point.y && prevPoint.x === point.x || point === prevPoint) && point.x <= 1) {
        //if a point goes BACKWARD in time or is a duplicate, just drop it. Also it shouldn't go past 1 on the x axis, as could happen in a string like "M0,0 C0,0 0.12,0.68 0.18,0.788 0.195,0.845 0.308,1 0.32,1 0.403,1.005 0.398,1 0.5,1 0.602,1 0.816,1.005 0.9,1 0.91,1 0.948,0.69 0.962,0.615 1.003,0.376 1,0 1,0".
        prevPoint.cx = point.x - prevPoint.x; //change in x between this point and the next point (performance optimization)

        prevPoint.cy = point.y - prevPoint.y;
        prevPoint.n = point;
        prevPoint.nx = point.x; //next point's x value (performance optimization, making lookups faster in getRatio()). Remember, the lookup will always land on a spot where it's either this point or the very next one (never beyond that)

        if (fast && i > 1 && Math.abs(prevPoint.cy / prevPoint.cx - points[i - 2].cy / points[i - 2].cx) > 2) {
          //if there's a sudden change in direction, prioritize accuracy over speed. Like a bounce ease - you don't want to risk the sampling chunks landing on each side of the bounce anchor and having it clipped off.
          fast = 0;
        }
        if (prevPoint.cx < closest) {
          if (!prevPoint.cx) {
            prevPoint.cx = 0.001; //avoids math problems in getRatio() (dividing by zero)

            if (i === l - 1) {
              //in case the final segment goes vertical RIGHT at the end, make sure we end at the end.
              prevPoint.x -= 0.001;
              closest = Math.min(closest, 0.001);
              fast = 0;
            }
          } else {
            closest = prevPoint.cx;
          }
        }
      } else {
        points.splice(i--, 1);
        l--;
      }
    }
    l = 1 / closest + 1 | 0;
    inc = 1 / l;
    j = 0;
    point = points[0];
    if (fast) {
      for (i = 0; i < l; i++) {
        //for fastest lookups, we just sample along the path at equal x (time) distance. Uses more memory and is slightly less accurate for anchors that don't land on the sampling points, but for the vast majority of eases it's excellent (and fast).
        p = i * inc;
        if (point.nx < p) {
          point = points[++j];
        }
        a1 = point.y + (p - point.x) / point.cx * point.cy;
        lookup[i] = {
          x: p,
          cx: inc,
          y: a1,
          cy: 0,
          nx: 9
        };
        if (i) {
          lookup[i - 1].cy = a1 - lookup[i - 1].y;
        }
      }
      lookup[l - 1].cy = points[points.length - 1].y - a1;
    } else {
      //this option is more accurate, ensuring that EVERY anchor is hit perfectly. Clipping across a bounce, for example, would never happen.
      for (i = 0; i < l; i++) {
        //build a lookup table based on the smallest distance so that we can instantly find the appropriate point (well, it'll either be that point or the very next one). We'll look up based on the linear progress. So it's it's 0.5 and the lookup table has 100 elements, it'd be like lookup[Math.floor(0.5 * 100)]
        if (point.nx < i * inc) {
          point = points[++j];
        }
        lookup[i] = point;
      }
      if (j < points.length - 1) {
        lookup[i - 1] = points[points.length - 2];
      }
    } //this._calcEnd = (points[points.length-1].y !== 1 || points[0].y !== 0); //ensures that we don't run into floating point errors. As long as we're starting at 0 and ending at 1, tell GSAP to skip the final calculation and use 0/1 as the factor.

    this.ease = function (p) {
      var point = lookup[p * l | 0] || lookup[l - 1];
      if (point.nx < p) {
        point = point.n;
      }
      return point.y + (p - point.x) / point.cx * point.cy;
    };
    this.ease.custom = this;
    this.id && gsap && gsap.registerEase(this.id, this.ease);
    return this;
  };
  _proto.getSVGData = function getSVGData(config) {
    return CustomEase.getSVGData(this, config);
  };
  CustomEase.create = function create(id, data, config) {
    return new CustomEase(id, data, config).ease;
  };
  CustomEase.register = function register(core) {
    gsap = core;
    _initCore();
  };
  CustomEase.get = function get(id) {
    return gsap.parseEase(id);
  };
  CustomEase.getSVGData = function getSVGData(ease, config) {
    config = config || {};
    var width = config.width || 100,
      height = config.height || 100,
      x = config.x || 0,
      y = (config.y || 0) + height,
      e = gsap.utils.toArray(config.path)[0],
      a,
      slope,
      i,
      inc,
      tx,
      ty,
      precision,
      threshold,
      prevX,
      prevY;
    if (config.invert) {
      height = -height;
      y = 0;
    }
    if (typeof ease === 'string') {
      ease = gsap.parseEase(ease);
    }
    if (ease.custom) {
      ease = ease.custom;
    }
    if (ease instanceof CustomEase) {
      a = rawPathToString(transformRawPath([ease.segment], width, 0, 0, -height, x, y));
    } else {
      a = [x, y];
      precision = Math.max(5, (config.precision || 1) * 200);
      inc = 1 / precision;
      precision += 2;
      threshold = 5 / precision;
      prevX = _round(x + inc * width);
      prevY = _round(y + ease(inc) * -height);
      slope = (prevY - y) / (prevX - x);
      for (i = 2; i < precision; i++) {
        tx = _round(x + i * inc * width);
        ty = _round(y + ease(i * inc) * -height);
        if (Math.abs((ty - prevY) / (tx - prevX) - slope) > threshold || i === precision - 1) {
          //only add points when the slope changes beyond the threshold
          a.push(prevX, prevY);
          slope = (ty - prevY) / (tx - prevX);
        }
        prevX = tx;
        prevY = ty;
      }
      a = 'M' + a.join(',');
    }
    e && e.setAttribute('d', a);
    return a;
  };
  return CustomEase;
}();
_getGSAP() && gsap.registerPlugin(CustomEase);
CustomEase.version = '3.9.1';


/***/ }),

/***/ "./assets/libs/ScrollToPlugin.js":
/*!***************************************!*\
  !*** ./assets/libs/ScrollToPlugin.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScrollToPlugin: () => (/* binding */ ScrollToPlugin),
/* harmony export */   "default": () => (/* binding */ ScrollToPlugin)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/*!
 * ScrollToPlugin 3.9.1
 * https://greensock.com
 *
 * @license Copyright 2008-2021, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var gsap,
  _coreInitted,
  _window,
  _docEl,
  _body,
  _toArray,
  _config,
  _windowExists = function _windowExists() {
    return typeof window !== "undefined";
  },
  _getGSAP = function _getGSAP() {
    return gsap || _windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap;
  },
  _isString = function _isString(value) {
    return typeof value === "string";
  },
  _isFunction = function _isFunction(value) {
    return typeof value === "function";
  },
  _max = function _max(element, axis) {
    var dim = axis === "x" ? "Width" : "Height",
      scroll = "scroll" + dim,
      client = "client" + dim;
    return element === _window || element === _docEl || element === _body ? Math.max(_docEl[scroll], _body[scroll]) - (_window["inner" + dim] || _docEl[client] || _body[client]) : element[scroll] - element["offset" + dim];
  },
  _buildGetter = function _buildGetter(e, axis) {
    //pass in an element and an axis ("x" or "y") and it'll return a getter function for the scroll position of that element (like scrollTop or scrollLeft, although if the element is the window, it'll use the pageXOffset/pageYOffset or the documentElement's scrollTop/scrollLeft or document.body's. Basically this streamlines things and makes a very fast getter across browsers.
    var p = "scroll" + (axis === "x" ? "Left" : "Top");
    if (e === _window) {
      if (e.pageXOffset != null) {
        p = "page" + axis.toUpperCase() + "Offset";
      } else {
        e = _docEl[p] != null ? _docEl : _body;
      }
    }
    return function () {
      return e[p];
    };
  },
  _clean = function _clean(value, index, target, targets) {
    _isFunction(value) && (value = value(index, target, targets));
    if (_typeof(value) !== "object") {
      return _isString(value) && value !== "max" && value.charAt(1) !== "=" ? {
        x: value,
        y: value
      } : {
        y: value
      }; //if we don't receive an object as the parameter, assume the user intends "y".
    } else if (value.nodeType) {
      return {
        y: value,
        x: value
      };
    } else {
      var result = {},
        p;
      for (p in value) {
        result[p] = p !== "onAutoKill" && _isFunction(value[p]) ? value[p](index, target, targets) : value[p];
      }
      return result;
    }
  },
  _getOffset = function _getOffset(element, container) {
    element = _toArray(element)[0];
    if (!element || !element.getBoundingClientRect) {
      return console.warn("scrollTo target doesn't exist. Using 0") || {
        x: 0,
        y: 0
      };
    }
    var rect = element.getBoundingClientRect(),
      isRoot = !container || container === _window || container === _body,
      cRect = isRoot ? {
        top: _docEl.clientTop - (_window.pageYOffset || _docEl.scrollTop || _body.scrollTop || 0),
        left: _docEl.clientLeft - (_window.pageXOffset || _docEl.scrollLeft || _body.scrollLeft || 0)
      } : container.getBoundingClientRect(),
      offsets = {
        x: rect.left - cRect.left,
        y: rect.top - cRect.top
      };
    if (!isRoot && container) {
      //only add the current scroll position if it's not the window/body.
      offsets.x += _buildGetter(container, "x")();
      offsets.y += _buildGetter(container, "y")();
    }
    return offsets;
  },
  _parseVal = function _parseVal(value, target, axis, currentVal, offset) {
    return !isNaN(value) && _typeof(value) !== "object" ? parseFloat(value) - offset : _isString(value) && value.charAt(1) === "=" ? parseFloat(value.substr(2)) * (value.charAt(0) === "-" ? -1 : 1) + currentVal - offset : value === "max" ? _max(target, axis) - offset : Math.min(_max(target, axis), _getOffset(value, target)[axis] - offset);
  },
  _initCore = function _initCore() {
    gsap = _getGSAP();
    if (_windowExists() && gsap && document.body) {
      _window = window;
      _body = document.body;
      _docEl = document.documentElement;
      _toArray = gsap.utils.toArray;
      gsap.config({
        autoKillThreshold: 7
      });
      _config = gsap.config();
      _coreInitted = 1;
    }
  };
var ScrollToPlugin = {
  version: "3.9.1",
  name: "scrollTo",
  rawVars: 1,
  register: function register(core) {
    gsap = core;
    _initCore();
  },
  init: function init(target, value, tween, index, targets) {
    _coreInitted || _initCore();
    var data = this,
      snapType = gsap.getProperty(target, "scrollSnapType");
    data.isWin = target === _window;
    data.target = target;
    data.tween = tween;
    value = _clean(value, index, target, targets);
    data.vars = value;
    data.autoKill = !!value.autoKill;
    data.getX = _buildGetter(target, "x");
    data.getY = _buildGetter(target, "y");
    data.x = data.xPrev = data.getX();
    data.y = data.yPrev = data.getY();
    if (snapType && snapType !== "none") {
      // disable scroll snapping to avoid strange behavior
      data.snap = 1;
      data.snapInline = target.style.scrollSnapType;
      target.style.scrollSnapType = "none";
    }
    if (value.x != null) {
      data.add(data, "x", data.x, _parseVal(value.x, target, "x", data.x, value.offsetX || 0), index, targets);
      data._props.push("scrollTo_x");
    } else {
      data.skipX = 1;
    }
    if (value.y != null) {
      data.add(data, "y", data.y, _parseVal(value.y, target, "y", data.y, value.offsetY || 0), index, targets);
      data._props.push("scrollTo_y");
    } else {
      data.skipY = 1;
    }
  },
  render: function render(ratio, data) {
    var pt = data._pt,
      target = data.target,
      tween = data.tween,
      autoKill = data.autoKill,
      xPrev = data.xPrev,
      yPrev = data.yPrev,
      isWin = data.isWin,
      snap = data.snap,
      snapInline = data.snapInline,
      x,
      y,
      yDif,
      xDif,
      threshold;
    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
    x = isWin || !data.skipX ? data.getX() : xPrev;
    y = isWin || !data.skipY ? data.getY() : yPrev;
    yDif = y - yPrev;
    xDif = x - xPrev;
    threshold = _config.autoKillThreshold;
    if (data.x < 0) {
      //can't scroll to a position less than 0! Might happen if someone uses a Back.easeOut or Elastic.easeOut when scrolling back to the top of the page (for example)
      data.x = 0;
    }
    if (data.y < 0) {
      data.y = 0;
    }
    if (autoKill) {
      //note: iOS has a bug that throws off the scroll by several pixels, so we need to check if it's within 7 pixels of the previous one that we set instead of just looking for an exact match.
      if (!data.skipX && (xDif > threshold || xDif < -threshold) && x < _max(target, "x")) {
        data.skipX = 1; //if the user scrolls separately, we should stop tweening!
      }

      if (!data.skipY && (yDif > threshold || yDif < -threshold) && y < _max(target, "y")) {
        data.skipY = 1; //if the user scrolls separately, we should stop tweening!
      }

      if (data.skipX && data.skipY) {
        tween.kill();
        data.vars.onAutoKill && data.vars.onAutoKill.apply(tween, data.vars.onAutoKillParams || []);
      }
    }
    if (isWin) {
      _window.scrollTo(!data.skipX ? data.x : x, !data.skipY ? data.y : y);
    } else {
      data.skipY || (target.scrollTop = data.y);
      data.skipX || (target.scrollLeft = data.x);
    }
    if (snap && (ratio === 1 || ratio === 0)) {
      y = target.scrollTop;
      x = target.scrollLeft;
      snapInline ? target.style.scrollSnapType = snapInline : target.style.removeProperty("scroll-snap-type");
      target.scrollTop = y + 1; // bug in Safari causes the element to totally reset its scroll position when scroll-snap-type changes, so we need to set it to a slightly different value and then back again to work around this bug.

      target.scrollLeft = x + 1;
      target.scrollTop = y;
      target.scrollLeft = x;
    }
    data.xPrev = data.x;
    data.yPrev = data.y;
  },
  kill: function kill(property) {
    var both = property === "scrollTo";
    if (both || property === "scrollTo_x") {
      this.skipX = 1;
    }
    if (both || property === "scrollTo_y") {
      this.skipY = 1;
    }
  }
};
ScrollToPlugin.max = _max;
ScrollToPlugin.getOffset = _getOffset;
ScrollToPlugin.buildGetter = _buildGetter;
_getGSAP() && gsap.registerPlugin(ScrollToPlugin);


/***/ }),

/***/ "./src/scripts/components/accordion.js":
/*!*********************************************!*\
  !*** ./src/scripts/components/accordion.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Accordion)
/* harmony export */ });
/* harmony import */ var _smooth_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./smooth-animation */ "./src/scripts/components/smooth-animation.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/scripts/utils/index.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var Accordion = /*#__PURE__*/function () {
  function Accordion(_ref) {
    var triggers = _ref.triggers,
      activeStateName = _ref.activeStateName;
    _classCallCheck(this, Accordion);
    this.$allTriggers = triggers ? triggers : null;
    this.activeStateName = activeStateName ? activeStateName : this.CLASSNAMES.defaultActiveState;
    this.enabled = true;
    this.init = this.init.bind(this);
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
    this.isEnabled = this.isEnabled.bind(this);
    this.closeAllAccordion = this.closeAllAccordion.bind(this);
    this.openAccordion = this.openAccordion.bind(this);
    this.toggleActiveState = this.toggleActiveState.bind(this);
    this.onResize = this.onResize.bind(this);
  }
  _createClass(Accordion, [{
    key: "CLASSNAMES",
    get: function get() {
      return {
        defaultActiveState: 'accordion__item--active-mod'
      };
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.enabled;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.enabled = false;
    }
  }, {
    key: "enable",
    value: function enable() {
      this.enabled = true;
    }
  }, {
    key: "onResize",
    value: function onResize() {
      var _this = this;
      if (this.isEnabled()) {
        this.$allTriggers.forEach(function ($item) {
          var $parentEl = $item.parentNode;
          if ($parentEl.classList.contains(_this.activeStateName)) {
            var $nextElementSibling = $item.nextElementSibling;
            $nextElementSibling.style.maxHeight = $nextElementSibling.scrollHeight + 'px'; // eslint-disable-line prefer-template
          }
        });
      }
    }
  }, {
    key: "closeAllAccordion",
    value: function closeAllAccordion() {
      var _this2 = this;
      this.$allTriggers.forEach(function ($item) {
        _this2.closeAccordion($item.parentNode, $item.nextElementSibling);
      });
    }
  }, {
    key: "closeAccordion",
    value: function closeAccordion($parentEl, $nextElementSibling) {
      $parentEl.classList.remove(this.activeStateName);
      $nextElementSibling.style.maxHeight = null; // eslint-disable-line no-param-reassign
    }
  }, {
    key: "openAccordion",
    value: function openAccordion($parentEl, $nextElementSibling) {
      this.closeAllAccordion();
      $parentEl.classList.add(this.activeStateName);
      $nextElementSibling.style.maxHeight = $nextElementSibling.scrollHeight + 'px';
    }
  }, {
    key: "toggleActiveState",
    value: function toggleActiveState($trigger) {
      if (this.enabled) {
        if (!$trigger) return;
        var $parentEl = $trigger.parentNode;
        var $nextElementSibling = $trigger.nextElementSibling;
        if ($parentEl.classList.contains(this.activeStateName)) {
          this.closeAccordion($parentEl, $nextElementSibling);
        } else {
          this.openAccordion($parentEl, $nextElementSibling);
        }
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this3 = this;
      if (this.$allTriggers) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.onWindowResize)(this.onResize);
        this.$allTriggers.forEach(function ($item) {
          var $parentEl = $item.parentNode;
          if ($parentEl.classList.contains(_this3.activeStateName) && _this3.isEnabled()) {
            var $nextElementSibling = $item.nextElementSibling;
            _this3.openAccordion($parentEl, $nextElementSibling);
          }
          $item.addEventListener('click', function () {
            _this3.toggleActiveState($item);
            setTimeout(function () {
              _smooth_animation__WEBPACK_IMPORTED_MODULE_0__.scroll.update();
            }, 260);
          });
        });
        (0,_smooth_animation__WEBPACK_IMPORTED_MODULE_0__.globalUpdate)();
      }
    }
  }]);
  return Accordion;
}(); // ------------ how init
// copy past this
// import this and if u need fix path
// import Accordion from './components/accordion';
// add it in loadFunc
// const acc = new Accordion({
// 	triggers: document.querySelectorAll('.accordion__item_head'), // eslint-disable-line
// 	activeStateName: 'accordion__item--active-mod' // eslint-disable-line
// }).init();


/***/ }),

/***/ "./src/scripts/components/animation-title.js":
/*!***************************************************!*\
  !*** ./src/scripts/components/animation-title.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");

var animationTitle = function animationTitle() {
  var SELECTORS = {
    section: '.js-section-trigger',
    title: '.js-title-split'
  };
  var loadScript = true;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  var mm = gsap.matchMedia();
  mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1, "px)"), function () {
    if (!loadScript) return;
    $sections.forEach(function ($section) {
      var tl = gsap.timeline({
        paused: true
      });
      var $title = $section.querySelector(SELECTORS.title);
      if (!$title) return;
      var splitTitle = new SplitText($title, {
        type: 'words, chars',
        linesClass: 'split-line'
      });
      var chars = splitTitle.chars,
        words = splitTitle.words;
      var allDone = function allDone() {
        splitTitle.revert();
      };
      ScrollTrigger.create({
        trigger: $section,
        start: 'top 80%',
        end: 'bottom top',
        scroller: '.wrapper_in',
        // markers: true,
        animation: tl
      });
      gsap.set(words, {
        overflow: 'hidden'
      });
      if (chars) {
        tl.fromTo(chars, {
          y: 200
        }, {
          opacity: 1,
          duration: 0.4,
          delay: 0.2,
          ease: 'circ',
          y: 0,
          stagger: 0.02
        });
        tl.call(function () {
          $title.closest('.footer') ? allDone() : null;
        });
      }
    });
  });
  loadScript = false;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (animationTitle);

/***/ }),

/***/ "./src/scripts/components/awards.js":
/*!******************************************!*\
  !*** ./src/scripts/components/awards.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");

var awards = function awards() {
  var SELECTORS = {
    section: '.js-awards-section',
    item: '.js-awards-item'
  };
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  var initScript = true;
  $sections.forEach(function ($section) {
    var $items = $section.querySelectorAll(SELECTORS.item);
    if (!$items.length) return;
    var mm = gsap.matchMedia();
    mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1, "px)"), function () {
      if (!initScript) return;
      var tl = gsap.timeline({
        paused: true
      });
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        scroller: '.wrapper_in',
        trigger: $section,
        start: 'top 75%',
        end: 'bottom 75%',
        // markers: true,
        animation: tl
      });
      tl.fromTo($items, {
        y: 100,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.4
      });
    });
    initScript = false;
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (awards);

/***/ }),

/***/ "./src/scripts/components/contact-animation.js":
/*!*****************************************************!*\
  !*** ./src/scripts/components/contact-animation.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");

var contactAnim = function contactAnim() {
  var SELECTORS = {
    section: '.contact',
    fadeBlock: '.js-fade-block',
    fadeElem: '.js-fade-el'
  };
  var $section = document.querySelector(SELECTORS.section);
  if (!$section) return;
  var $fadeBlocks = $section.querySelectorAll(SELECTORS.fadeBlock);
  if (!$fadeBlocks.length) return;
  var mm = gsap.matchMedia();
  mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1, "px)"), function () {
    $fadeBlocks.forEach(function ($fadeBlock) {
      var $fadeEl = $fadeBlock.querySelectorAll(SELECTORS.fadeElem);
      if (!$fadeEl.length) return;
      gsap.fromTo($fadeEl, {
        opacity: 0,
        y: 100
      }, {
        duration: 0.5,
        stagger: 0.5,
        opacity: 1,
        y: 0
      });
    });
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (contactAnim);

/***/ }),

/***/ "./src/scripts/components/contact.js":
/*!*******************************************!*\
  !*** ./src/scripts/components/contact.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var contact = function contact() {
  var SELECTORS = {
    form: '.js-form',
    element: '.js-form-element',
    inputFile: '.js-form-file',
    infoFile: '.js-form-file-info'
  };
  var CLASSES = {
    activeState: 'form_input--focus_state',
    errorState: 'form_input--error_state',
    inputFileName: 'form__file_name',
    inputFileReset: 'form__file_reset'
  };
  var $form = document.querySelector(SELECTORS.form);
  if (!$form) return;
  var $formElements = $form.querySelectorAll(SELECTORS.element);
  if (!$formElements.length) return;
  var $inputFile = $form.querySelector(SELECTORS.inputFile);
  if (!$inputFile) return;
  var $infoFile = $form.querySelector(SELECTORS.infoFile);
  if (!$infoFile) return;
  var isFormValid = true;
  var isAddFile = false;
  var $textarea = $form.querySelector('textarea');
  if (!$textarea) return;
  $formElements.forEach(function ($formEl) {
    $formEl.addEventListener('change', function () {
      if ($formEl.value !== '') {
        $formEl.classList.add(CLASSES.activeState);
      } else {
        $formEl.classList.remove(CLASSES.activeState);
      }
    });
  });
  $textarea.addEventListener('focus', function () {
    setTimeout(function () {
      // console.log($textarea.value === '');
      $textarea.selectionStart = 0;
      $textarea.selectionEnd = 0;
    }, 0);
  });
  var toggleValidClass = function toggleValidClass(val, el) {
    if (val) {
      el.classList.add(CLASSES.errorState);
      isFormValid = false;
    } else {
      el.classList.remove(CLASSES.errorState);
      isFormValid = true;
    }
  };
  var validateEmail = function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  var addFile = function addFile() {
    if (isAddFile) return;
    var fileResetBtn = document.createElement('div');
    var fileInfoName = document.createElement('div');
    fileResetBtn.classList.add(CLASSES.inputFileReset);
    fileInfoName.classList.add(CLASSES.inputFileName);
    fileInfoName.textContent = $inputFile.files[0].name;
    $infoFile.appendChild(fileInfoName);
    $infoFile.appendChild(fileResetBtn);
    isAddFile = true;
  };
  $inputFile.addEventListener('change', addFile);
  $infoFile.addEventListener('click', function (e) {
    if (e.target.closest(".".concat(CLASSES.inputFileReset))) {
      $infoFile.innerHTML = '';
      $inputFile.value = '';
      isAddFile = false;
    }
  });
  $form.addEventListener('submit', function (event) {
    event.preventDefault();
    $formElements.forEach(function ($formEl) {
      var $parentElement = $formEl.parentElement;
      if (!$parentElement) return;
      var $emailElement = $formEl.type === 'email';
      var $emailVal = $formEl.value;
      var $textElement = $formEl.type === 'text';
      var $textVal = $formEl.value;
      if ($textElement) {
        toggleValidClass($textVal === '', $parentElement);
      }
      if ($emailElement) {
        toggleValidClass($emailVal === '' || !validateEmail($emailVal), $parentElement);
      }
    });
    if (!isFormValid) return;
    console.log('submit');
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (contact);

/***/ }),

/***/ "./src/scripts/components/cursor.js":
/*!******************************************!*\
  !*** ./src/scripts/components/cursor.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");

var cursor = function cursor() {
  var SELECTORS = {
    cursor: '.js-cursor',
    cursorScale: '.js-cursor-scale'
  };
  var $cursor = document.querySelector(SELECTORS.cursor);
  if (!$cursor) return;
  var $body = document.body;
  var isTouchscreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  if (!isTouchscreen) {
    $cursor.style.opacity = '1';
  }
  var mm = gsap.matchMedia();
  mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1, "px)"), function () {
    gsap.set($cursor, {
      scale: 0.5
    });
    var handleMouseMove = function handleMouseMove(e) {
      var relativeX = e.clientX - 10;
      var relativeY = e.clientY - 10;
      gsap.to($cursor, 0.2, {
        x: relativeX,
        y: relativeY
      });
    };
    var handleMouseEnter = function handleMouseEnter(e) {
      var $parentTarget = e.target.closest(SELECTORS.cursorScale);
      var $target = e.target.classList.contains(SELECTORS.cursorScale.slice(1));
      if ($target || $parentTarget) {
        gsap.to($cursor, {
          scale: 1
        });
      }
    };
    var handleMouseLeave = function handleMouseLeave(e) {
      var $parentTarget = e.target.closest(SELECTORS.cursorScale);
      var $target = e.target.classList.contains(SELECTORS.cursorScale.slice(1));
      if ($target || $parentTarget) {
        gsap.to($cursor, {
          scale: 0.5
        });
      }
    };
    $body.addEventListener('mousemove', handleMouseMove);
    $body.addEventListener('mouseover', handleMouseEnter);
    $body.addEventListener('mouseout', handleMouseLeave);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cursor);

/***/ }),

/***/ "./src/scripts/components/faq.js":
/*!***************************************!*\
  !*** ./src/scripts/components/faq.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accordion */ "./src/scripts/components/accordion.js");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");


var faq = function faq() {
  var acc = new _accordion__WEBPACK_IMPORTED_MODULE_0__["default"]({
    triggers: document.querySelectorAll('.accordion__item_head'),
    activeStateName: 'accordion__item--active-mod'
  }).init();
  var SELECTORS = {
    section: '.js-faq-section',
    item: '.js-faq-item'
  };
  var initScript = true;
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  $sections.forEach(function ($section) {
    var $items = $section.querySelectorAll(SELECTORS.item);
    if (!$items.length) return;
    var tl = gsap.timeline({
      paused: true
    });
    var isClick = false;
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.BREAKPOINTS.mediaPoint1, "px)"), function () {
      if (!initScript) return;
      ScrollTrigger.create({
        scroller: '.wrapper_in',
        trigger: $section,
        start: 'top 70%',
        end: 'bottom 70%',
        // markers: true,
        animation: tl
      });
      tl.fromTo($items, {
        y: 100,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.4
      });
    });
    initScript = false;
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (faq);

/***/ }),

/***/ "./src/scripts/components/footer.js":
/*!******************************************!*\
  !*** ./src/scripts/components/footer.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _smooth_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./smooth-animation */ "./src/scripts/components/smooth-animation.js");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/scripts/utils/index.js");



var footer = function footer() {
  var SELECTORS = {
    title: '.js-title-split'
  };
  var CLASSES = {
    bodyClass: 'body--and_anim_state'
  };
  var $body = document.body;
  var isInitTitle = true;
  var mm = gsap.matchMedia();
  var $footer = document.querySelector('footer');
  if (!$footer) return;
  var $footerChild = $footer.children;
  if (!$footerChild) return;
  var $title = $footer.querySelector(SELECTORS.title);
  if (!$title) return;
  var splitTitle = new SplitText($title, {
    type: 'lines,words,chars',
    linesClass: 'split-line'
  });
  mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.BREAKPOINTS.mediaPoint1, "px)"), function () {
    // globalUpdate();
    gsap.registerPlugin(ScrollTrigger, SplitText);
    _smooth_animation__WEBPACK_IMPORTED_MODULE_0__.scroll.update();
    var splitTitle = new SplitText($title, {
      type: 'lines,words,chars',
      linesClass: 'split-line'
    });
    var chars = splitTitle.chars;
    var tl = gsap.timeline({
      paused: true
    });
    ScrollTrigger.create({
      scroller: '.wrapper_in',
      trigger: $footer,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      // markers: true,
      animation: tl,
      invalidateOnRefresh: true,
      onLeave: function onLeave() {
        $body.classList.add(CLASSES.bodyClass);
      },
      onEnterBack: function onEnterBack() {
        $body.classList.remove(CLASSES.bodyClass);
      },
      onUpdate: function onUpdate(self) {
        if (self.progress > 0.4 && isInitTitle) {
          animTitle();
          isInitTitle = false;
        }
      }
    });
    gsap.set(chars, {
      y: 200
    });
    var animTitle = function animTitle() {
      // console.log('init anim');
      gsap.to(chars, {
        opacity: 1,
        duration: 0.4,
        // delay: 0.2,
        ease: 'circ',
        y: 0,
        stagger: 0.02
      }, 'start');
    };
    tl.addLabel('start').fromTo($footer, {
      yPercent: -100
    }, {
      yPercent: 0,
      ease: 'none'
    }, 'start').fromTo($footerChild, {
      opacity: 0.1,
      y: 300
    }, {
      opacity: 1,
      y: 0,
      ease: 'power1'
    }, 'start');
  });
  mm.add("(max-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.BREAKPOINTS.mediaPoint1 - 1, "px)"), function () {
    // scroll.update();
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      scroller: '.wrapper_in',
      trigger: $footer,
      start: 'top top+=40',
      end: 'bottom bottom',
      // markers: true,
      onEnter: function onEnter() {
        $body.classList.add(CLASSES.bodyClass);
      },
      onLeaveBack: function onLeaveBack() {
        $body.classList.remove(CLASSES.bodyClass);
      }
    });
  });
  (0,_utils__WEBPACK_IMPORTED_MODULE_2__.onWindowResize)(function () {
    isInitTitle = true;
    // globalUpdate();
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (footer);

/***/ }),

/***/ "./src/scripts/components/gallery.js":
/*!*******************************************!*\
  !*** ./src/scripts/components/gallery.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");

var gallery = function gallery() {
  var SELECTORS = {
    section: '.js-gallery-section',
    item: '.js-gallery-item'
  };
  var initScript = true;
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  $sections.forEach(function ($section) {
    var $items = $section.querySelectorAll(SELECTORS.item);
    if (!$items.length) return;
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1, "px)"), function () {
      if (!initScript) return;
      var tl = gsap.timeline({
        paused: true
      });
      ScrollTrigger.create({
        scroller: '.wrapper_in',
        trigger: $section,
        start: 'top center',
        end: 'bottom center',
        // markers: true,
        animation: tl
      });
      tl.fromTo($items, {
        scale: 0
      }, {
        scale: 1,
        stagger: 0.1
      });
    });
  });
  initScript = false;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gallery);

/***/ }),

/***/ "./src/scripts/components/header.js":
/*!******************************************!*\
  !*** ./src/scripts/components/header.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _smooth_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./smooth-animation */ "./src/scripts/components/smooth-animation.js");
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/index */ "./src/scripts/utils/index.js");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");



var header = function header() {
  var CLASSNAMES = {
    bodyOpenMenuState: 'body--open_menu_state',
    headerScrollState: 'header--scroll_state',
    headerScrollPos: 'header--pos_state'
  };
  var $header = document.querySelector('header');
  var prevScrollPos = window.pageYOffset;
  var headerScroll = function headerScroll(windowScrollTop) {
    var scrollPosition = windowScrollTop && windowScrollTop.scroll && windowScrollTop.scroll.y ? windowScrollTop.scroll.y : 0;
    if (scrollPosition > 10 && !$header.classList.contains(CLASSNAMES.headerScrollState)) {
      $header.classList.add(CLASSNAMES.headerScrollState);
    } else if (scrollPosition <= 10 && $header.classList.contains(CLASSNAMES.headerScrollState)) {
      $header.classList.remove(CLASSNAMES.headerScrollState);
    }
    if (scrollPosition > prevScrollPos) {
      $header.classList.add(CLASSNAMES.headerScrollPos);
    } else {
      $header.classList.remove(CLASSNAMES.headerScrollPos);
    }
    prevScrollPos = scrollPosition;
  };
  _smooth_animation__WEBPACK_IMPORTED_MODULE_0__.scroll.on('scroll', function (e) {
    headerScroll(e);
  });
  if (!(0,_utils_index__WEBPACK_IMPORTED_MODULE_1__.exist)($header)) return;
  (0,_utils_index__WEBPACK_IMPORTED_MODULE_1__.onWindowScroll)(headerScroll);
  (0,_utils_index__WEBPACK_IMPORTED_MODULE_1__.onWindowResize)(function () {
    return _smooth_animation__WEBPACK_IMPORTED_MODULE_0__.scroll.update();
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (header);

/***/ }),

/***/ "./src/scripts/components/hero.js":
/*!****************************************!*\
  !*** ./src/scripts/components/hero.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   tlHero: () => (/* binding */ tlHero)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/scripts/utils/index.js");


var tlHero = gsap.timeline({
  paused: true
});
var hero = function hero() {
  var SELECTORS = {
    section: '.js-hero-section',
    title: '.js-hero-title',
    text: '.js-hero-description'
  };
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  var isScriptComplete = false;
  $sections.forEach(function ($section) {
    var $title = $section.querySelector(SELECTORS.title);
    if (!$title) return;
    var $text = $section.querySelector(SELECTORS.text);
    if (!$text) return;
    var splitTitle = new SplitText($title, {
      type: 'words, chars',
      linesClass: 'split-line'
    });
    var chars = splitTitle.chars,
      words = splitTitle.words;
    if (!chars) return;
    var allDone = function allDone() {
      splitTitle.revert();
    };
    var mm = gsap.matchMedia();
    mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1, "px)"), function () {
      if (isScriptComplete) return;
      gsap.set(words, {
        overflow: 'hidden'
      });
      tlHero.fromTo(chars, {
        y: 200
      }, {
        opacity: 1,
        duration: 0.4,
        ease: 'circ',
        y: 0,
        stagger: 0.02
      }).fromTo($text, {
        y: $text.clientHeight,
        opacity: 0
      }, {
        duration: 0.7,
        y: 0,
        opacity: 1
      });

      // .call(() => {
      // 	allDone();
      // });
    });

    isScriptComplete = true;
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hero);

/***/ }),

/***/ "./src/scripts/components/logos.js":
/*!*****************************************!*\
  !*** ./src/scripts/components/logos.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");

var logos = function logos() {
  var SELECTORS = {
    logo: '.js-logos-item',
    section: '.js-logos-section'
  };
  var loadScript = true;
  gsap.registerPlugin(ScrollTrigger);
  var $section = document.querySelector(SELECTORS.section);
  if (!$section) return;
  var $logos = $section.querySelectorAll(SELECTORS.logo);
  if (!$logos.length) return;
  var mm = gsap.matchMedia();
  mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1, "px)"), function () {
    if (!loadScript) return;
    var groups = Array.from($logos).reduce(function (acc, logo, index) {
      var groupIndex = Math.floor(index / 3);
      acc[groupIndex] = acc[groupIndex] || [];
      acc[groupIndex].push(logo);
      return acc;
    }, []);
    groups.forEach(function (group) {
      var tl = gsap.timeline({
        paused: true
      });
      ScrollTrigger.create({
        trigger: group,
        start: 'top 80%',
        end: 'bottom top',
        scroller: '.wrapper_in',
        // markers: true,
        animation: tl
      });
      tl.fromTo(group, {
        opacity: 0,
        y: 100
      }, {
        opacity: 1,
        y: 0
      });
    });
  });
  loadScript = false;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (logos);

/***/ }),

/***/ "./src/scripts/components/our-capabilities.js":
/*!****************************************************!*\
  !*** ./src/scripts/components/our-capabilities.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ourCapabilities = function ourCapabilities() {
  var SELECTORS = {
    section: '.js-our-capabilities-section',
    flash: '.js-flashlight-bg'
  };
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  $sections.forEach(function ($section) {
    var $flashlight = $section.querySelector(SELECTORS.flash);
    if (!$flashlight) return;
    var handleMouseMove = function handleMouseMove(e) {
      var sectionRect = $section.getBoundingClientRect();
      var relativeX = (e.clientX - sectionRect.left) / $section.clientWidth * 100;
      var relativeY = (e.clientY - sectionRect.top) / $section.clientHeight * 100;
      $flashlight.style.background = "radial-gradient(circle 25rem at ".concat(relativeX, "% ").concat(relativeY, "%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%");
    };
    var handleMouseLeave = function handleMouseLeave() {
      $flashlight.style.background = 'rgba(0, 0, 0, 0.5)';
    };
    $section.addEventListener('mousemove', handleMouseMove);
    $section.addEventListener('mouseleave', handleMouseLeave);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ourCapabilities);

/***/ }),

/***/ "./src/scripts/components/our-manifesto.js":
/*!*************************************************!*\
  !*** ./src/scripts/components/our-manifesto.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/scripts/utils/index.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var ourManifesto = function ourManifesto() {
  var SELECTORS = {
    section: '.js-our-manifesto-section',
    item: '.js-our-manifesto-item'
  };
  var CLASSES = {
    activeState: 'our_manifesto__item--active_state',
    activePicState: 'our_manifesto__pic--active_state'
  };
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  var addActiveState = function addActiveState(item) {
    if (!item.classList.contains(CLASSES.activeState)) {
      item.classList.add(CLASSES.activeState);
    }
  };
  var removeActiveState = function removeActiveState(item) {
    if (item.classList.contains(CLASSES.activeState)) {
      item.classList.remove(CLASSES.activeState);
    }
  };
  var loadScript = true;
  $sections.forEach(function ($section) {
    var $items = $section.querySelectorAll(SELECTORS.item);
    if (!$items.length) return;
    gsap.registerPlugin(TweenMax, ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1201px)', function () {
      if (!loadScript) return;
      var getMousePos = function getMousePos(e) {
        var posx = 0;
        var posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
        } else if (e.clientX || e.clientY) {
          posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {
          x: posx,
          y: posy
        };
      };
      var HoverImgFx3 = /*#__PURE__*/function () {
        function HoverImgFx3(el) {
          _classCallCheck(this, HoverImgFx3);
          this.DOM = {
            el: el
          };
          this.DOM.reveal = document.createElement('div');
          this.DOM.reveal.className = 'hover-reveal';
          this.DOM.reveal.style.overflow = 'hidden';
          if (this.DOM.el.dataset.text) {
            this.DOM.reveal.innerHTML = "<div class=\"hover-reveal__inner\">\n\t\t\t\t\t\t<div class=\"hover-reveal__img\" style=\"background-image:url(".concat(this.DOM.el.dataset.img, ")\"></div>\n\t\t\t\t\t\t\t<div class=\"hover-reveal__text\">").concat(this.DOM.el.dataset.text, "</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t");
          } else {
            this.DOM.reveal.innerHTML = "<div class=\"hover-reveal__inner\"><div class=\"hover-reveal__img\" style=\"background-image:url(".concat(this.DOM.el.dataset.img, ")\"></div></div>");
          }
          this.DOM.el.appendChild(this.DOM.reveal);
          this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
          this.DOM.revealInner.style.overflow = 'hidden';
          this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');
          this.initEvents();
        }
        _createClass(HoverImgFx3, [{
          key: "initEvents",
          value: function initEvents() {
            var _this = this;
            this.positionElement = function (ev) {
              var mousePos = getMousePos(ev);
              var parentRect = _this.DOM.el.getBoundingClientRect();
              var docScrolls = {
                left: document.body.scrollLeft + document.documentElement.scrollLeft,
                top: document.body.scrollTop + document.documentElement.scrollTop
              };
              _this.DOM.reveal.style.top = "".concat(mousePos.y - parentRect.top + docScrolls.top + 20, "px");
              _this.DOM.reveal.style.left = "".concat(mousePos.x - parentRect.left + docScrolls.left + 20, "px");
            };
            this.mouseenterFn = function (ev) {
              _this.positionElement(ev);
              _this.showImage();
            };
            this.mousemoveFn = function (ev) {
              return requestAnimationFrame(function () {
                _this.positionElement(ev);
              });
            };
            this.mouseleaveFn = function () {
              _this.hideImage();
            };
            this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
            this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
            this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
          }
        }, {
          key: "showImage",
          value: function showImage() {
            var _this2 = this;
            TweenMax.killTweensOf(this.DOM.revealInner);
            TweenMax.killTweensOf(this.DOM.revealImg);
            this.tl = new TimelineMax({
              onStart: function onStart() {
                _this2.DOM.reveal.style.opacity = 1;
                TweenMax.set(_this2.DOM.el, {
                  zIndex: 1000
                });
              }
            }).add('begin').set([this.DOM.revealInner, this.DOM.revealImg], {
              transformOrigin: '50% 100%'
            }).add(new TweenMax(this.DOM.revealInner, 0.4, {
              ease: Expo.easeOut,
              startAt: {
                x: '50%',
                y: '120%',
                rotation: 50
              },
              x: '0%',
              y: '0%',
              rotation: 0
            }), 'begin').add(new TweenMax(this.DOM.revealImg, 0.4, {
              ease: Expo.easeOut,
              startAt: {
                x: '-50%',
                y: '-120%',
                rotation: -50
              },
              x: '0%',
              y: '0%',
              rotation: 0
            }), 'begin').add(new TweenMax(this.DOM.revealImg, 0.7, {
              ease: Expo.easeOut,
              startAt: {
                scale: 2
              },
              scale: 1
            }), 'begin');
          }
        }, {
          key: "hideImage",
          value: function hideImage() {
            var _this3 = this;
            TweenMax.killTweensOf(this.DOM.revealInner);
            TweenMax.killTweensOf(this.DOM.revealImg);
            this.tl = new TimelineMax({
              onStart: function onStart() {
                TweenMax.set(_this3.DOM.el, {
                  zIndex: 999
                });
              },
              onComplete: function onComplete() {
                TweenMax.set(_this3.DOM.el, {
                  zIndex: ''
                });
                TweenMax.set(_this3.DOM.reveal, {
                  opacity: 0
                });
              }
            }).add('begin').add(new TweenMax(this.DOM.revealInner, 0.6, {
              ease: Expo.easeOut,
              y: '-120%',
              rotation: -5
            }), 'begin').add(new TweenMax(this.DOM.revealImg, 0.6, {
              ease: Expo.easeOut,
              y: '120%',
              rotation: 5,
              scale: 1.2
            }), 'begin');
          }
        }]);
        return HoverImgFx3;
      }();
      $items.forEach(function ($item) {
        return new HoverImgFx3($item);
      });
    });
    loadScript = false;
    $items.forEach(function ($item, index) {
      ScrollTrigger.create({
        scroller: '.wrapper_in',
        trigger: $item,
        start: 'top center',
        end: 'bottom center',
        // markers: true,
        onEnter: function onEnter() {
          addActiveState($item);
        },
        onEnterBack: function onEnterBack() {
          addActiveState($item);
        },
        onLeave: function onLeave() {
          if (index !== $items.length - 1) {
            removeActiveState($item);
          }
        },
        onLeaveBack: function onLeaveBack() {
          if (index !== 0) {
            removeActiveState($item);
          }
        }
      });
    });
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ourManifesto);

/***/ }),

/***/ "./src/scripts/components/our-services.js":
/*!************************************************!*\
  !*** ./src/scripts/components/our-services.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/scripts/utils/index.js");
/* harmony import */ var _smooth_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./smooth-animation */ "./src/scripts/components/smooth-animation.js");



var ourServices = function ourServices() {
  var SELECTORS = {
    section: '.js-our-services-section',
    item: '.js-our-services-item',
    content: '.js-our-services-content',
    picture: '.js-our-services-picture'
  };
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  var slideTriggers = [];
  $sections.forEach(function ($section) {
    var $items = $section.querySelectorAll(SELECTORS.item);
    if (!$items.length) return;
    var $itemsLength = $items.length;
    var contentHeightArr = [];
    var mm = gsap.matchMedia();
    mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1, "px)"), function () {
      gsap.registerPlugin(ScrollTrigger);
      var opacityContent = 0.4;
      var entranceAnimation = function entranceAnimation(index, content, picture, nextContent, nextPicture) {
        var tl = gsap.timeline();
        var contentWidth;
        var pictureWidth;
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.onWindowResize)(function () {
          contentWidth = content.clientWidth;
          pictureWidth = picture.clientWidth;
        });
        if (index !== $items.length - 1) {
          tl.addLabel("content_".concat(index)).fromTo(content, {
            opacity: 1
          }, {
            opacity: 0
          }, "content_".concat(index)).fromTo(nextContent, {
            opacity: opacityContent,
            x: contentWidth + 390
          }, {
            opacity: 1,
            x: 0
          }, "content_".concat(index)).fromTo(nextPicture, {
            x: pictureWidth + 2
          }, {
            x: 0,
            delay: 0.2
          }, "content_".concat(index)).to(picture, {
            opacity: 0
          });
        }
        if ($items[index + 2]) {
          tl.fromTo($items[index + 2], {
            opacity: 0
          }, {
            opacity: 1
          }, "content_".concat(index));
        }
      };
      var exitAnimation = function exitAnimation(index, content, picture, nextContent, nextPicture) {
        var tl = gsap.timeline();
        var contentWidth;
        var pictureWidth;
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.onWindowResize)(function () {
          contentWidth = content.clientWidth;
          pictureWidth = picture.clientWidth;
        });
        if (index !== $items.length - 1) {
          tl.addLabel("content_".concat(index)).fromTo(content, {
            opacity: 0
          }, {
            duration: 1,
            opacity: 1
          }, "content_".concat(index)).fromTo(nextContent, {
            opacity: 0,
            x: 0
          }, {
            opacity: opacityContent,
            x: contentWidth + 390
          }, "content_".concat(index)).to(picture, {
            opacity: 1
          }, "content_".concat(index)).fromTo(nextPicture, {
            x: 0
          }, {
            x: pictureWidth + 2,
            delay: 0.2
          }, "content_".concat(index));
        }
        if ($items[index + 2]) {
          tl.fromTo($items[index + 2], {
            opacity: opacityContent
          }, {
            opacity: 0
          }, "content_".concat(index));
        }
      };
      var getContentHeightVal = function getContentHeightVal() {
        $items.forEach(function ($item) {
          var $content = $item.querySelector(SELECTORS.content);
          var contentHeight = $content.clientHeight;
          contentHeightArr.push(contentHeight);
        });
      };
      getContentHeightVal();
      var maxValueHeightContent = contentHeightArr.reduce(function (acc, item) {
        if (acc < item) {
          return item;
        } else {
          return acc;
        }
      }, 0);
      $items.forEach(function ($item, index) {
        var $content = $item.querySelector(SELECTORS.content);
        if (!$content) return;
        var $picture = $item.querySelector(SELECTORS.picture);
        if (!$picture) return;
        var contentWidth = $content.clientWidth;
        var pictureWidth = $picture.clientWidth;
        if (index !== 0) {
          gsap.set($content, {
            x: contentWidth + 390,
            opacity: opacityContent
          });
          gsap.set($picture, {
            x: pictureWidth + 2
          });
        } else {
          gsap.set($content, {
            opacity: 1
          });
          gsap.set($picture, {
            opacity: 1
          });
        }
        $content.style.height = "".concat(maxValueHeightContent, "px");
        var $nextEl = $item.nextElementSibling;
        if (!$nextEl) return;
        var $nextElContent = $nextEl.querySelector(SELECTORS.content);
        var $nextElPicture = $nextEl.querySelector(SELECTORS.picture);
        slideTriggers[index] = ScrollTrigger.create({
          scroller: '.wrapper_in',
          trigger: $item,
          // markers: true,
          start: function start() {
            return "".concat(window.innerHeight / 2 + window.innerHeight * index * 0.6, " top");
          },
          end: function end() {
            return "+=".concat(window.innerHeight);
          },
          onEnter: function onEnter() {
            entranceAnimation(index, $content, $picture, $nextElContent, $nextElPicture);
          },
          onLeaveBack: function onLeaveBack() {
            exitAnimation(index, $content, $picture, $nextElContent, $nextElPicture);
          }
        });
      });
      ScrollTrigger.create({
        scroller: '.wrapper_in',
        trigger: $section,
        start: 'top top',
        end: "+=".concat(($itemsLength - 1) * window.innerHeight),
        pin: true,
        scrub: 1,
        // markers: true,
        invalidateOnRefresh: true
      });
    });
    mm.add("(max-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1 - 1, "px)"), function () {
      $items.forEach(function ($item, index) {
        var $content = $item.querySelector(SELECTORS.content);
        if (!$content) return;
        var $picture = $item.querySelector(SELECTORS.picture);
        if (!$picture) return;
        gsap.set($content, {
          opacity: 1
        });
        gsap.set($picture, {
          opacity: 1
        });
        gsap.set($item, {
          opacity: 1
        });
        $content.style.height = 'auto';
      });
    });
  });
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.onWindowResize)(function () {
    return _smooth_animation__WEBPACK_IMPORTED_MODULE_2__.scroll.update();
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ourServices);

/***/ }),

/***/ "./src/scripts/components/preloader.js":
/*!*********************************************!*\
  !*** ./src/scripts/components/preloader.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _smooth_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./smooth-animation */ "./src/scripts/components/smooth-animation.js");
/* harmony import */ var _assets_libs_CustomEase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../assets/libs/CustomEase */ "./assets/libs/CustomEase.js");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");
/* harmony import */ var _hero__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hero */ "./src/scripts/components/hero.js");
/* harmony import */ var _projects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./projects */ "./src/scripts/components/projects.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }





var preloader = function preloader() {
  var SELECTORS = {
    item: '.js-preload-item',
    preloadMob: '.js-preload-mob'
  };
  var CLASSES = {
    activeState: 'body--preload'
  };
  var preloaderEnable = true;
  gsap.registerPlugin(_assets_libs_CustomEase__WEBPACK_IMPORTED_MODULE_1__.CustomEase);
  var $items = document.querySelectorAll(SELECTORS.item);
  if (!$items.length) return;
  var $preloadMob = document.querySelector(SELECTORS.preloadMob);
  var srcArr = [];
  var $body = document.body;
  var mm = gsap.matchMedia();
  var addClass = function addClass() {
    $body.classList.add(CLASSES.activeState);
  };
  $preloadMob.style.opacity = '0';
  var scrollDisable = function scrollDisable() {
    _smooth_animation__WEBPACK_IMPORTED_MODULE_0__.scroll.stop();
  };
  scrollDisable();
  var scrollEnable = function scrollEnable() {
    _smooth_animation__WEBPACK_IMPORTED_MODULE_0__.scroll.start();
  };
  addClass();
  var removeClass = function removeClass() {
    if ($body.classList.contains(CLASSES.activeState)) {
      $body.classList.remove(CLASSES.activeState);
    }
  };
  var setDisableOpacityBody = function setDisableOpacityBody() {
    $body.style.opacity = '0';
  };
  setDisableOpacityBody();
  var setEnableOpacityBody = function setEnableOpacityBody() {
    $body.style.opacity = '1';
  };
  var createImg = function createImg(src, index) {
    var img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', "Image ".concat(index + 1));
    return img;
  };
  $items.forEach(function ($item, index) {
    var srcForImg = $item.getAttribute('data-src');
    if (!srcForImg) return;
    srcArr.push(srcForImg);
  });
  var shuffledImages = srcArr.sort(function () {
    return Math.random() - 0.5;
  });
  var selectedImages = shuffledImages.slice(0, 3);
  selectedImages.forEach(function (src, index) {
    var $item = $items[index];
    var img = createImg(src, index);
    $item.appendChild(img);
  });
  var deleteEmpItems = function deleteEmpItems(item) {
    if (!item.querySelector('img')) {
      item.remove();
    }
  };
  $items.forEach(function ($item, index) {
    deleteEmpItems($item);
  });
  mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_2__.BREAKPOINTS.mediaPoint1, "px)"), function () {
    if (!preloaderEnable) return;
    var tl = gsap.timeline({
      delay: 1
    });
    var easeCustom = _assets_libs_CustomEase__WEBPACK_IMPORTED_MODULE_1__.CustomEase.create('custom', 'M0,0 C0,0 0.514,0.082 0.596,0.158 0.788,0.336 0.8,0.393 0.888,0.67 0.934,0.816 0.924,0.875 0.942,0.936 0.96,1 1,1 1,1');
    var $newItems = document.querySelectorAll(SELECTORS.item);
    if (!$newItems.length) return;
    var $newItemsReverse = _toConsumableArray($newItems).reverse();
    var setOpacityItem = function setOpacityItem() {
      gsap.set($newItemsReverse, {
        opacity: 1
      });
    };
    tl.to($newItemsReverse, {
      stagger: 1.2,
      duration: 0.8,
      yPercent: -100,
      ease: easeCustom,
      onStart: function onStart() {
        setOpacityItem();
        setEnableOpacityBody();
      },
      onComplete: function onComplete() {
        _hero__WEBPACK_IMPORTED_MODULE_3__.tlHero.play();
        (0,_projects__WEBPACK_IMPORTED_MODULE_4__["default"])();
        setTimeout(function () {
          removeClass();
          scrollEnable();
        }, 1000);
      }
    });
  });
  mm.add("(max-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_2__.BREAKPOINTS.mediaPoint1 - 1, "px)"), function () {
    if (!preloaderEnable) return;
    var setOpacityItemMob = function setOpacityItemMob() {
      gsap.to($preloadMob, {
        opacity: 0
      });
    };
    if ($preloadMob && preloaderEnable) {
      gsap.to($preloadMob, {
        duration: 3,
        onStart: function onStart() {
          setEnableOpacityBody();
          $preloadMob.style.opacity = '1';
        },
        onComplete: function onComplete() {
          _hero__WEBPACK_IMPORTED_MODULE_3__.tlHero.play();
          (0,_projects__WEBPACK_IMPORTED_MODULE_4__["default"])();
          setTimeout(function () {
            setOpacityItemMob();
            removeClass();
            scrollEnable();
          }, 500);
        }
      });
    } else {
      setEnableOpacityBody();
      setOpacityItemMob();
    }
  });
  preloaderEnable = false;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (preloader);

/***/ }),

/***/ "./src/scripts/components/projects.js":
/*!********************************************!*\
  !*** ./src/scripts/components/projects.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");

var projects = function projects() {
  var SELECTORS = {
    section: '.js-projects-section',
    list: '.js-projects-list',
    item: '.js-item-projects',
    subtitle: '.js-projects-subtitle',
    title: '.js-projects-title',
    label: '.js-projects-label'
  };
  var loadScript = true;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  $sections.forEach(function ($section) {
    var $list = $section.querySelector(SELECTORS.list);
    if (!$list) return;
    var $items = $section.querySelectorAll(SELECTORS.item);
    if (!$list) return;
    // console.log($items);

    $items.forEach(function ($item, index) {
      var mm = gsap.matchMedia();
      mm.add("(min-width: ".concat(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.BREAKPOINTS.mediaPoint1, "px)"), function () {
        if (!loadScript) {
          return;
        } else {
          gsap.set($item, {
            opacity: 1
          });
        }
        var tl = gsap.timeline({
          paused: true
        });
        ScrollTrigger.create({
          trigger: $item,
          // start: `top ${$section.offsetTop}+=30`,
          start: 'top 90%',
          end: 'bottom center',
          scroller: '.wrapper_in',
          // markers: true,
          animation: tl
        });
        tl.fromTo($item, {
          opacity: 0,
          y: 100
        }, {
          stagger: 0.6,
          opacity: 1,
          duration: 0.8,
          y: 0
        });
        var $subtitle = $item.querySelector(SELECTORS.subtitle);
        if (!$subtitle) return;
        var $title = $item.querySelector(SELECTORS.title);
        if (!$title) return;
        var $label = $item.querySelector(SELECTORS.label);
        if (!$label) return;
        var $img = $item.querySelector('img');
        if (!$img) return;
        var $parentNode = $subtitle.parentElement;
        var tlContent = gsap.timeline({
          paused: true
        });
        var splitTitle = new SplitText($title, {
          type: 'words',
          linesClass: 'split-line'
        });
        var words = splitTitle.words;
        var allDone = function allDone() {
          splitTitle.revert();
        };
        ScrollTrigger.create({
          trigger: $parentNode,
          start: 'top 95%',
          end: 'bottom center',
          scroller: '.wrapper_in',
          // markers: true,
          animation: tlContent
        });
        tlContent.fromTo($subtitle, {
          y: 50,
          opacity: 0
        }, {
          y: 0,
          opacity: 1
        }, 'start_1').fromTo(words, {
          y: 50,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.1
        }, 'start_1').fromTo($label, {
          y: $label.clientHeight,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.1
        });
        // Parallax
        gsap.fromTo($img, {
          yPercent: -5,
          ease: "none"
        }, {
          scrollTrigger: {
            trigger: $img,
            scroller: '.wrapper_in',
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          },
          yPercent: 5,
          ease: "none"
        });
      });
    });
    loadScript = false;
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (projects);

/***/ }),

/***/ "./src/scripts/components/smooth-animation.js":
/*!****************************************************!*\
  !*** ./src/scripts/components/smooth-animation.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   globalUpdate: () => (/* binding */ globalUpdate),
/* harmony export */   scroll: () => (/* binding */ scroll)
/* harmony export */ });
/* harmony import */ var locomotive_scroll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! locomotive-scroll */ "./node_modules/locomotive-scroll/dist/locomotive-scroll.esm.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/scripts/utils/index.js");


var SELECTORS = {
  wrapper: '.wrapper',
  content: '.wrapper_in'
};
gsap.registerPlugin(ScrollTrigger, SplitText);
var $content = document.querySelector(SELECTORS.content);
var scroll = new locomotive_scroll__WEBPACK_IMPORTED_MODULE_0__["default"]({
  el: $content,
  smooth: true,
  tablet: {
    smooth: true
    // breakpoint: BREAKPOINTS.mediaPoint1,
  },

  getSpeed: true,
  multiplier: 0.8,
  firefoxMultiplier: 80
});
var smoothAnimation = function smoothAnimation() {
  scroll.on("scroll", ScrollTrigger.update);
  ScrollTrigger.scrollerProxy($content, {
    scrollTop: function scrollTop(value) {
      return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect: function getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    pinType: $content.style.transform ? "transform" : "fixed"
  });
  ScrollTrigger.addEventListener("refresh", function () {
    return scroll.update();
  });
  ScrollTrigger.refresh();
};
var globalUpdate = function globalUpdate() {
  scroll.update();
  ScrollTrigger.addEventListener("refresh", function () {
    return scroll.update();
  });
  ScrollTrigger.refresh();
};
(0,_utils__WEBPACK_IMPORTED_MODULE_1__.onWindowResize)(function () {
  // console.log('resize');
  globalUpdate();
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (smoothAnimation);

/***/ }),

/***/ "./src/scripts/components/team.js":
/*!****************************************!*\
  !*** ./src/scripts/components/team.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assets_libs_ScrollToPlugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../assets/libs/ScrollToPlugin */ "./assets/libs/ScrollToPlugin.js");
/* harmony import */ var _smooth_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./smooth-animation */ "./src/scripts/components/smooth-animation.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/scripts/utils/index.js");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/constants */ "./src/scripts/utils/constants.js");




var team = function team() {
  var SELECTORS = {
    section: '.js-team-section',
    item: '.js-team-item',
    btn: '.js-team-btn'
  };
  var CLASSES = {
    activeBtn: 'team__button--active_state'
  };
  var $sections = document.querySelectorAll(SELECTORS.section);
  if (!$sections.length) return;
  gsap.registerPlugin(ScrollTrigger, _assets_libs_ScrollToPlugin__WEBPACK_IMPORTED_MODULE_0__.ScrollToPlugin);
  $sections.forEach(function ($section) {
    var $items = $section.querySelectorAll(SELECTORS.item);
    var $item = $section.querySelector(SELECTORS.item);
    var $btn = $section.querySelector(SELECTORS.btn);
    if (!$btn) return;
    var tl = gsap.timeline({
      paused: true
    });
    var $nextSection = $section.nextElementSibling;
    var $prevSection = $section.previousElementSibling;
    var addActiveClass = function addActiveClass() {
      $btn.classList.add(CLASSES.activeBtn);
    };
    var removeActiveClass = function removeActiveClass() {
      $btn.classList.remove(CLASSES.activeBtn);
    };
    var scrollDown = function scrollDown() {
      $btn.style.transform = 'rotate(0deg)';
      if (!$nextSection) return;
      $btn.addEventListener('click', function () {
        _smooth_animation__WEBPACK_IMPORTED_MODULE_1__.scroll.scrollTo($nextSection);
        gsap.to(window, {
          scrollTo: $nextSection
        });
      });
    };
    var scrollUp = function scrollUp() {
      $btn.style.transform = 'rotate(180deg)';
      if (!$prevSection) return;
      $btn.addEventListener('click', function () {
        _smooth_animation__WEBPACK_IMPORTED_MODULE_1__.scroll.scrollTo($prevSection);
        gsap.to(window, {
          scrollTo: $prevSection
        });
      });
    };
    ScrollTrigger.create({
      scroller: '.wrapper_in',
      trigger: $section,
      start: 'top top',
      end: "".concat($item.offsetWidth * $items.length, " top"),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      // markers: true,
      onEnter: function onEnter() {
        setTimeout(function () {
          addActiveClass();
          scrollDown();
        }, 0.5);
      },
      onEnterBack: function onEnterBack() {
        setTimeout(function () {
          addActiveClass();
          scrollUp();
        }, 0.5);
      },
      onLeave: function onLeave() {
        setTimeout(function () {
          removeActiveClass();
        }, 0.5);
      },
      onLeaveBack: function onLeaveBack() {
        setTimeout(function () {
          removeActiveClass();
        }, 0.5);
      },
      animation: tl
    });
    tl.to($items, {
      xPercent: -100 * ($items.length - 1),
      ease: 'none'
    });
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.onWindowResize)(function () {
      (0,_smooth_animation__WEBPACK_IMPORTED_MODULE_1__.globalUpdate)();
    });
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (team);

/***/ }),

/***/ "./src/scripts/utils/constants.js":
/*!****************************************!*\
  !*** ./src/scripts/utils/constants.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BREAKPOINTS: () => (/* binding */ BREAKPOINTS),
/* harmony export */   BUILD_PATHS: () => (/* binding */ BUILD_PATHS),
/* harmony export */   DEFAULT_GSAP_EASE: () => (/* binding */ DEFAULT_GSAP_EASE),
/* harmony export */   ENV_STATUS: () => (/* binding */ ENV_STATUS),
/* harmony export */   RADIAN: () => (/* binding */ RADIAN)
/* harmony export */ });
var ENV_STATUS = {
  projectDevStatus: "development" === 'development',
  projectWpBuildStatus: "development" === 'wp'
};
var phpVars = {
  themeUrl: ''
};
var BUILD_PATHS = {
  // eslint-disable-next-line no-undef
  spritePath:  false ? 0 : 'images/sprite/sprite.svg'
};
var RADIAN = Math.PI / 180;
var DEFAULT_GSAP_EASE = 'expo';
// similar css ease — cubic-bezier(.19, 1, .22, 1)

var BREAKPOINTS = {
  mediaPoint1: 768,
  // mediaPoint2: 768,
  mediaPoint3: 480,
  mediaPoint4: 320
};

// export let loadScript = true;

/***/ }),

/***/ "./src/scripts/utils/index.js":
/*!************************************!*\
  !*** ./src/scripts/utils/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calcMobileRemValue: () => (/* binding */ calcMobileRemValue),
/* harmony export */   calcRemValue: () => (/* binding */ calcRemValue),
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   debounceImmediate: () => (/* binding */ debounceImmediate),
/* harmony export */   detectUsersOS: () => (/* binding */ detectUsersOS),
/* harmony export */   documentReady: () => (/* binding */ documentReady),
/* harmony export */   exist: () => (/* binding */ exist),
/* harmony export */   getRandom: () => (/* binding */ getRandom),
/* harmony export */   getRandomInt: () => (/* binding */ getRandomInt),
/* harmony export */   getWindowSize: () => (/* binding */ getWindowSize),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isTouchDevice: () => (/* binding */ isTouchDevice),
/* harmony export */   onWindowChangeOrientation: () => (/* binding */ onWindowChangeOrientation),
/* harmony export */   onWindowResize: () => (/* binding */ onWindowResize),
/* harmony export */   onWindowScroll: () => (/* binding */ onWindowScroll),
/* harmony export */   pageLoad: () => (/* binding */ pageLoad)
/* harmony export */ });
var exist = function exist(elementOrArray) {
  if (!elementOrArray && elementOrArray !== 0) return false;
  if (elementOrArray.length === 0) {
    return false;
  }
  return true;
};
function debounce(delay, fn) {
  var timerId;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(function () {
      fn.apply(void 0, args);
      timerId = null;
    }, delay);
  };
}
function debounceImmediate(delay, fn) {
  var fired = false;
  return function () {
    if (!fired) {
      fn.apply(void 0, arguments);
      fired = true;
      setTimeout(function () {
        fired = false;
      }, delay);
    }
  };
}
var isTouchDevice = function isTouchDevice() {
  return 'ontouchstart' in window || window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
};
var calcRemValue = function calcRemValue(_ref) {
  var windowWidth = _ref.windowWidth,
    windowHeight = _ref.windowHeight;
  var remValue = windowWidth * 0.5625 > windowHeight ? windowHeight / 800 * 10 : windowWidth / 1440 * 10;
  document.documentElement.style.setProperty('--rem', "".concat(remValue, "px"));
};
var calcMobileRemValue = function calcMobileRemValue(_ref2) {
  var windowHeight = _ref2.windowHeight;
  var mobileRemValue = windowHeight / 800 * 10;
  document.documentElement.style.setProperty('--mobile-rem', "".concat(mobileRemValue, "px"));
};
var getRandomInt = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
var getRandom = function getRandom(min, max) {
  return Math.random() * (max - min) + min;
};
function isFunction(func) {
  return func instanceof Function;
}
function getWindowSize() {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  return {
    windowWidth: windowWidth,
    windowHeight: windowHeight
  };
}
var onWindowResize = function onWindowResize(cb) {
  if (!cb && !isFunction(cb)) return;
  var handleResize = function handleResize() {
    cb();
  };
  window.addEventListener('resize', debounce(15, handleResize));
  handleResize();
};
var detectUsersOS = function detectUsersOS() {
  if (window.navigator.userAgent.indexOf('Win') !== -1) return 'Windows OS';
  if (window.navigator.userAgent.indexOf('Mac') !== -1) return 'Macintosh';
  if (window.navigator.userAgent.indexOf('Linux') !== -1) return 'Linux OS';
  if (window.navigator.userAgent.indexOf('Android') !== -1) return 'Android OS';
  if (window.navigator.userAgent.indexOf('like Mac') !== -1) return 'iOS';
  return null;
};
var onWindowChangeOrientation = function onWindowChangeOrientation(cb) {
  if (!cb && !isFunction(cb) || !isTouchDevice()) return;
  var _getWindowSize = getWindowSize(),
    windowWidth = _getWindowSize.windowWidth;
  var handleResize = function handleResize() {
    var _getWindowSize2 = getWindowSize(),
      newWindowWidth = _getWindowSize2.windowWidth;
    if (windowWidth !== newWindowWidth) cb();
    windowWidth = newWindowWidth;
  };
  window.addEventListener('resize', debounce(100, handleResize));
};
var onWindowScroll = function onWindowScroll(cb) {
  if (!cb && !isFunction(cb)) return;
  var handleScroll = function handleScroll() {
    cb(window.pageYOffset);
  };
  window.addEventListener('scroll', debounce(15, handleScroll));
  handleScroll();
};
var documentReady = function documentReady(cb) {
  if (!cb && !isFunction(cb)) return;
  document.addEventListener('DOMContentLoaded', cb);
};
var pageLoad = function pageLoad(cb) {
  if (!cb && !isFunction(cb)) return;
  window.addEventListener('load', cb);
};

/***/ }),

/***/ "./src/scripts/utils/utils.js":
/*!************************************!*\
  !*** ./src/scripts/utils/utils.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calcMobileRemValue: () => (/* binding */ calcMobileRemValue),
/* harmony export */   calcRemValue: () => (/* binding */ calcRemValue),
/* harmony export */   calcViewportHeight: () => (/* binding */ calcViewportHeight),
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   debounceImmediate: () => (/* binding */ debounceImmediate),
/* harmony export */   detectUsersOS: () => (/* binding */ detectUsersOS),
/* harmony export */   documentReady: () => (/* binding */ documentReady),
/* harmony export */   exist: () => (/* binding */ exist),
/* harmony export */   getRandom: () => (/* binding */ getRandom),
/* harmony export */   getRandomInt: () => (/* binding */ getRandomInt),
/* harmony export */   getWindowSize: () => (/* binding */ getWindowSize),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isTouchDevice: () => (/* binding */ isTouchDevice),
/* harmony export */   onWindowChangeOrientation: () => (/* binding */ onWindowChangeOrientation),
/* harmony export */   onWindowResize: () => (/* binding */ onWindowResize),
/* harmony export */   onWindowScroll: () => (/* binding */ onWindowScroll),
/* harmony export */   pageLoad: () => (/* binding */ pageLoad)
/* harmony export */ });
var exist = function exist(elementOrArray) {
  if (!elementOrArray && elementOrArray !== 0) return false;
  if (elementOrArray.length === 0) {
    return false;
  }
  return true;
};
function debounce(delay, fn) {
  var timerId;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(function () {
      fn.apply(void 0, args);
      timerId = null;
    }, delay);
  };
}
function debounceImmediate(delay, fn) {
  var fired = false;
  return function () {
    if (!fired) {
      fn.apply(void 0, arguments);
      fired = true;
      setTimeout(function () {
        fired = false;
      }, delay);
    }
  };
}
var isTouchDevice = function isTouchDevice() {
  return 'ontouchstart' in window || window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
};
var calcViewportHeight = function calcViewportHeight() {
  var isMobileData = isMobile();
  var isApple = isMobileData.apple.phone;
  var isAndroid = isMobileData.android.phone;
  var isSeven = isMobileData.seven_inch;
  if (isApple || isAndroid || isSeven || isTouchDevice()) {
    var vh = window.innerHeight * 0.01;
    // console.log(vh);
    document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
  }
};
var calcRemValue = function calcRemValue(_ref) {
  var windowWidth = _ref.windowWidth,
    windowHeight = _ref.windowHeight;
  var remValue = windowWidth * 0.5625 > windowHeight ? windowHeight / 800 * 10 : windowWidth / 1440 * 10;
  document.documentElement.style.setProperty('--rem', "".concat(remValue, "px"));
};
var calcMobileRemValue = function calcMobileRemValue(_ref2) {
  var windowHeight = _ref2.windowHeight;
  var mobileRemValue = windowHeight / 800 * 10;
  document.documentElement.style.setProperty('--mobile-rem', "".concat(mobileRemValue, "px"));
};
var getRandomInt = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
var getRandom = function getRandom(min, max) {
  return Math.random() * (max - min) + min;
};
function isFunction(func) {
  return func instanceof Function;
}
function getWindowSize() {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  return {
    windowWidth: windowWidth,
    windowHeight: windowHeight
  };
}
var onWindowResize = function onWindowResize(cb) {
  if (!cb && !isFunction(cb)) return;
  var handleResize = function handleResize() {
    cb();
  };
  window.addEventListener('resize', debounce(15, handleResize));
  handleResize();
};
var detectUsersOS = function detectUsersOS() {
  if (window.navigator.userAgent.indexOf('Win') !== -1) return 'Windows OS';
  if (window.navigator.userAgent.indexOf('Mac') !== -1) return 'Macintosh';
  if (window.navigator.userAgent.indexOf('Linux') !== -1) return 'Linux OS';
  if (window.navigator.userAgent.indexOf('Android') !== -1) return 'Android OS';
  if (window.navigator.userAgent.indexOf('like Mac') !== -1) return 'iOS';
  return null;
};
var onWindowChangeOrientation = function onWindowChangeOrientation(cb) {
  if (!cb && !isFunction(cb) || !isTouchDevice()) return;
  var _getWindowSize = getWindowSize(),
    windowWidth = _getWindowSize.windowWidth;
  var handleResize = function handleResize() {
    var _getWindowSize2 = getWindowSize(),
      newWindowWidth = _getWindowSize2.windowWidth;
    if (windowWidth !== newWindowWidth) cb();
    windowWidth = newWindowWidth;
  };
  window.addEventListener('resize', debounce(100, handleResize));
};
var onWindowScroll = function onWindowScroll(cb) {
  if (!cb && !isFunction(cb)) return;
  var handleScroll = function handleScroll() {
    cb(window.pageYOffset);
  };
  window.addEventListener('scroll', debounce(15, handleScroll));
  handleScroll();
};
var documentReady = function documentReady(cb) {
  if (!cb && !isFunction(cb)) return;
  document.addEventListener('DOMContentLoaded', cb);
};
var pageLoad = function pageLoad(cb) {
  if (!cb && !isFunction(cb)) return;
  window.addEventListener('load', cb);
};

/***/ }),

/***/ "./node_modules/locomotive-scroll/dist/locomotive-scroll.esm.js":
/*!**********************************************************************!*\
  !*** ./node_modules/locomotive-scroll/dist/locomotive-scroll.esm.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Native: () => (/* binding */ Native),
/* harmony export */   Smooth: () => (/* binding */ Smooth),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* locomotive-scroll v4.1.3 | MIT License | https://github.com/locomotivemtl/locomotive-scroll */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var defaults = {
  el: document,
  name: 'scroll',
  offset: [0, 0],
  repeat: false,
  smooth: false,
  initPosition: {
    x: 0,
    y: 0
  },
  direction: 'vertical',
  gestureDirection: 'vertical',
  reloadOnContextChange: false,
  lerp: 0.1,
  "class": 'is-inview',
  scrollbarContainer: false,
  scrollbarClass: 'c-scrollbar',
  scrollingClass: 'has-scroll-scrolling',
  draggingClass: 'has-scroll-dragging',
  smoothClass: 'has-scroll-smooth',
  initClass: 'has-scroll-init',
  getSpeed: false,
  getDirection: false,
  scrollFromAnywhere: false,
  multiplier: 1,
  firefoxMultiplier: 50,
  touchMultiplier: 2,
  resetNativeScroll: true,
  tablet: {
    smooth: false,
    direction: 'vertical',
    gestureDirection: 'vertical',
    breakpoint: 1024
  },
  smartphone: {
    smooth: false,
    direction: 'vertical',
    gestureDirection: 'vertical'
  }
};

var _default = /*#__PURE__*/function () {
  function _default() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    Object.assign(this, defaults, options);
    this.smartphone = defaults.smartphone;
    if (options.smartphone) Object.assign(this.smartphone, options.smartphone);
    this.tablet = defaults.tablet;
    if (options.tablet) Object.assign(this.tablet, options.tablet);
    this.namespace = 'locomotive';
    this.html = document.documentElement;
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.windowMiddle = {
      x: this.windowWidth / 2,
      y: this.windowHeight / 2
    };
    this.els = {};
    this.currentElements = {};
    this.listeners = {};
    this.hasScrollTicking = false;
    this.hasCallEventSet = false;
    this.checkScroll = this.checkScroll.bind(this);
    this.checkResize = this.checkResize.bind(this);
    this.checkEvent = this.checkEvent.bind(this);
    this.instance = {
      scroll: {
        x: 0,
        y: 0
      },
      limit: {
        x: this.html.offsetWidth,
        y: this.html.offsetHeight
      },
      currentElements: this.currentElements
    };

    if (this.isMobile) {
      if (this.isTablet) {
        this.context = 'tablet';
      } else {
        this.context = 'smartphone';
      }
    } else {
      this.context = 'desktop';
    }

    if (this.isMobile) this.direction = this[this.context].direction;

    if (this.direction === 'horizontal') {
      this.directionAxis = 'x';
    } else {
      this.directionAxis = 'y';
    }

    if (this.getDirection) {
      this.instance.direction = null;
    }

    if (this.getDirection) {
      this.instance.speed = 0;
    }

    this.html.classList.add(this.initClass);
    window.addEventListener('resize', this.checkResize, false);
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {
      this.initEvents();
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      this.dispatchScroll();
    }
  }, {
    key: "checkResize",
    value: function checkResize() {
      var _this = this;

      if (!this.resizeTick) {
        this.resizeTick = true;
        requestAnimationFrame(function () {
          _this.resize();

          _this.resizeTick = false;
        });
      }
    }
  }, {
    key: "resize",
    value: function resize() {}
  }, {
    key: "checkContext",
    value: function checkContext() {
      if (!this.reloadOnContextChange) return;
      this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 || this.windowWidth < this.tablet.breakpoint;
      this.isTablet = this.isMobile && this.windowWidth >= this.tablet.breakpoint;
      var oldContext = this.context;

      if (this.isMobile) {
        if (this.isTablet) {
          this.context = 'tablet';
        } else {
          this.context = 'smartphone';
        }
      } else {
        this.context = 'desktop';
      }

      if (oldContext != this.context) {
        var oldSmooth = oldContext == 'desktop' ? this.smooth : this[oldContext].smooth;
        var newSmooth = this.context == 'desktop' ? this.smooth : this[this.context].smooth;
        if (oldSmooth != newSmooth) window.location.reload();
      }
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this2 = this;

      this.scrollToEls = this.el.querySelectorAll("[data-".concat(this.name, "-to]"));
      this.setScrollTo = this.setScrollTo.bind(this);
      this.scrollToEls.forEach(function (el) {
        el.addEventListener('click', _this2.setScrollTo, false);
      });
    }
  }, {
    key: "setScrollTo",
    value: function setScrollTo(event) {
      event.preventDefault();
      this.scrollTo(event.currentTarget.getAttribute("data-".concat(this.name, "-href")) || event.currentTarget.getAttribute('href'), {
        offset: event.currentTarget.getAttribute("data-".concat(this.name, "-offset"))
      });
    }
  }, {
    key: "addElements",
    value: function addElements() {}
  }, {
    key: "detectElements",
    value: function detectElements(hasCallEventSet) {
      var _this3 = this;

      var scrollTop = this.instance.scroll.y;
      var scrollBottom = scrollTop + this.windowHeight;
      var scrollLeft = this.instance.scroll.x;
      var scrollRight = scrollLeft + this.windowWidth;
      Object.entries(this.els).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            i = _ref2[0],
            el = _ref2[1];

        if (el && (!el.inView || hasCallEventSet)) {
          if (_this3.direction === 'horizontal') {
            if (scrollRight >= el.left && scrollLeft < el.right) {
              _this3.setInView(el, i);
            }
          } else {
            if (scrollBottom >= el.top && scrollTop < el.bottom) {
              _this3.setInView(el, i);
            }
          }
        }

        if (el && el.inView) {
          if (_this3.direction === 'horizontal') {
            var width = el.right - el.left;
            el.progress = (_this3.instance.scroll.x - (el.left - _this3.windowWidth)) / (width + _this3.windowWidth);

            if (scrollRight < el.left || scrollLeft > el.right) {
              _this3.setOutOfView(el, i);
            }
          } else {
            var height = el.bottom - el.top;
            el.progress = (_this3.instance.scroll.y - (el.top - _this3.windowHeight)) / (height + _this3.windowHeight);

            if (scrollBottom < el.top || scrollTop > el.bottom) {
              _this3.setOutOfView(el, i);
            }
          }
        }
      }); // this.els = this.els.filter((current, i) => {
      //     return current !== null;
      // });

      this.hasScrollTicking = false;
    }
  }, {
    key: "setInView",
    value: function setInView(current, i) {
      this.els[i].inView = true;
      current.el.classList.add(current["class"]);
      this.currentElements[i] = current;

      if (current.call && this.hasCallEventSet) {
        this.dispatchCall(current, 'enter');

        if (!current.repeat) {
          this.els[i].call = false;
        }
      } // if (!current.repeat && !current.speed && !current.sticky) {
      //     if (!current.call || current.call && this.hasCallEventSet) {
      //        this.els[i] = null
      //     }
      // }

    }
  }, {
    key: "setOutOfView",
    value: function setOutOfView(current, i) {
      var _this4 = this;

      // if (current.repeat || current.speed !== undefined) {
      this.els[i].inView = false; // }

      Object.keys(this.currentElements).forEach(function (el) {
        el === i && delete _this4.currentElements[el];
      });

      if (current.call && this.hasCallEventSet) {
        this.dispatchCall(current, 'exit');
      }

      if (current.repeat) {
        current.el.classList.remove(current["class"]);
      }
    }
  }, {
    key: "dispatchCall",
    value: function dispatchCall(current, way) {
      this.callWay = way;
      this.callValue = current.call.split(',').map(function (item) {
        return item.trim();
      });
      this.callObj = current;
      if (this.callValue.length == 1) this.callValue = this.callValue[0];
      var callEvent = new Event(this.namespace + 'call');
      this.el.dispatchEvent(callEvent);
    }
  }, {
    key: "dispatchScroll",
    value: function dispatchScroll() {
      var scrollEvent = new Event(this.namespace + 'scroll');
      this.el.dispatchEvent(scrollEvent);
    }
  }, {
    key: "setEvents",
    value: function setEvents(event, func) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }

      var list = this.listeners[event];
      list.push(func);

      if (list.length === 1) {
        this.el.addEventListener(this.namespace + event, this.checkEvent, false);
      }

      if (event === 'call') {
        this.hasCallEventSet = true;
        this.detectElements(true);
      }
    }
  }, {
    key: "unsetEvents",
    value: function unsetEvents(event, func) {
      if (!this.listeners[event]) return;
      var list = this.listeners[event];
      var index = list.indexOf(func);
      if (index < 0) return;
      list.splice(index, 1);

      if (list.index === 0) {
        this.el.removeEventListener(this.namespace + event, this.checkEvent, false);
      }
    }
  }, {
    key: "checkEvent",
    value: function checkEvent(event) {
      var _this5 = this;

      var name = event.type.replace(this.namespace, '');
      var list = this.listeners[name];
      if (!list || list.length === 0) return;
      list.forEach(function (func) {
        switch (name) {
          case 'scroll':
            return func(_this5.instance);

          case 'call':
            return func(_this5.callValue, _this5.callWay, _this5.callObj);

          default:
            return func();
        }
      });
    }
  }, {
    key: "startScroll",
    value: function startScroll() {}
  }, {
    key: "stopScroll",
    value: function stopScroll() {}
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.instance.scroll = {
        x: 0,
        y: 0
      };
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this6 = this;

      window.removeEventListener('resize', this.checkResize, false);
      Object.keys(this.listeners).forEach(function (event) {
        _this6.el.removeEventListener(_this6.namespace + event, _this6.checkEvent, false);
      });
      this.listeners = {};
      this.scrollToEls.forEach(function (el) {
        el.removeEventListener('click', _this6.setScrollTo, false);
      });
      this.html.classList.remove(this.initClass);
    }
  }]);

  return _default;
}();

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var smoothscroll = createCommonjsModule(function (module, exports) {
/* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */
(function () {

  // polyfill
  function polyfill() {
    // aliases
    var w = window;
    var d = document;

    // return if scroll behavior is supported and polyfill is not forced
    if (
      'scrollBehavior' in d.documentElement.style &&
      w.__forceSmoothScrollPolyfill__ !== true
    ) {
      return;
    }

    // globals
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    // object gathering original scroll methods
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      elementScroll: Element.prototype.scroll || scrollElement,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    // define timing method
    var now =
      w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;

    /**
     * indicates if a the current browser is made by Microsoft
     * @method isMicrosoftBrowser
     * @param {String} userAgent
     * @returns {Boolean}
     */
    function isMicrosoftBrowser(userAgent) {
      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }

    /*
     * IE has rounding bug rounding down clientHeight and clientWidth and
     * rounding up scrollHeight and scrollWidth causing false positives
     * on hasScrollableSpace
     */
    var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} firstArg
     * @returns {Boolean}
     */
    function shouldBailOut(firstArg) {
      if (
        firstArg === null ||
        typeof firstArg !== 'object' ||
        firstArg.behavior === undefined ||
        firstArg.behavior === 'auto' ||
        firstArg.behavior === 'instant'
      ) {
        // first argument is not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError(
        'behavior member of ScrollOptions ' +
          firstArg.behavior +
          ' is not a valid value for enumeration ScrollBehavior.'
      );
    }

    /**
     * indicates if an element has scrollable space in the provided axis
     * @method hasScrollableSpace
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function hasScrollableSpace(el, axis) {
      if (axis === 'Y') {
        return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
      }

      if (axis === 'X') {
        return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
      }
    }

    /**
     * indicates if an element has a scrollable overflow property in the axis
     * @method canOverflow
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function canOverflow(el, axis) {
      var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

      return overflowValue === 'auto' || overflowValue === 'scroll';
    }

    /**
     * indicates if an element can be scrolled in either axis
     * @method isScrollable
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function isScrollable(el) {
      var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
      var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

      return isScrollableY || isScrollableX;
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      while (el !== d.body && isScrollable(el) === false) {
        el = el.parentNode || el.host;
      }

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     * @returns {undefined}
     */
    function step(context) {
      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // scroll more if we have not reached our destination
      if (currentX !== context.x || currentY !== context.y) {
        w.requestAnimationFrame(step.bind(w, context));
      }
    }

    /**
     * scrolls window or element with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y
      });
    }

    // ORIGINAL METHODS OVERRIDES
    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scroll.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object'
              ? arguments[0]
              : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined
              ? arguments[1]
              : w.scrollY || w.pageYOffset
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        arguments[0].left !== undefined
          ? ~~arguments[0].left
          : w.scrollX || w.pageXOffset,
        arguments[0].top !== undefined
          ? ~~arguments[0].top
          : w.scrollY || w.pageYOffset
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object' ? arguments[0] : 0,
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined ? arguments[1] : 0
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scroll and Element.prototype.scrollTo
    Element.prototype.scroll = Element.prototype.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        // if one number is passed, throw error to match Firefox implementation
        if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
          throw new SyntaxError('Value could not be converted');
        }

        original.elementScroll.call(
          this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
        );

        return;
      }

      var left = arguments[0].left;
      var top = arguments[0].top;

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        this,
        this,
        typeof left === 'undefined' ? this.scrollLeft : ~~left,
        typeof top === 'undefined' ? this.scrollTop : ~~top
      );
    };

    // Element.prototype.scrollBy
    Element.prototype.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.elementScroll.call(
          this,
          arguments[0].left !== undefined
            ? ~~arguments[0].left + this.scrollLeft
            : ~~arguments[0] + this.scrollLeft,
          arguments[0].top !== undefined
            ? ~~arguments[0].top + this.scrollTop
            : ~~arguments[1] + this.scrollTop
        );

        return;
      }

      this.scroll({
        left: ~~arguments[0].left + this.scrollLeft,
        top: ~~arguments[0].top + this.scrollTop,
        behavior: arguments[0].behavior
      });
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scrollIntoView.call(
          this,
          arguments[0] === undefined ? true : arguments[0]
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );

        // reveal parent in viewport unless is fixed
        if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
          w.scrollBy({
            left: parentRects.left,
            top: parentRects.top,
            behavior: 'smooth'
          });
        }
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  {
    // commonjs
    module.exports = { polyfill: polyfill };
  }

}());
});
var smoothscroll_1 = smoothscroll.polyfill;

var _default$1 = /*#__PURE__*/function (_Core) {
  _inherits(_default, _Core);

  var _super = _createSuper(_default);

  function _default() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    _this = _super.call(this, options);

    if (_this.resetNativeScroll) {
      if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
      }

      window.scrollTo(0, 0);
    }

    window.addEventListener('scroll', _this.checkScroll, false);

    if (window.smoothscrollPolyfill === undefined) {
      window.smoothscrollPolyfill = smoothscroll;
      window.smoothscrollPolyfill.polyfill();
    }

    return _this;
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {
      this.instance.scroll.y = window.pageYOffset;
      this.addElements();
      this.detectElements();

      _get(_getPrototypeOf(_default.prototype), "init", this).call(this);
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      var _this2 = this;

      _get(_getPrototypeOf(_default.prototype), "checkScroll", this).call(this);

      if (this.getDirection) {
        this.addDirection();
      }

      if (this.getSpeed) {
        this.addSpeed();
        this.speedTs = Date.now();
      }

      this.instance.scroll.y = window.pageYOffset;

      if (Object.entries(this.els).length) {
        if (!this.hasScrollTicking) {
          requestAnimationFrame(function () {
            _this2.detectElements();
          });
          this.hasScrollTicking = true;
        }
      }
    }
  }, {
    key: "addDirection",
    value: function addDirection() {
      if (window.pageYOffset > this.instance.scroll.y) {
        if (this.instance.direction !== 'down') {
          this.instance.direction = 'down';
        }
      } else if (window.pageYOffset < this.instance.scroll.y) {
        if (this.instance.direction !== 'up') {
          this.instance.direction = 'up';
        }
      }
    }
  }, {
    key: "addSpeed",
    value: function addSpeed() {
      if (window.pageYOffset != this.instance.scroll.y) {
        this.instance.speed = (window.pageYOffset - this.instance.scroll.y) / Math.max(1, Date.now() - this.speedTs);
      } else {
        this.instance.speed = 0;
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      if (Object.entries(this.els).length) {
        this.windowHeight = window.innerHeight;
        this.updateElements();
      }
    }
  }, {
    key: "addElements",
    value: function addElements() {
      var _this3 = this;

      this.els = {};
      var els = this.el.querySelectorAll('[data-' + this.name + ']');
      els.forEach(function (el, index) {
        var BCR = el.getBoundingClientRect();
        var cl = el.dataset[_this3.name + 'Class'] || _this3["class"];
        var id = typeof el.dataset[_this3.name + 'Id'] === 'string' ? el.dataset[_this3.name + 'Id'] : index;
        var top;
        var left;
        var offset = typeof el.dataset[_this3.name + 'Offset'] === 'string' ? el.dataset[_this3.name + 'Offset'].split(',') : _this3.offset;
        var repeat = el.dataset[_this3.name + 'Repeat'];
        var call = el.dataset[_this3.name + 'Call'];
        var target = el.dataset[_this3.name + 'Target'];
        var targetEl;

        if (target !== undefined) {
          targetEl = document.querySelector("".concat(target));
        } else {
          targetEl = el;
        }

        var targetElBCR = targetEl.getBoundingClientRect();
        top = targetElBCR.top + _this3.instance.scroll.y;
        left = targetElBCR.left + _this3.instance.scroll.x;
        var bottom = top + targetEl.offsetHeight;
        var right = left + targetEl.offsetWidth;

        if (repeat == 'false') {
          repeat = false;
        } else if (repeat != undefined) {
          repeat = true;
        } else {
          repeat = _this3.repeat;
        }

        var relativeOffset = _this3.getRelativeOffset(offset);

        top = top + relativeOffset[0];
        bottom = bottom - relativeOffset[1];
        var mappedEl = {
          el: el,
          targetEl: targetEl,
          id: id,
          "class": cl,
          top: top,
          bottom: bottom,
          left: left,
          right: right,
          offset: offset,
          progress: 0,
          repeat: repeat,
          inView: false,
          call: call
        };
        _this3.els[id] = mappedEl;

        if (el.classList.contains(cl)) {
          _this3.setInView(_this3.els[id], id);
        }
      });
    }
  }, {
    key: "updateElements",
    value: function updateElements() {
      var _this4 = this;

      Object.entries(this.els).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            i = _ref2[0],
            el = _ref2[1];

        var top = el.targetEl.getBoundingClientRect().top + _this4.instance.scroll.y;

        var bottom = top + el.targetEl.offsetHeight;

        var relativeOffset = _this4.getRelativeOffset(el.offset);

        _this4.els[i].top = top + relativeOffset[0];
        _this4.els[i].bottom = bottom - relativeOffset[1];
      });
      this.hasScrollTicking = false;
    }
  }, {
    key: "getRelativeOffset",
    value: function getRelativeOffset(offset) {
      var relativeOffset = [0, 0];

      if (offset) {
        for (var i = 0; i < offset.length; i++) {
          if (typeof offset[i] == 'string') {
            if (offset[i].includes('%')) {
              relativeOffset[i] = parseInt(offset[i].replace('%', '') * this.windowHeight / 100);
            } else {
              relativeOffset[i] = parseInt(offset[i]);
            }
          } else {
            relativeOffset[i] = offset[i];
          }
        }
      }

      return relativeOffset;
    }
    /**
     * Scroll to a desired target.
     *
     * @param  Available options :
     *          target {node, string, "top", "bottom", int} - The DOM element we want to scroll to
     *          options {object} - Options object for additionnal settings.
     * @return {void}
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(target) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Parse options
      var offset = parseInt(options.offset) || 0; // An offset to apply on top of given `target` or `sourceElem`'s target

      var callback = options.callback ? options.callback : false; // function called when scrollTo completes (note that it won't wait for lerp to stabilize)

      if (typeof target === 'string') {
        // Selector or boundaries
        if (target === 'top') {
          target = this.html;
        } else if (target === 'bottom') {
          target = this.html.offsetHeight - window.innerHeight;
        } else {
          target = document.querySelector(target); // If the query fails, abort

          if (!target) {
            return;
          }
        }
      } else if (typeof target === 'number') {
        // Absolute coordinate
        target = parseInt(target);
      } else if (target && target.tagName) ; else {
        console.warn('`target` parameter is not valid');
        return;
      } // We have a target that is not a coordinate yet, get it


      if (typeof target !== 'number') {
        offset = target.getBoundingClientRect().top + offset + this.instance.scroll.y;
      } else {
        offset = target + offset;
      }

      var isTargetReached = function isTargetReached() {
        return parseInt(window.pageYOffset) === parseInt(offset);
      };

      if (callback) {
        if (isTargetReached()) {
          callback();
          return;
        } else {
          var onScroll = function onScroll() {
            if (isTargetReached()) {
              window.removeEventListener('scroll', onScroll);
              callback();
            }
          };

          window.addEventListener('scroll', onScroll);
        }
      }

      window.scrollTo({
        top: offset,
        behavior: options.duration === 0 ? 'auto' : 'smooth'
      });
    }
  }, {
    key: "update",
    value: function update() {
      this.addElements();
      this.detectElements();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(_default.prototype), "destroy", this).call(this);

      window.removeEventListener('scroll', this.checkScroll, false);
    }
  }]);

  return _default;
}(_default);

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

var tinyEmitter = E;

var lethargy = createCommonjsModule(function (module, exports) {
// Generated by CoffeeScript 1.9.2
(function() {
  var root;

  root =  exports !== null ? exports : this;

  root.Lethargy = (function() {
    function Lethargy(stability, sensitivity, tolerance, delay) {
      this.stability = stability != null ? Math.abs(stability) : 8;
      this.sensitivity = sensitivity != null ? 1 + Math.abs(sensitivity) : 100;
      this.tolerance = tolerance != null ? 1 + Math.abs(tolerance) : 1.1;
      this.delay = delay != null ? delay : 150;
      this.lastUpDeltas = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
      this.lastDownDeltas = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
      this.deltasTimestamp = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
    }

    Lethargy.prototype.check = function(e) {
      var lastDelta;
      e = e.originalEvent || e;
      if (e.wheelDelta != null) {
        lastDelta = e.wheelDelta;
      } else if (e.deltaY != null) {
        lastDelta = e.deltaY * -40;
      } else if ((e.detail != null) || e.detail === 0) {
        lastDelta = e.detail * -40;
      }
      this.deltasTimestamp.push(Date.now());
      this.deltasTimestamp.shift();
      if (lastDelta > 0) {
        this.lastUpDeltas.push(lastDelta);
        this.lastUpDeltas.shift();
        return this.isInertia(1);
      } else {
        this.lastDownDeltas.push(lastDelta);
        this.lastDownDeltas.shift();
        return this.isInertia(-1);
      }
    };

    Lethargy.prototype.isInertia = function(direction) {
      var lastDeltas, lastDeltasNew, lastDeltasOld, newAverage, newSum, oldAverage, oldSum;
      lastDeltas = direction === -1 ? this.lastDownDeltas : this.lastUpDeltas;
      if (lastDeltas[0] === null) {
        return direction;
      }
      if (this.deltasTimestamp[(this.stability * 2) - 2] + this.delay > Date.now() && lastDeltas[0] === lastDeltas[(this.stability * 2) - 1]) {
        return false;
      }
      lastDeltasOld = lastDeltas.slice(0, this.stability);
      lastDeltasNew = lastDeltas.slice(this.stability, this.stability * 2);
      oldSum = lastDeltasOld.reduce(function(t, s) {
        return t + s;
      });
      newSum = lastDeltasNew.reduce(function(t, s) {
        return t + s;
      });
      oldAverage = oldSum / lastDeltasOld.length;
      newAverage = newSum / lastDeltasNew.length;
      if (Math.abs(oldAverage) < Math.abs(newAverage * this.tolerance) && (this.sensitivity < Math.abs(newAverage))) {
        return direction;
      } else {
        return false;
      }
    };

    Lethargy.prototype.showLastUpDeltas = function() {
      return this.lastUpDeltas;
    };

    Lethargy.prototype.showLastDownDeltas = function() {
      return this.lastDownDeltas;
    };

    return Lethargy;

  })();

}).call(commonjsGlobal);
});

var support = (function getSupport() {
    return {
        hasWheelEvent: 'onwheel' in document,
        hasMouseWheelEvent: 'onmousewheel' in document,
        hasTouch: ('ontouchstart' in window) || window.TouchEvent || window.DocumentTouch && document instanceof DocumentTouch,
        hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
        hasPointer: !!window.navigator.msPointerEnabled,
        hasKeyDown: 'onkeydown' in document,
        isFirefox: navigator.userAgent.indexOf('Firefox') > -1
    };
})();

var toString = Object.prototype.toString,
    hasOwnProperty$1 = Object.prototype.hasOwnProperty;

var bindallStandalone = function(object) {
    if(!object) return console.warn('bindAll requires at least one argument.');

    var functions = Array.prototype.slice.call(arguments, 1);

    if (functions.length === 0) {

        for (var method in object) {
            if(hasOwnProperty$1.call(object, method)) {
                if(typeof object[method] == 'function' && toString.call(object[method]) == "[object Function]") {
                    functions.push(method);
                }
            }
        }
    }

    for(var i = 0; i < functions.length; i++) {
        var f = functions[i];
        object[f] = bind(object[f], object);
    }
};

/*
    Faster bind without specific-case checking. (see https://coderwall.com/p/oi3j3w).
    bindAll is only needed for events binding so no need to make slow fixes for constructor
    or partial application.
*/
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}

var Lethargy = lethargy.Lethargy;



var EVT_ID = 'virtualscroll';

var src = VirtualScroll;

var keyCodes = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32
};

function VirtualScroll(options) {
    bindallStandalone(this, '_onWheel', '_onMouseWheel', '_onTouchStart', '_onTouchMove', '_onKeyDown');

    this.el = window;
    if (options && options.el) {
        this.el = options.el;
        delete options.el;
    }
    this.options = objectAssign({
        mouseMultiplier: 1,
        touchMultiplier: 2,
        firefoxMultiplier: 15,
        keyStep: 120,
        preventTouch: false,
        unpreventTouchClass: 'vs-touchmove-allowed',
        limitInertia: false,
        useKeyboard: true,
        useTouch: true
    }, options);

    if (this.options.limitInertia) this._lethargy = new Lethargy();

    this._emitter = new tinyEmitter();
    this._event = {
        y: 0,
        x: 0,
        deltaX: 0,
        deltaY: 0
    };
    this.touchStartX = null;
    this.touchStartY = null;
    this.bodyTouchAction = null;

    if (this.options.passive !== undefined) {
        this.listenerOptions = {passive: this.options.passive};
    }
}

VirtualScroll.prototype._notify = function(e) {
    var evt = this._event;
    evt.x += evt.deltaX;
    evt.y += evt.deltaY;

   this._emitter.emit(EVT_ID, {
        x: evt.x,
        y: evt.y,
        deltaX: evt.deltaX,
        deltaY: evt.deltaY,
        originalEvent: e
   });
};

VirtualScroll.prototype._onWheel = function(e) {
    var options = this.options;
    if (this._lethargy && this._lethargy.check(e) === false) return;
    var evt = this._event;

    // In Chrome and in Firefox (at least the new one)
    evt.deltaX = e.wheelDeltaX || e.deltaX * -1;
    evt.deltaY = e.wheelDeltaY || e.deltaY * -1;

    // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
    // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
    if(support.isFirefox && e.deltaMode == 1) {
        evt.deltaX *= options.firefoxMultiplier;
        evt.deltaY *= options.firefoxMultiplier;
    }

    evt.deltaX *= options.mouseMultiplier;
    evt.deltaY *= options.mouseMultiplier;

    this._notify(e);
};

VirtualScroll.prototype._onMouseWheel = function(e) {
    if (this.options.limitInertia && this._lethargy.check(e) === false) return;

    var evt = this._event;

    // In Safari, IE and in Chrome if 'wheel' isn't defined
    evt.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
    evt.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;

    this._notify(e);
};

VirtualScroll.prototype._onTouchStart = function(e) {
    var t = (e.targetTouches) ? e.targetTouches[0] : e;
    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;
};

VirtualScroll.prototype._onTouchMove = function(e) {
    var options = this.options;
    if(options.preventTouch
        && !e.target.classList.contains(options.unpreventTouchClass)) {
        e.preventDefault();
    }

    var evt = this._event;

    var t = (e.targetTouches) ? e.targetTouches[0] : e;

    evt.deltaX = (t.pageX - this.touchStartX) * options.touchMultiplier;
    evt.deltaY = (t.pageY - this.touchStartY) * options.touchMultiplier;

    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;

    this._notify(e);
};

VirtualScroll.prototype._onKeyDown = function(e) {
    var evt = this._event;
    evt.deltaX = evt.deltaY = 0;
    var windowHeight = window.innerHeight - 40;

    switch(e.keyCode) {
        case keyCodes.LEFT:
        case keyCodes.UP:
            evt.deltaY = this.options.keyStep;
            break;

        case keyCodes.RIGHT:
        case keyCodes.DOWN:
            evt.deltaY = - this.options.keyStep;
            break;
        case  e.shiftKey:
            evt.deltaY = windowHeight;
            break;
        case keyCodes.SPACE:
            evt.deltaY = - windowHeight;
            break;
        default:
            return;
    }

    this._notify(e);
};

VirtualScroll.prototype._bind = function() {
    if(support.hasWheelEvent) this.el.addEventListener('wheel', this._onWheel, this.listenerOptions);
    if(support.hasMouseWheelEvent) this.el.addEventListener('mousewheel', this._onMouseWheel, this.listenerOptions);

    if(support.hasTouch && this.options.useTouch) {
        this.el.addEventListener('touchstart', this._onTouchStart, this.listenerOptions);
        this.el.addEventListener('touchmove', this._onTouchMove, this.listenerOptions);
    }

    if(support.hasPointer && support.hasTouchWin) {
        this.bodyTouchAction = document.body.style.msTouchAction;
        document.body.style.msTouchAction = 'none';
        this.el.addEventListener('MSPointerDown', this._onTouchStart, true);
        this.el.addEventListener('MSPointerMove', this._onTouchMove, true);
    }

    if(support.hasKeyDown && this.options.useKeyboard) document.addEventListener('keydown', this._onKeyDown);
};

VirtualScroll.prototype._unbind = function() {
    if(support.hasWheelEvent) this.el.removeEventListener('wheel', this._onWheel);
    if(support.hasMouseWheelEvent) this.el.removeEventListener('mousewheel', this._onMouseWheel);

    if(support.hasTouch) {
        this.el.removeEventListener('touchstart', this._onTouchStart);
        this.el.removeEventListener('touchmove', this._onTouchMove);
    }

    if(support.hasPointer && support.hasTouchWin) {
        document.body.style.msTouchAction = this.bodyTouchAction;
        this.el.removeEventListener('MSPointerDown', this._onTouchStart, true);
        this.el.removeEventListener('MSPointerMove', this._onTouchMove, true);
    }

    if(support.hasKeyDown && this.options.useKeyboard) document.removeEventListener('keydown', this._onKeyDown);
};

VirtualScroll.prototype.on = function(cb, ctx) {
  this._emitter.on(EVT_ID, cb, ctx);

  var events = this._emitter.e;
  if (events && events[EVT_ID] && events[EVT_ID].length === 1) this._bind();
};

VirtualScroll.prototype.off = function(cb, ctx) {
  this._emitter.off(EVT_ID, cb, ctx);

  var events = this._emitter.e;
  if (!events[EVT_ID] || events[EVT_ID].length <= 0) this._unbind();
};

VirtualScroll.prototype.reset = function() {
    var evt = this._event;
    evt.x = 0;
    evt.y = 0;
};

VirtualScroll.prototype.destroy = function() {
    this._emitter.off();
    this._unbind();
};

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function getTranslate(el) {
  var translate = {};
  if (!window.getComputedStyle) return;
  var style = getComputedStyle(el);
  var transform = style.transform || style.webkitTransform || style.mozTransform;
  var mat = transform.match(/^matrix3d\((.+)\)$/);

  if (mat) {
    translate.x = mat ? parseFloat(mat[1].split(', ')[12]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(', ')[13]) : 0;
  } else {
    mat = transform.match(/^matrix\((.+)\)$/);
    translate.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;
  }

  return translate;
}

/**
 * Returns an array containing all the parent nodes of the given node
 * @param  {object} node
 * @return {array} parent nodes
 */
function getParents(elem) {
  // Set up a parent array
  var parents = []; // Push each parent element to the array

  for (; elem && elem !== document; elem = elem.parentNode) {
    parents.push(elem);
  } // Return our parent array


  return parents;
} // https://gomakethings.com/how-to-get-the-closest-parent-element-with-a-matching-selector-using-vanilla-javascript/

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

function LinearEasing (x) {
  return x;
}

var src$1 = function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};

var keyCodes$1 = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  TAB: 9,
  PAGEUP: 33,
  PAGEDOWN: 34,
  HOME: 36,
  END: 35
};

var _default$2 = /*#__PURE__*/function (_Core) {
  _inherits(_default, _Core);

  var _super = _createSuper(_default);

  function _default() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);
    _this = _super.call(this, options);
    if (_this.inertia) _this.lerp = _this.inertia * 0.1;
    _this.isScrolling = false;
    _this.isDraggingScrollbar = false;
    _this.isTicking = false;
    _this.hasScrollTicking = false;
    _this.parallaxElements = {};
    _this.stop = false;
    _this.scrollbarContainer = options.scrollbarContainer;
    _this.checkKey = _this.checkKey.bind(_assertThisInitialized(_this));
    window.addEventListener('keydown', _this.checkKey, false);
    return _this;
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      this.html.classList.add(this.smoothClass);
      this.html.setAttribute("data-".concat(this.name, "-direction"), this.direction);
      this.instance = _objectSpread2({
        delta: {
          x: this.initPosition.x,
          y: this.initPosition.y
        },
        scroll: {
          x: this.initPosition.x,
          y: this.initPosition.y
        }
      }, this.instance);
      this.vs = new src({
        el: this.scrollFromAnywhere ? document : this.el,
        mouseMultiplier: navigator.platform.indexOf('Win') > -1 ? 1 : 0.4,
        firefoxMultiplier: this.firefoxMultiplier,
        touchMultiplier: this.touchMultiplier,
        useKeyboard: false,
        passive: true
      });
      this.vs.on(function (e) {
        if (_this2.stop) {
          return;
        }

        if (!_this2.isDraggingScrollbar) {
          requestAnimationFrame(function () {
            _this2.updateDelta(e);

            if (!_this2.isScrolling) _this2.startScrolling();
          });
        }
      });
      this.setScrollLimit();
      this.initScrollBar();
      this.addSections();
      this.addElements();
      this.checkScroll(true);
      this.transformElements(true, true);

      _get(_getPrototypeOf(_default.prototype), "init", this).call(this);
    }
  }, {
    key: "setScrollLimit",
    value: function setScrollLimit() {
      this.instance.limit.y = this.el.offsetHeight - this.windowHeight;

      if (this.direction === 'horizontal') {
        var totalWidth = 0;
        var nodes = this.el.children;

        for (var i = 0; i < nodes.length; i++) {
          totalWidth += nodes[i].offsetWidth;
        }

        this.instance.limit.x = totalWidth - this.windowWidth;
      }
    }
  }, {
    key: "startScrolling",
    value: function startScrolling() {
      this.startScrollTs = Date.now(); // Record timestamp

      this.isScrolling = true;
      this.checkScroll();
      this.html.classList.add(this.scrollingClass);
    }
  }, {
    key: "stopScrolling",
    value: function stopScrolling() {
      cancelAnimationFrame(this.checkScrollRaf); // Prevent checkScroll to continue looping
      //Pevent scrollbar glitch/locking

      this.startScrollTs = undefined;

      if (this.scrollToRaf) {
        cancelAnimationFrame(this.scrollToRaf);
        this.scrollToRaf = null;
      }

      this.isScrolling = false;
      this.instance.scroll.y = Math.round(this.instance.scroll.y);
      this.html.classList.remove(this.scrollingClass);
    }
  }, {
    key: "checkKey",
    value: function checkKey(e) {
      var _this3 = this;

      if (this.stop) {
        // If we are stopped, we don't want any scroll to occur because of a keypress
        // Prevent tab to scroll to activeElement
        if (e.keyCode == keyCodes$1.TAB) {
          requestAnimationFrame(function () {
            // Make sure native scroll is always at top of page
            _this3.html.scrollTop = 0;
            document.body.scrollTop = 0;
            _this3.html.scrollLeft = 0;
            document.body.scrollLeft = 0;
          });
        }

        return;
      }

      switch (e.keyCode) {
        case keyCodes$1.TAB:
          // Do not remove the RAF
          // It allows to override the browser's native scrollTo, which is essential
          requestAnimationFrame(function () {
            // Make sure native scroll is always at top of page
            _this3.html.scrollTop = 0;
            document.body.scrollTop = 0;
            _this3.html.scrollLeft = 0;
            document.body.scrollLeft = 0; // Request scrollTo on the focusedElement, putting it at the center of the screen

            _this3.scrollTo(document.activeElement, {
              offset: -window.innerHeight / 2
            });
          });
          break;

        case keyCodes$1.UP:
          if (this.isActiveElementScrollSensitive()) {
            this.instance.delta[this.directionAxis] -= 240;
          }

          break;

        case keyCodes$1.DOWN:
          if (this.isActiveElementScrollSensitive()) {
            this.instance.delta[this.directionAxis] += 240;
          }

          break;

        case keyCodes$1.PAGEUP:
          this.instance.delta[this.directionAxis] -= window.innerHeight;
          break;

        case keyCodes$1.PAGEDOWN:
          this.instance.delta[this.directionAxis] += window.innerHeight;
          break;

        case keyCodes$1.HOME:
          this.instance.delta[this.directionAxis] -= this.instance.limit[this.directionAxis];
          break;

        case keyCodes$1.END:
          this.instance.delta[this.directionAxis] += this.instance.limit[this.directionAxis];
          break;

        case keyCodes$1.SPACE:
          if (this.isActiveElementScrollSensitive()) {
            if (e.shiftKey) {
              this.instance.delta[this.directionAxis] -= window.innerHeight;
            } else {
              this.instance.delta[this.directionAxis] += window.innerHeight;
            }
          }

          break;

        default:
          return;
      }

      if (this.instance.delta[this.directionAxis] < 0) this.instance.delta[this.directionAxis] = 0;
      if (this.instance.delta[this.directionAxis] > this.instance.limit[this.directionAxis]) this.instance.delta[this.directionAxis] = this.instance.limit[this.directionAxis];
      this.stopScrolling(); // Stop any movement, allows to kill any other `scrollTo` still happening

      this.isScrolling = true;
      this.checkScroll();
      this.html.classList.add(this.scrollingClass);
    }
  }, {
    key: "isActiveElementScrollSensitive",
    value: function isActiveElementScrollSensitive() {
      return !(document.activeElement instanceof HTMLInputElement) && !(document.activeElement instanceof HTMLTextAreaElement) && !(document.activeElement instanceof HTMLButtonElement) && !(document.activeElement instanceof HTMLSelectElement);
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      var _this4 = this;

      var forced = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (forced || this.isScrolling || this.isDraggingScrollbar) {
        if (!this.hasScrollTicking) {
          this.checkScrollRaf = requestAnimationFrame(function () {
            return _this4.checkScroll();
          });
          this.hasScrollTicking = true;
        }

        this.updateScroll();
        var distance = Math.abs(this.instance.delta[this.directionAxis] - this.instance.scroll[this.directionAxis]);
        var timeSinceStart = Date.now() - this.startScrollTs; // Get the time since the scroll was started: the scroll can be stopped again only past 100ms

        if (!this.animatingScroll && timeSinceStart > 100 && (distance < 0.5 && this.instance.delta[this.directionAxis] != 0 || distance < 0.5 && this.instance.delta[this.directionAxis] == 0)) {
          this.stopScrolling();
        }

        Object.entries(this.sections).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              i = _ref2[0],
              section = _ref2[1];

          if (section.persistent || _this4.instance.scroll[_this4.directionAxis] > section.offset[_this4.directionAxis] && _this4.instance.scroll[_this4.directionAxis] < section.limit[_this4.directionAxis]) {
            if (_this4.direction === 'horizontal') {
              _this4.transform(section.el, -_this4.instance.scroll[_this4.directionAxis], 0);
            } else {
              _this4.transform(section.el, 0, -_this4.instance.scroll[_this4.directionAxis]);
            }

            if (!section.inView) {
              section.inView = true;
              section.el.style.opacity = 1;
              section.el.style.pointerEvents = 'all';
              section.el.setAttribute("data-".concat(_this4.name, "-section-inview"), '');
            }
          } else {
            if (section.inView || forced) {
              section.inView = false;
              section.el.style.opacity = 0;
              section.el.style.pointerEvents = 'none';
              section.el.removeAttribute("data-".concat(_this4.name, "-section-inview"));
            }

            _this4.transform(section.el, 0, 0);
          }
        });

        if (this.getDirection) {
          this.addDirection();
        }

        if (this.getSpeed) {
          this.addSpeed();
          this.speedTs = Date.now();
        }

        this.detectElements();
        this.transformElements();

        if (this.hasScrollbar) {
          var scrollBarTranslation = this.instance.scroll[this.directionAxis] / this.instance.limit[this.directionAxis] * this.scrollBarLimit[this.directionAxis];

          if (this.direction === 'horizontal') {
            this.transform(this.scrollbarThumb, scrollBarTranslation, 0);
          } else {
            this.transform(this.scrollbarThumb, 0, scrollBarTranslation);
          }
        }

        _get(_getPrototypeOf(_default.prototype), "checkScroll", this).call(this);

        this.hasScrollTicking = false;
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
      this.checkContext();
      this.windowMiddle = {
        x: this.windowWidth / 2,
        y: this.windowHeight / 2
      };
      this.update();
    }
  }, {
    key: "updateDelta",
    value: function updateDelta(e) {
      var delta;
      var gestureDirection = this[this.context] && this[this.context].gestureDirection ? this[this.context].gestureDirection : this.gestureDirection;

      if (gestureDirection === 'both') {
        delta = e.deltaX + e.deltaY;
      } else if (gestureDirection === 'vertical') {
        delta = e.deltaY;
      } else if (gestureDirection === 'horizontal') {
        delta = e.deltaX;
      } else {
        delta = e.deltaY;
      }

      this.instance.delta[this.directionAxis] -= delta * this.multiplier;
      if (this.instance.delta[this.directionAxis] < 0) this.instance.delta[this.directionAxis] = 0;
      if (this.instance.delta[this.directionAxis] > this.instance.limit[this.directionAxis]) this.instance.delta[this.directionAxis] = this.instance.limit[this.directionAxis];
    }
  }, {
    key: "updateScroll",
    value: function updateScroll(e) {
      if (this.isScrolling || this.isDraggingScrollbar) {
        this.instance.scroll[this.directionAxis] = lerp(this.instance.scroll[this.directionAxis], this.instance.delta[this.directionAxis], this.lerp);
      } else {
        if (this.instance.scroll[this.directionAxis] > this.instance.limit[this.directionAxis]) {
          this.setScroll(this.instance.scroll[this.directionAxis], this.instance.limit[this.directionAxis]);
        } else if (this.instance.scroll.y < 0) {
          this.setScroll(this.instance.scroll[this.directionAxis], 0);
        } else {
          this.setScroll(this.instance.scroll[this.directionAxis], this.instance.delta[this.directionAxis]);
        }
      }
    }
  }, {
    key: "addDirection",
    value: function addDirection() {
      if (this.instance.delta.y > this.instance.scroll.y) {
        if (this.instance.direction !== 'down') {
          this.instance.direction = 'down';
        }
      } else if (this.instance.delta.y < this.instance.scroll.y) {
        if (this.instance.direction !== 'up') {
          this.instance.direction = 'up';
        }
      }

      if (this.instance.delta.x > this.instance.scroll.x) {
        if (this.instance.direction !== 'right') {
          this.instance.direction = 'right';
        }
      } else if (this.instance.delta.x < this.instance.scroll.x) {
        if (this.instance.direction !== 'left') {
          this.instance.direction = 'left';
        }
      }
    }
  }, {
    key: "addSpeed",
    value: function addSpeed() {
      if (this.instance.delta[this.directionAxis] != this.instance.scroll[this.directionAxis]) {
        this.instance.speed = (this.instance.delta[this.directionAxis] - this.instance.scroll[this.directionAxis]) / Math.max(1, Date.now() - this.speedTs);
      } else {
        this.instance.speed = 0;
      }
    }
  }, {
    key: "initScrollBar",
    value: function initScrollBar() {
      this.scrollbar = document.createElement('span');
      this.scrollbarThumb = document.createElement('span');
      this.scrollbar.classList.add("".concat(this.scrollbarClass));
      this.scrollbarThumb.classList.add("".concat(this.scrollbarClass, "_thumb"));
      this.scrollbar.append(this.scrollbarThumb);

      if (this.scrollbarContainer) {
        this.scrollbarContainer.append(this.scrollbar);
      } else {
        document.body.append(this.scrollbar);
      } // Scrollbar Events


      this.getScrollBar = this.getScrollBar.bind(this);
      this.releaseScrollBar = this.releaseScrollBar.bind(this);
      this.moveScrollBar = this.moveScrollBar.bind(this);
      this.scrollbarThumb.addEventListener('mousedown', this.getScrollBar);
      window.addEventListener('mouseup', this.releaseScrollBar);
      window.addEventListener('mousemove', this.moveScrollBar); // Set scrollbar values

      this.hasScrollbar = false;

      if (this.direction == 'horizontal') {
        if (this.instance.limit.x + this.windowWidth <= this.windowWidth) {
          return;
        }
      } else {
        if (this.instance.limit.y + this.windowHeight <= this.windowHeight) {
          return;
        }
      }

      this.hasScrollbar = true;
      this.scrollbarBCR = this.scrollbar.getBoundingClientRect();
      this.scrollbarHeight = this.scrollbarBCR.height;
      this.scrollbarWidth = this.scrollbarBCR.width;

      if (this.direction === 'horizontal') {
        this.scrollbarThumb.style.width = "".concat(this.scrollbarWidth * this.scrollbarWidth / (this.instance.limit.x + this.scrollbarWidth), "px");
      } else {
        this.scrollbarThumb.style.height = "".concat(this.scrollbarHeight * this.scrollbarHeight / (this.instance.limit.y + this.scrollbarHeight), "px");
      }

      this.scrollbarThumbBCR = this.scrollbarThumb.getBoundingClientRect();
      this.scrollBarLimit = {
        x: this.scrollbarWidth - this.scrollbarThumbBCR.width,
        y: this.scrollbarHeight - this.scrollbarThumbBCR.height
      };
    }
  }, {
    key: "reinitScrollBar",
    value: function reinitScrollBar() {
      this.hasScrollbar = false;

      if (this.direction == 'horizontal') {
        if (this.instance.limit.x + this.windowWidth <= this.windowWidth) {
          return;
        }
      } else {
        if (this.instance.limit.y + this.windowHeight <= this.windowHeight) {
          return;
        }
      }

      this.hasScrollbar = true;
      this.scrollbarBCR = this.scrollbar.getBoundingClientRect();
      this.scrollbarHeight = this.scrollbarBCR.height;
      this.scrollbarWidth = this.scrollbarBCR.width;

      if (this.direction === 'horizontal') {
        this.scrollbarThumb.style.width = "".concat(this.scrollbarWidth * this.scrollbarWidth / (this.instance.limit.x + this.scrollbarWidth), "px");
      } else {
        this.scrollbarThumb.style.height = "".concat(this.scrollbarHeight * this.scrollbarHeight / (this.instance.limit.y + this.scrollbarHeight), "px");
      }

      this.scrollbarThumbBCR = this.scrollbarThumb.getBoundingClientRect();
      this.scrollBarLimit = {
        x: this.scrollbarWidth - this.scrollbarThumbBCR.width,
        y: this.scrollbarHeight - this.scrollbarThumbBCR.height
      };
    }
  }, {
    key: "destroyScrollBar",
    value: function destroyScrollBar() {
      this.scrollbarThumb.removeEventListener('mousedown', this.getScrollBar);
      window.removeEventListener('mouseup', this.releaseScrollBar);
      window.removeEventListener('mousemove', this.moveScrollBar);
      this.scrollbar.remove();
    }
  }, {
    key: "getScrollBar",
    value: function getScrollBar(e) {
      this.isDraggingScrollbar = true;
      this.checkScroll();
      this.html.classList.remove(this.scrollingClass);
      this.html.classList.add(this.draggingClass);
    }
  }, {
    key: "releaseScrollBar",
    value: function releaseScrollBar(e) {
      this.isDraggingScrollbar = false;

      if (this.isScrolling) {
        this.html.classList.add(this.scrollingClass);
      }

      this.html.classList.remove(this.draggingClass);
    }
  }, {
    key: "moveScrollBar",
    value: function moveScrollBar(e) {
      var _this5 = this;

      if (this.isDraggingScrollbar) {
        requestAnimationFrame(function () {
          var x = (e.clientX - _this5.scrollbarBCR.left) * 100 / _this5.scrollbarWidth * _this5.instance.limit.x / 100;
          var y = (e.clientY - _this5.scrollbarBCR.top) * 100 / _this5.scrollbarHeight * _this5.instance.limit.y / 100;

          if (y > 0 && y < _this5.instance.limit.y) {
            _this5.instance.delta.y = y;
          }

          if (x > 0 && x < _this5.instance.limit.x) {
            _this5.instance.delta.x = x;
          }
        });
      }
    }
  }, {
    key: "addElements",
    value: function addElements() {
      var _this6 = this;

      this.els = {};
      this.parallaxElements = {}; // this.sections.forEach((section, y) => {

      var els = this.el.querySelectorAll("[data-".concat(this.name, "]"));
      els.forEach(function (el, index) {
        // Try and find the target's parent section
        var targetParents = getParents(el);
        var section = Object.entries(_this6.sections).map(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              section = _ref4[1];

          return section;
        }).find(function (section) {
          return targetParents.includes(section.el);
        });
        var cl = el.dataset[_this6.name + 'Class'] || _this6["class"];
        var id = typeof el.dataset[_this6.name + 'Id'] === 'string' ? el.dataset[_this6.name + 'Id'] : 'el' + index;
        var top;
        var left;
        var repeat = el.dataset[_this6.name + 'Repeat'];
        var call = el.dataset[_this6.name + 'Call'];
        var position = el.dataset[_this6.name + 'Position'];
        var delay = el.dataset[_this6.name + 'Delay'];
        var direction = el.dataset[_this6.name + 'Direction'];
        var sticky = typeof el.dataset[_this6.name + 'Sticky'] === 'string';
        var speed = el.dataset[_this6.name + 'Speed'] ? parseFloat(el.dataset[_this6.name + 'Speed']) / 10 : false;
        var offset = typeof el.dataset[_this6.name + 'Offset'] === 'string' ? el.dataset[_this6.name + 'Offset'].split(',') : _this6.offset;
        var target = el.dataset[_this6.name + 'Target'];
        var targetEl;

        if (target !== undefined) {
          targetEl = document.querySelector("".concat(target));
        } else {
          targetEl = el;
        }

        var targetElBCR = targetEl.getBoundingClientRect();

        if (section === null) {
          top = targetElBCR.top + _this6.instance.scroll.y - getTranslate(targetEl).y;
          left = targetElBCR.left + _this6.instance.scroll.x - getTranslate(targetEl).x;
        } else {
          if (!section.inView) {
            top = targetElBCR.top - getTranslate(section.el).y - getTranslate(targetEl).y;
            left = targetElBCR.left - getTranslate(section.el).x - getTranslate(targetEl).x;
          } else {
            top = targetElBCR.top + _this6.instance.scroll.y - getTranslate(targetEl).y;
            left = targetElBCR.left + _this6.instance.scroll.x - getTranslate(targetEl).x;
          }
        }

        var bottom = top + targetEl.offsetHeight;
        var right = left + targetEl.offsetWidth;
        var middle = {
          x: (right - left) / 2 + left,
          y: (bottom - top) / 2 + top
        };

        if (sticky) {
          var elBCR = el.getBoundingClientRect();
          var elTop = elBCR.top;
          var elLeft = elBCR.left;
          var elDistance = {
            x: elLeft - left,
            y: elTop - top
          };
          top += window.innerHeight;
          left += window.innerWidth;
          bottom = elTop + targetEl.offsetHeight - el.offsetHeight - elDistance[_this6.directionAxis];
          right = elLeft + targetEl.offsetWidth - el.offsetWidth - elDistance[_this6.directionAxis];
          middle = {
            x: (right - left) / 2 + left,
            y: (bottom - top) / 2 + top
          };
        }

        if (repeat == 'false') {
          repeat = false;
        } else if (repeat != undefined) {
          repeat = true;
        } else {
          repeat = _this6.repeat;
        }

        var relativeOffset = [0, 0];

        if (offset) {
          if (_this6.direction === 'horizontal') {
            for (var i = 0; i < offset.length; i++) {
              if (typeof offset[i] == 'string') {
                if (offset[i].includes('%')) {
                  relativeOffset[i] = parseInt(offset[i].replace('%', '') * _this6.windowWidth / 100);
                } else {
                  relativeOffset[i] = parseInt(offset[i]);
                }
              } else {
                relativeOffset[i] = offset[i];
              }
            }

            left = left + relativeOffset[0];
            right = right - relativeOffset[1];
          } else {
            for (var i = 0; i < offset.length; i++) {
              if (typeof offset[i] == 'string') {
                if (offset[i].includes('%')) {
                  relativeOffset[i] = parseInt(offset[i].replace('%', '') * _this6.windowHeight / 100);
                } else {
                  relativeOffset[i] = parseInt(offset[i]);
                }
              } else {
                relativeOffset[i] = offset[i];
              }
            }

            top = top + relativeOffset[0];
            bottom = bottom - relativeOffset[1];
          }
        }

        var mappedEl = {
          el: el,
          id: id,
          "class": cl,
          section: section,
          top: top,
          middle: middle,
          bottom: bottom,
          left: left,
          right: right,
          offset: offset,
          progress: 0,
          repeat: repeat,
          inView: false,
          call: call,
          speed: speed,
          delay: delay,
          position: position,
          target: targetEl,
          direction: direction,
          sticky: sticky
        };
        _this6.els[id] = mappedEl;

        if (el.classList.contains(cl)) {
          _this6.setInView(_this6.els[id], id);
        }

        if (speed !== false || sticky) {
          _this6.parallaxElements[id] = mappedEl;
        }
      }); // });
    }
  }, {
    key: "addSections",
    value: function addSections() {
      var _this7 = this;

      this.sections = {};
      var sections = this.el.querySelectorAll("[data-".concat(this.name, "-section]"));

      if (sections.length === 0) {
        sections = [this.el];
      }

      sections.forEach(function (section, index) {
        var id = typeof section.dataset[_this7.name + 'Id'] === 'string' ? section.dataset[_this7.name + 'Id'] : 'section' + index;
        var sectionBCR = section.getBoundingClientRect();
        var offset = {
          x: sectionBCR.left - window.innerWidth * 1.5 - getTranslate(section).x,
          y: sectionBCR.top - window.innerHeight * 1.5 - getTranslate(section).y
        };
        var limit = {
          x: offset.x + sectionBCR.width + window.innerWidth * 2,
          y: offset.y + sectionBCR.height + window.innerHeight * 2
        };
        var persistent = typeof section.dataset[_this7.name + 'Persistent'] === 'string';
        section.setAttribute('data-scroll-section-id', id);
        var mappedSection = {
          el: section,
          offset: offset,
          limit: limit,
          inView: false,
          persistent: persistent,
          id: id
        };
        _this7.sections[id] = mappedSection;
      });
    }
  }, {
    key: "transform",
    value: function transform(element, x, y, delay) {
      var transform;

      if (!delay) {
        transform = "matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(x, ",").concat(y, ",0,1)");
      } else {
        var start = getTranslate(element);
        var lerpX = lerp(start.x, x, delay);
        var lerpY = lerp(start.y, y, delay);
        transform = "matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(lerpX, ",").concat(lerpY, ",0,1)");
      }

      element.style.webkitTransform = transform;
      element.style.msTransform = transform;
      element.style.transform = transform;
    }
  }, {
    key: "transformElements",
    value: function transformElements(isForced) {
      var _this8 = this;

      var setAllElements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var scrollRight = this.instance.scroll.x + this.windowWidth;
      var scrollBottom = this.instance.scroll.y + this.windowHeight;
      var scrollMiddle = {
        x: this.instance.scroll.x + this.windowMiddle.x,
        y: this.instance.scroll.y + this.windowMiddle.y
      };
      Object.entries(this.parallaxElements).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            i = _ref6[0],
            current = _ref6[1];

        var transformDistance = false;

        if (isForced) {
          transformDistance = 0;
        }

        if (current.inView || setAllElements) {
          switch (current.position) {
            case 'top':
              transformDistance = _this8.instance.scroll[_this8.directionAxis] * -current.speed;
              break;

            case 'elementTop':
              transformDistance = (scrollBottom - current.top) * -current.speed;
              break;

            case 'bottom':
              transformDistance = (_this8.instance.limit[_this8.directionAxis] - scrollBottom + _this8.windowHeight) * current.speed;
              break;

            case 'left':
              transformDistance = _this8.instance.scroll[_this8.directionAxis] * -current.speed;
              break;

            case 'elementLeft':
              transformDistance = (scrollRight - current.left) * -current.speed;
              break;

            case 'right':
              transformDistance = (_this8.instance.limit[_this8.directionAxis] - scrollRight + _this8.windowHeight) * current.speed;
              break;

            default:
              transformDistance = (scrollMiddle[_this8.directionAxis] - current.middle[_this8.directionAxis]) * -current.speed;
              break;
          }
        }

        if (current.sticky) {
          if (current.inView) {
            if (_this8.direction === 'horizontal') {
              transformDistance = _this8.instance.scroll.x - current.left + window.innerWidth;
            } else {
              transformDistance = _this8.instance.scroll.y - current.top + window.innerHeight;
            }
          } else {
            if (_this8.direction === 'horizontal') {
              if (_this8.instance.scroll.x < current.left - window.innerWidth && _this8.instance.scroll.x < current.left - window.innerWidth / 2) {
                transformDistance = 0;
              } else if (_this8.instance.scroll.x > current.right && _this8.instance.scroll.x > current.right + 100) {
                transformDistance = current.right - current.left + window.innerWidth;
              } else {
                transformDistance = false;
              }
            } else {
              if (_this8.instance.scroll.y < current.top - window.innerHeight && _this8.instance.scroll.y < current.top - window.innerHeight / 2) {
                transformDistance = 0;
              } else if (_this8.instance.scroll.y > current.bottom && _this8.instance.scroll.y > current.bottom + 100) {
                transformDistance = current.bottom - current.top + window.innerHeight;
              } else {
                transformDistance = false;
              }
            }
          }
        }

        if (transformDistance !== false) {
          if (current.direction === 'horizontal' || _this8.direction === 'horizontal' && current.direction !== 'vertical') {
            _this8.transform(current.el, transformDistance, 0, isForced ? false : current.delay);
          } else {
            _this8.transform(current.el, 0, transformDistance, isForced ? false : current.delay);
          }
        }
      });
    }
    /**
     * Scroll to a desired target.
     *
     * @param  Available options :
     *          target {node, string, "top", "bottom", int} - The DOM element we want to scroll to
     *          options {object} - Options object for additionnal settings.
     * @return {void}
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(target) {
      var _this9 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Parse options
      var offset = parseInt(options.offset) || 0; // An offset to apply on top of given `target` or `sourceElem`'s target

      var duration = !isNaN(parseInt(options.duration)) ? parseInt(options.duration) : 1000; // Duration of the scroll animation in milliseconds

      var easing = options.easing || [0.25, 0.0, 0.35, 1.0]; // An array of 4 floats between 0 and 1 defining the bezier curve for the animation's easing. See http://greweb.me/bezier-easing-editor/example/

      var disableLerp = options.disableLerp ? true : false; // Lerp effect won't be applied if set to true

      var callback = options.callback ? options.callback : false; // function called when scrollTo completes (note that it won't wait for lerp to stabilize)

      easing = src$1.apply(void 0, _toConsumableArray(easing));

      if (typeof target === 'string') {
        // Selector or boundaries
        if (target === 'top') {
          target = 0;
        } else if (target === 'bottom') {
          target = this.instance.limit.y;
        } else if (target === 'left') {
          target = 0;
        } else if (target === 'right') {
          target = this.instance.limit.x;
        } else {
          target = document.querySelector(target); // If the query fails, abort

          if (!target) {
            return;
          }
        }
      } else if (typeof target === 'number') {
        // Absolute coordinate
        target = parseInt(target);
      } else if (target && target.tagName) ; else {
        console.warn('`target` parameter is not valid');
        return;
      } // We have a target that is not a coordinate yet, get it


      if (typeof target !== 'number') {
        // Verify the given target belongs to this scroll scope
        var targetInScope = getParents(target).includes(this.el);

        if (!targetInScope) {
          // If the target isn't inside our main element, abort any action
          return;
        } // Get target offset from top


        var targetBCR = target.getBoundingClientRect();
        var offsetTop = targetBCR.top;
        var offsetLeft = targetBCR.left; // Try and find the target's parent section

        var targetParents = getParents(target);
        var parentSection = targetParents.find(function (candidate) {
          return Object.entries(_this9.sections) // Get sections associative array as a regular array
          .map(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2),
                key = _ref8[0],
                section = _ref8[1];

            return section;
          }) // map to section only (we dont need the key here)
          .find(function (section) {
            return section.el == candidate;
          }); // finally find the section that matches the candidate
        });
        var parentSectionOffset = 0;

        if (parentSection) {
          parentSectionOffset = getTranslate(parentSection)[this.directionAxis]; // We got a parent section, store it's current offset to remove it later
        } else {
          // if no parent section is found we need to use instance scroll directly
          parentSectionOffset = -this.instance.scroll[this.directionAxis];
        } // Final value of scroll destination : offsetTop + (optional offset given in options) - (parent's section translate)


        if (this.direction === 'horizontal') {
          offset = offsetLeft + offset - parentSectionOffset;
        } else {
          offset = offsetTop + offset - parentSectionOffset;
        }
      } else {
        offset = target + offset;
      } // Actual scrollto
      // ==========================================================================
      // Setup


      var scrollStart = parseFloat(this.instance.delta[this.directionAxis]);
      var scrollTarget = Math.max(0, Math.min(offset, this.instance.limit[this.directionAxis])); // Make sure our target is in the scroll boundaries

      var scrollDiff = scrollTarget - scrollStart;

      var render = function render(p) {
        if (disableLerp) {
          if (_this9.direction === 'horizontal') {
            _this9.setScroll(scrollStart + scrollDiff * p, _this9.instance.delta.y);
          } else {
            _this9.setScroll(_this9.instance.delta.x, scrollStart + scrollDiff * p);
          }
        } else {
          _this9.instance.delta[_this9.directionAxis] = scrollStart + scrollDiff * p;
        }
      }; // Prepare the scroll


      this.animatingScroll = true; // This boolean allows to prevent `checkScroll()` from calling `stopScrolling` when the animation is slow (i.e. at the beginning of an EaseIn)

      this.stopScrolling(); // Stop any movement, allows to kill any other `scrollTo` still happening

      this.startScrolling(); // Restart the scroll
      // Start the animation loop

      var start = Date.now();

      var loop = function loop() {
        var p = (Date.now() - start) / duration; // Animation progress

        if (p > 1) {
          // Animation ends
          render(1);
          _this9.animatingScroll = false;
          if (duration == 0) _this9.update();
          if (callback) callback();
        } else {
          _this9.scrollToRaf = requestAnimationFrame(loop);
          render(easing(p));
        }
      };

      loop();
    }
  }, {
    key: "update",
    value: function update() {
      this.setScrollLimit();
      this.addSections();
      this.addElements();
      this.detectElements();
      this.updateScroll();
      this.transformElements(true);
      this.reinitScrollBar();
      this.checkScroll(true);
    }
  }, {
    key: "startScroll",
    value: function startScroll() {
      this.stop = false;
    }
  }, {
    key: "stopScroll",
    value: function stopScroll() {
      this.stop = true;
    }
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.instance = _objectSpread2(_objectSpread2({}, this.instance), {}, {
        scroll: {
          x: x,
          y: y
        },
        delta: {
          x: x,
          y: y
        },
        speed: 0
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(_default.prototype), "destroy", this).call(this);

      this.stopScrolling();
      this.html.classList.remove(this.smoothClass);
      this.vs.destroy();
      this.destroyScrollBar();
      window.removeEventListener('keydown', this.checkKey, false);
    }
  }]);

  return _default;
}(_default);

var Smooth = /*#__PURE__*/function () {
  function Smooth() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Smooth);

    this.options = options; // Override default options with given ones

    Object.assign(this, defaults, options);
    this.smartphone = defaults.smartphone;
    if (options.smartphone) Object.assign(this.smartphone, options.smartphone);
    this.tablet = defaults.tablet;
    if (options.tablet) Object.assign(this.tablet, options.tablet);
    if (!this.smooth && this.direction == 'horizontal') console.warn('🚨 `smooth:false` & `horizontal` direction are not yet compatible');
    if (!this.tablet.smooth && this.tablet.direction == 'horizontal') console.warn('🚨 `smooth:false` & `horizontal` direction are not yet compatible (tablet)');
    if (!this.smartphone.smooth && this.smartphone.direction == 'horizontal') console.warn('🚨 `smooth:false` & `horizontal` direction are not yet compatible (smartphone)');
    this.init();
  }

  _createClass(Smooth, [{
    key: "init",
    value: function init() {
      this.options.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 || window.innerWidth < this.tablet.breakpoint;
      this.options.isTablet = this.options.isMobile && window.innerWidth >= this.tablet.breakpoint;

      if (this.smooth && !this.options.isMobile || this.tablet.smooth && this.options.isTablet || this.smartphone.smooth && this.options.isMobile && !this.options.isTablet) {
        this.scroll = new _default$2(this.options);
      } else {
        this.scroll = new _default$1(this.options);
      }

      this.scroll.init();

      if (window.location.hash) {
        // Get the hash without the '#' and find the matching element
        var id = window.location.hash.slice(1, window.location.hash.length);
        var target = document.getElementById(id); // If found, scroll to the element

        if (target) this.scroll.scrollTo(target);
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.scroll.update();
    }
  }, {
    key: "start",
    value: function start() {
      this.scroll.startScroll();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.scroll.stopScroll();
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(target, options) {
      this.scroll.scrollTo(target, options);
    }
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.scroll.setScroll(x, y);
    }
  }, {
    key: "on",
    value: function on(event, func) {
      this.scroll.setEvents(event, func);
    }
  }, {
    key: "off",
    value: function off(event, func) {
      this.scroll.unsetEvents(event, func);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.scroll.destroy();
    }
  }]);

  return Smooth;
}();

var Native = /*#__PURE__*/function () {
  function Native() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Native);

    this.options = options; // Override default options with given ones

    Object.assign(this, defaults, options);
    this.smartphone = defaults.smartphone;
    if (options.smartphone) Object.assign(this.smartphone, options.smartphone);
    this.tablet = defaults.tablet;
    if (options.tablet) Object.assign(this.tablet, options.tablet);
    this.init();
  }

  _createClass(Native, [{
    key: "init",
    value: function init() {
      this.scroll = new _default$1(this.options);
      this.scroll.init();

      if (window.location.hash) {
        // Get the hash without the '#' and find the matching element
        var id = window.location.hash.slice(1, window.location.hash.length);
        var target = document.getElementById(id); // If found, scroll to the element

        if (target) this.scroll.scrollTo(target);
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.scroll.update();
    }
  }, {
    key: "start",
    value: function start() {
      this.scroll.startScroll();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.scroll.stopScroll();
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(target, options) {
      this.scroll.scrollTo(target, options);
    }
  }, {
    key: "setScroll",
    value: function setScroll(x, y) {
      this.scroll.setScroll(x, y);
    }
  }, {
    key: "on",
    value: function on(event, func) {
      this.scroll.setEvents(event, func);
    }
  }, {
    key: "off",
    value: function off(event, func) {
      this.scroll.unsetEvents(event, func);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.scroll.destroy();
    }
  }]);

  return Native;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Smooth);



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/scripts/app.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/utils */ "./src/scripts/utils/utils.js");
/* harmony import */ var _components_preloader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/preloader */ "./src/scripts/components/preloader.js");
/* harmony import */ var _components_header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/header */ "./src/scripts/components/header.js");
/* harmony import */ var _components_cursor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/cursor */ "./src/scripts/components/cursor.js");
/* harmony import */ var _components_smooth_animation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/smooth-animation */ "./src/scripts/components/smooth-animation.js");
/* harmony import */ var _components_animation_title__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/animation-title */ "./src/scripts/components/animation-title.js");
/* harmony import */ var _components_hero__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/hero */ "./src/scripts/components/hero.js");
/* harmony import */ var _components_projects__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/projects */ "./src/scripts/components/projects.js");
/* harmony import */ var _components_logos__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/logos */ "./src/scripts/components/logos.js");
/* harmony import */ var _components_team__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/team */ "./src/scripts/components/team.js");
/* harmony import */ var _components_our_services__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/our-services */ "./src/scripts/components/our-services.js");
/* harmony import */ var _components_our_capabilities__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/our-capabilities */ "./src/scripts/components/our-capabilities.js");
/* harmony import */ var _components_our_manifesto__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/our-manifesto */ "./src/scripts/components/our-manifesto.js");
/* harmony import */ var _components_gallery__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/gallery */ "./src/scripts/components/gallery.js");
/* harmony import */ var _components_awards__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/awards */ "./src/scripts/components/awards.js");
/* harmony import */ var _components_faq__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/faq */ "./src/scripts/components/faq.js");
/* harmony import */ var _components_footer__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/footer */ "./src/scripts/components/footer.js");
/* harmony import */ var _components_contact__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/contact */ "./src/scripts/components/contact.js");
/* harmony import */ var _components_contact_animation__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/contact-animation */ "./src/scripts/components/contact-animation.js");



















(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.pageLoad)(function () {
  (0,_components_preloader__WEBPACK_IMPORTED_MODULE_1__["default"])();
  (0,_components_header__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_components_cursor__WEBPACK_IMPORTED_MODULE_3__["default"])();
  (0,_components_smooth_animation__WEBPACK_IMPORTED_MODULE_4__["default"])();
  (0,_components_animation_title__WEBPACK_IMPORTED_MODULE_5__["default"])();
  (0,_components_hero__WEBPACK_IMPORTED_MODULE_6__["default"])();
  (0,_components_logos__WEBPACK_IMPORTED_MODULE_8__["default"])();
  (0,_components_team__WEBPACK_IMPORTED_MODULE_9__["default"])();
  (0,_components_our_services__WEBPACK_IMPORTED_MODULE_10__["default"])();
  (0,_components_our_capabilities__WEBPACK_IMPORTED_MODULE_11__["default"])();
  (0,_components_our_manifesto__WEBPACK_IMPORTED_MODULE_12__["default"])();
  (0,_components_gallery__WEBPACK_IMPORTED_MODULE_13__["default"])();
  (0,_components_awards__WEBPACK_IMPORTED_MODULE_14__["default"])();
  (0,_components_faq__WEBPACK_IMPORTED_MODULE_15__["default"])();
  (0,_components_footer__WEBPACK_IMPORTED_MODULE_16__["default"])();
  (0,_components_contact__WEBPACK_IMPORTED_MODULE_17__["default"])();
  (0,_components_contact_animation__WEBPACK_IMPORTED_MODULE_18__["default"])();
});

//If you really need Jquery
/*
$(document).ready(function(){

})
 */
})();

/******/ })()
;