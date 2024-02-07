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
		return gsap || (typeof window !== 'undefined' && (gsap = window.gsap) && gsap.registerPlugin && gsap);
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
			sy =
				-height ||
				(Math.abs(+values[l - 1] - +values[1]) < 0.01 * (+values[l - 2] - +values[0])
					? _findMinimum(values) + ty
					: +values[l - 1] + ty),
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
			points = [
				{
					x: x1,
					y: y1,
				},
				{
					x: x4,
					y: y4,
				},
			];
			index = 1;
		}

		points.splice(index || points.length - 1, 0, {
			x: x1234,
			y: y1234,
		});

		if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
			length = points.length;

			_bezierToPoints(x1, y1, x12, y12, x123, y123, x1234, y1234, threshold, points, index);

			_bezierToPoints(
				x1234,
				y1234,
				x234,
				y234,
				x34,
				y34,
				x4,
				y4,
				threshold,
				points,
				index + 1 + (points.length - length),
			);
		}

		return points;
	};

export var CustomEase = /*#__PURE__*/ (function () {
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

		if (_needsParsingExp.test(data) || (~data.indexOf('M') && data.indexOf('C') < 0)) {
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
				y: +values[i - 1],
			};
			a2 = {
				x: +values[i + 4],
				y: +values[i + 5],
			};
			points.push(a1, a2);

			_bezierToPoints(
				a1.x,
				a1.y,
				+values[i],
				+values[i + 1],
				+values[i + 2],
				+values[i + 3],
				a2.x,
				a2.y,
				1 / (precision * 200000),
				points,
				points.length - 1,
			);
		}

		l = points.length;

		for (i = 0; i < l; i++) {
			point = points[i];
			prevPoint = points[i - 1] || point;

			if (
				(point.x > prevPoint.x ||
					(prevPoint.y !== point.y && prevPoint.x === point.x) ||
					point === prevPoint) &&
				point.x <= 1
			) {
				//if a point goes BACKWARD in time or is a duplicate, just drop it. Also it shouldn't go past 1 on the x axis, as could happen in a string like "M0,0 C0,0 0.12,0.68 0.18,0.788 0.195,0.845 0.308,1 0.32,1 0.403,1.005 0.398,1 0.5,1 0.602,1 0.816,1.005 0.9,1 0.91,1 0.948,0.69 0.962,0.615 1.003,0.376 1,0 1,0".
				prevPoint.cx = point.x - prevPoint.x; //change in x between this point and the next point (performance optimization)

				prevPoint.cy = point.y - prevPoint.y;
				prevPoint.n = point;
				prevPoint.nx = point.x; //next point's x value (performance optimization, making lookups faster in getRatio()). Remember, the lookup will always land on a spot where it's either this point or the very next one (never beyond that)

				if (
					fast &&
					i > 1 &&
					Math.abs(prevPoint.cy / prevPoint.cx - points[i - 2].cy / points[i - 2].cx) > 2
				) {
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

		l = (1 / closest + 1) | 0;
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

				a1 = point.y + ((p - point.x) / point.cx) * point.cy;
				lookup[i] = {
					x: p,
					cx: inc,
					y: a1,
					cy: 0,
					nx: 9,
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
			var point = lookup[(p * l) | 0] || lookup[l - 1];

			if (point.nx < p) {
				point = point.n;
			}

			return point.y + ((p - point.x) / point.cx) * point.cy;
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
})();
_getGSAP() && gsap.registerPlugin(CustomEase);
CustomEase.version = '3.9.1';
export { CustomEase as default };
