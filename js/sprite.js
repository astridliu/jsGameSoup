/* sprite class - controls a set of images on the screen with different 'action' animations */
function Sprite(anchor, frames, loadedcallback) {
	var loadcount = 0;
	var action = "";
	var framecount = -1;
	var frame = 0;
	var sprite = this;
	
	// load up all of the images
	for (var a in frames) {
		for (var f=0; f<frames[a].length; f++) {
			loadcount += 1;
			var img = new Image();
			img.src = frames[a][f][0];
			frames[a][f][0] = img;
			img.onload = function () {
				loadcount -= 1;
				if (loadcount == 0) {
					if (loadedcallback) {
						loadedcallback();
					}
				}
			}
		}
	}
	
	// calculate offsets (center, right, left, top, bottom)
	var calc_x = {
		"left": function(frame) {
			return 0;
		},
		"right": function(frame) {
			return frame.width;
		},
		"center": function(frame) {
			return frame.width / 2;
		}
	}
	
	var calc_y = {
		"top": function(frame) {
			return 0;
		},
		"bottom": function(frame) {
			return frame.height;
		},
		"center": function(frame) {
			return frame.height / 2;
		}
	}
	
	// set which action to play
	this.action = function(a) {
		action = a;
		framecount = frames[a][0][1];
		frame = 0;
		sprite.update = sprite._update;
		sprite.draw = sprite._draw;
		sprite.aabb = sprite._aabb;
	}
	
	// increment frame counter etc.
	this._update = function() {
		framecount -= 1;
		if (framecount <= 0) {
			frame = (frame + 1) % frames[action].length;
			framecount = frames[action][frame][1];
		}
	}
	
	// draw this sprite on canvas c at position with respect to the anchor specified
	this._draw = function(c, x, y) {
		var i = frames[action][frame][0];
		c.drawImage(i, x - calc_x[anchor[0]](i), y - calc_y[anchor[1]](i));
	}
	
	// returns the axis-aligned bounding-box of this sprite	for the current frame
	this._aabb = function(x, y) {
		var i = frames[action][frame][0];
		return [x - calc_x[anchor[0]](i), y - calc_y[anchor[1]](i), i.width, i.height];
	}
	
	this.update = function() {};
	this.draw = function() {};
	this.aabb = function() { return [0, 0, 0, 0] };
}
