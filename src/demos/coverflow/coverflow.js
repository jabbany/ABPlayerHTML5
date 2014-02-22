/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals jQuery */

/*!
 * Coverflow
 *
 * Copyright (c) 2013 Martijn W. van der Lee
 * Licensed under the MIT.
 */
/* Lightweight and flexible coverflow effect using CSS3 transforms.
 * For modern browsers with some amount of graceful degradation.
 * Optional support for jQuery.interpolate() plugin.
 * Optional support for .reflect() plugins.
 *
 * Requires jQuery 1.7+ and jQueryUI 1.9+.
 * Recommended jQuery 1.8+ and jQueryUI 1.9+.
 */

;(function($, undefined) {
	"use strict";

	var sign	= function(number) {
					return number < 0 ? -1 : 1;
				},
		scl		= function(number, fromMin, fromMax, toMin, toMax) {
					return ((number - fromMin) * (toMax - toMin) / (fromMax - fromMin)) + toMin;
				};

	$.widget("vanderlee.coverflow", {
		options: {
			animateComplete:	undefined,
			animateStep:		undefined,
			density:			1,
			duration:			'normal',
			easing:				undefined,
			index:				0,
			innerAngle:			-75,
			innerCss:			undefined,
			innerOffset:		100 / 3,
			innerScale:			0.75,
			outerAngle:			-30,
			outerCss:			undefined,
			outerScale:			0.25,
			selectedCss:		undefined,
			visible:			'density',		// 'density', 'all', NNN (exact)
			width:				undefined,

			change:				undefined,		// Whenever index is changed
			confirm:			undefined,		// Whenever clicking on the current item
			select:				undefined		// Whenever index is set (also on init)
		},

		_create: function() {
			var that = this;

			// Internal event prefix
			that.widgetEventPrefix	= 'vanderlee-coverflow';

			that.hovering			= false;
			that.pagesize			= 1;
			that.currentIndex		= that.options.index;

			// Fix height
			that.element.height(that._getCovers().first().height());

			// Hide all covers and set position to absolute
			that._getCovers().hide().css('position', 'absolute');

			// Enable click-jump
			that.element.on('click', '> *', function() {
				var index = that._getCovers().index(this);
				if (index === that.currentIndex) {
					that._callback('confirm');
				} else {
					that._setIndex(index, true);
				}
			});

			// Refresh on resize
			$(window).resize(function() {
				that.refresh();
			});

			// Mousewheel
			that.element.on('mousewheel', function(event, delta) {
				event.preventDefault();
				that._setIndex(that.options.index - delta, true);
			});

			// Swipe
			if ($.isFunction(that.element.swipe)) {
				that.element.swipe({
					swipe: function(event, direction, distance, duration, fingerCount) {
						var count = Math.round((direction === 'left' ? 1 : -1) * 1.25 * that.pagesize * distance / that.element.width());
						that._setIndex(that.options.index + count, true);
					}
				});
			}

			// Keyboard
			that.element.hover(
				function() { that.hovering = true; }
			,	function() { that.hovering = false; }
			);

			$(window).on('keydown', function(event) {
				if (that.hovering) {
					switch (event.which) {
						case 36:	// home
							event.preventDefault();
							that._setIndex(0, true);
							break;

						case 35:	// end
							event.preventDefault();
							that._setIndex(that._getCovers().length - 1, true);
							break;

						case 38:	// up
						case 37:	// left
							event.preventDefault();
							that._setIndex(that.options.index - 1, true);
							break;

						case 40:	// down
						case 39:	// right
							event.preventDefault();
							that._setIndex(that.options.index + 1, true);
							break;

						case 33:	// page up (towards home)
							event.preventDefault();
							that._setIndex(that.options.index - that.pagesize, true);
							break;

						case 34:	// page down (towards end)
							event.preventDefault();
							that._setIndex(that.options.index + that.pagesize, true);
							break;
					}
				}
			});

			// Initialize
			that._setIndex(that.options.index, false, true);
			that.refresh();

			return that;
		},

		/**
		 * Returns the currently selected cover
		 * @returns {jQuery} jQuery object
		 */
		cover: function() {
			return $(this._getCovers()[this.options.index]);
		},

		/**
		 *
		 * @returns {unresolved}
		 */
		_getCovers: function() {
			return $('> *', this.element);
		},

		_setIndex: function(index, animate, initial) {
			var covers = this._getCovers();

			index = Math.max(0, Math.min(index, covers.length - 1));

			if (index !== this.options.index) {
				this.refresh();		// pre-correct for reflection/mods

				if (animate === true) {
					this.currentIndex	= this.options.index;
					this.options.index	= Math.round(index);

					var that		= this,
						duration	= typeof that.options.duration === "number"
									? that.options.duration
									: jQuery.fx.speeds[that.options.duration] || jQuery.fx.speeds._default,
						timeout		= null,
						step		= that.options.index > that.currentIndex ? 1 : -1,
						doStep		= function() {
										var steps	= Math.abs(that.options.index - that.currentIndex),
											time	= duration / Math.max(1, steps) * 0.5;
										if (that.options.index !== that.currentIndex) {
											that.currentIndex += step;
											that.refresh.call(that, time, that.currentIndex);
											timeout = setTimeout(doStep, time);
										}
										that._callback('change');
										that._callback('select');
									};
					if (timeout) {
						clearTimeout(timeout);
					}
					if (that.currentIndex !== this.options.index) {
						doStep();
					}
				} else {
					this.currentIndex = this.options.index = Math.round(index);
					this.refresh(this.options.duration);
					this._callback('change');
					this._callback('select');
				}
			} else if (initial === true) {
				this.refresh();
				this._callback('select');
			}
		},

		_callback: function(callback) {
			this._trigger(callback, null, this._getCovers().get(this.currentIndex), this.currentIndex);
		},

		index: function(index) {
			if (index === undefined) {
				return this.options.index;
			}
			this._setIndex(index, true);
		},

		refresh: function(duration, index) {
			var that		= this,
				target		= index || that.options.index,
				count		= that._getCovers().length,
				parentWidth	= that.element.innerWidth(),
				coverWidth	= that.options.width || that._getCovers().first().outerWidth(),
				visible		= that.options.visible === 'density'	? Math.round(parentWidth * that.options.density / coverWidth)
							: $.isNumeric(that.options.visible)		? that.options.visible
							: count,
				parentLeft	= that.element.position().left - ((1 - that.options.outerScale) * coverWidth * 0.5),
				space		= (parentWidth - (that.options.outerScale * coverWidth)) * 0.5;

			duration		= duration || 0;

			that.pagesize	= visible;

			that._getCovers().removeClass('current').each(function(index, cover) {
				var position	= index - target,
					offset		= position / visible,
					isVisible	= Math.abs(offset) <= 1,
					sin			= isVisible ? Math.sin(offset * Math.PI * 0.5)
								: sign(offset),
					cos			= isVisible ? Math.cos(offset * Math.PI * 0.5)
								: 0,
					isMiddle	= position === 0,
					zIndex		= count - Math.abs(position),
					left		= parentLeft + space + (isMiddle ? 0 : sign(sin) * scl(Math.abs(sin), 0, 1, that.options.innerOffset * that.options.density, space)),
					scale		= !isVisible? 0
								: isMiddle	? 1
								: scl(Math.abs(cos), 1, 0, that.options.innerScale, that.options.outerScale),
					angle		= isMiddle	? 0
								: sign(sin) * scl(Math.abs(sin), 0, 1, that.options.innerAngle, that.options.outerAngle),
					state		= {},
					css			= isMiddle ? that.options.selectedCss || {}
								: ( $.interpolate && that.options.outerCss && !$.isEmptyObject(that.options.outerCss) ? (
									isVisible ? $.interpolate(that.options.innerCss || {}, that.options.outerCss, Math.abs(sin))
											  : that.options.outerCss
									) : {}
								),
					transform;

				if (isVisible) {
					$(cover).show();
				}

				$(cover).stop().css({
					'z-index':	zIndex
				}).animate($.extend(css, {
					'left':		left,
					'_sin':		sin,
					'_cos':		cos,
					'_scale':	scale,
					'_angle':	angle	// must be last!
				}), {
					'easing':	that.options.easing,
					'duration': isVisible ? duration : 0,
					'step':		function(now, fx) {
						// Store state
						state[fx.prop] = now;

						// On last of the states, change all at once
						if (fx.prop === '_angle') {
							transform = 'scale(' + state._scale + ',' + state._scale + ') perspective('+(parentWidth * 0.5)+'px) rotateY(' + state._angle + 'deg)';
							$(this).css({
								'-webkit-transform':	transform,
								'-ms-transform':		transform,
								'transform':			transform
							});

							// Optional callback
							that._trigger('animateStep', cover, [cover, offset, isVisible, isMiddle, state._sin, state._cos]);
						}
					},
					'complete':		function() {
						$(this)[isMiddle ? 'addClass' : 'removeClass']('current');
						$(this)[isVisible ? 'show' : 'hide']();

						// Optional callback
						that._trigger('animateComplete', cover, [cover, offset, isVisible, isMiddle, sin, cos]);
					}
				});
			});
		}
	});
}(jQuery));
