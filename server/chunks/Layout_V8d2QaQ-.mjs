import { A as renderTemplate, B as createAstro, D as renderSlot, M as renderHead, N as addAttribute, P as createRenderInstruction, R as unescapeHTML, T as Fragment$2, j as maybeRenderHead, w as renderComponent } from "./sequence_CNTE2LHY.mjs";
import { t as createComponent } from "./compiler_B8t0eK-6.mjs";
import { d as cookieBannerEnabled, l as siteConfig } from "./services_Bv7bmOO1.mjs";
import { t as isExcluded } from "./sitemap_wHVf-8d4.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { flushSync } from "react-dom";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region node_modules/lenis/dist/lenis.mjs
var version = "1.3.26";
/**
* Clamp a value between a minimum and maximum value
*
* @param min Minimum value
* @param input Value to clamp
* @param max Maximum value
* @returns Clamped value
*/
function clamp(min, input, max) {
	return Math.max(min, Math.min(input, max));
}
/**
*  Linearly interpolate between two values using an amount (0 <= t <= 1)
*
* @param x First value
* @param y Second value
* @param t Amount to interpolate (0 <= t <= 1)
* @returns Interpolated value
*/
function lerp(x, y, t) {
	return (1 - t) * x + t * y;
}
/**
* Damp a value over time using a damping factor
* {@link http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/}
*
* @param x Initial value
* @param y Target value
* @param lambda Damping factor
* @param dt Time elapsed since the last update
* @returns Damped value
*/
function damp(x, y, lambda, deltaTime) {
	return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
}
/**
* Calculate the modulo of the dividend and divisor while keeping the result within the same sign as the divisor
* {@link https://anguscroll.com/just/just-modulo}
*
* @param n Dividend
* @param d Divisor
* @returns Modulo
*/
function modulo(n, d) {
	return (n % d + d) % d;
}
/**
* Animate class to handle value animations with lerping or easing
*
* @example
* const animate = new Animate()
* animate.fromTo(0, 100, { duration: 1, easing: (t) => t })
* animate.advance(0.5) // 50
*/
var Animate = class {
	isRunning = false;
	value = 0;
	from = 0;
	to = 0;
	currentTime = 0;
	lerp;
	duration;
	easing;
	onUpdate;
	/**
	* Advance the animation by the given delta time
	*
	* @param deltaTime - The time in seconds to advance the animation
	*/
	advance(deltaTime) {
		if (!this.isRunning) return;
		let completed = false;
		if (this.duration && this.easing) {
			this.currentTime += deltaTime;
			const linearProgress = clamp(0, this.currentTime / this.duration, 1);
			completed = linearProgress >= 1;
			const easedProgress = completed ? 1 : this.easing(linearProgress);
			this.value = this.from + (this.to - this.from) * easedProgress;
		} else if (this.lerp) {
			this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
			if (Math.round(this.value) === Math.round(this.to)) {
				this.value = this.to;
				completed = true;
			}
		} else {
			this.value = this.to;
			completed = true;
		}
		if (completed) this.stop();
		this.onUpdate?.(this.value, completed);
	}
	/** Stop the animation */
	stop() {
		this.isRunning = false;
	}
	/**
	* Set up the animation from a starting value to an ending value
	* with optional parameters for lerping, duration, easing, and onUpdate callback
	*
	* @param from - The starting value
	* @param to - The ending value
	* @param options - Options for the animation
	*/
	fromTo(from, to, { lerp, duration, easing, onStart, onUpdate }) {
		this.from = this.value = from;
		this.to = to;
		this.lerp = lerp;
		this.duration = duration;
		this.easing = easing;
		this.currentTime = 0;
		this.isRunning = true;
		onStart?.();
		this.onUpdate = onUpdate;
	}
};
function debounce(callback, delay) {
	let timer;
	return function(...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = void 0;
			callback.apply(this, args);
		}, delay);
	};
}
/**
* Dimensions class to handle the size of the content and wrapper
*
* @example
* const dimensions = new Dimensions(wrapper, content)
* dimensions.on('resize', (e) => {
*   console.log(e.width, e.height)
* })
*/
var Dimensions = class {
	width = 0;
	height = 0;
	scrollHeight = 0;
	scrollWidth = 0;
	debouncedResize;
	wrapperResizeObserver;
	contentResizeObserver;
	constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
		this.wrapper = wrapper;
		this.content = content;
		if (autoResize) {
			this.debouncedResize = debounce(this.resize, debounceValue);
			if (this.wrapper instanceof Window) window.addEventListener("resize", this.debouncedResize);
			else {
				this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
				this.wrapperResizeObserver.observe(this.wrapper);
			}
			this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
			this.contentResizeObserver.observe(this.content);
		}
		this.resize();
	}
	destroy() {
		this.wrapperResizeObserver?.disconnect();
		this.contentResizeObserver?.disconnect();
		if (this.wrapper === window && this.debouncedResize) window.removeEventListener("resize", this.debouncedResize);
	}
	resize = () => {
		this.onWrapperResize();
		this.onContentResize();
	};
	onWrapperResize = () => {
		if (this.wrapper instanceof Window) {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		} else {
			this.width = this.wrapper.clientWidth;
			this.height = this.wrapper.clientHeight;
		}
	};
	onContentResize = () => {
		if (this.wrapper instanceof Window) {
			this.scrollHeight = this.content.scrollHeight;
			this.scrollWidth = this.content.scrollWidth;
		} else {
			this.scrollHeight = this.wrapper.scrollHeight;
			this.scrollWidth = this.wrapper.scrollWidth;
		}
	};
	get limit() {
		return {
			x: this.scrollWidth - this.width,
			y: this.scrollHeight - this.height
		};
	}
};
/**
* Emitter class to handle events
* @example
* const emitter = new Emitter()
* emitter.on('event', (data) => {
*   console.log(data)
* })
* emitter.emit('event', 'data')
*/
var Emitter = class {
	events = {};
	/**
	* Emit an event with the given data
	* @param event Event name
	* @param args Data to pass to the event handlers
	*/
	emit(event, ...args) {
		const callbacks = this.events[event] || [];
		for (let i = 0, length = callbacks.length; i < length; i++) callbacks[i]?.(...args);
	}
	/**
	* Add a callback to the event
	* @param event Event name
	* @param cb Callback function
	* @returns Unsubscribe function
	*/
	on(event, cb) {
		if (this.events[event]) this.events[event].push(cb);
		else this.events[event] = [cb];
		return () => {
			this.events[event] = this.events[event]?.filter((i) => cb !== i);
		};
	}
	/**
	* Remove a callback from the event
	* @param event Event name
	* @param callback Callback function
	*/
	off(event, callback) {
		this.events[event] = this.events[event]?.filter((i) => callback !== i);
	}
	/**
	* Remove all event listeners and clean up
	*/
	destroy() {
		this.events = {};
	}
};
var LINE_HEIGHT = 100 / 6;
var listenerOptions = { passive: false };
function getDeltaMultiplier(deltaMode, size) {
	if (deltaMode === 1) return LINE_HEIGHT;
	if (deltaMode === 2) return size;
	return 1;
}
var VirtualScroll = class {
	touchStart = {
		x: 0,
		y: 0
	};
	lastDelta = {
		x: 0,
		y: 0
	};
	window = {
		width: 0,
		height: 0
	};
	emitter = new Emitter();
	constructor(element, options = {
		wheelMultiplier: 1,
		touchMultiplier: 1
	}) {
		this.element = element;
		this.options = options;
		window.addEventListener("resize", this.onWindowResize);
		this.onWindowResize();
		this.element.addEventListener("wheel", this.onWheel, listenerOptions);
		this.element.addEventListener("touchstart", this.onTouchStart, listenerOptions);
		this.element.addEventListener("touchmove", this.onTouchMove, listenerOptions);
		this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
	}
	/**
	* Add an event listener for the given event and callback
	*
	* @param event Event name
	* @param callback Callback function
	*/
	on(event, callback) {
		return this.emitter.on(event, callback);
	}
	/** Remove all event listeners and clean up */
	destroy() {
		this.emitter.destroy();
		window.removeEventListener("resize", this.onWindowResize);
		this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
		this.element.removeEventListener("touchstart", this.onTouchStart, listenerOptions);
		this.element.removeEventListener("touchmove", this.onTouchMove, listenerOptions);
		this.element.removeEventListener("touchend", this.onTouchEnd, listenerOptions);
	}
	/**
	* Event handler for 'touchstart' event
	*
	* @param event Touch event
	*/
	onTouchStart = (event) => {
		const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
		this.touchStart.x = clientX;
		this.touchStart.y = clientY;
		this.lastDelta = {
			x: 0,
			y: 0
		};
		this.emitter.emit("scroll", {
			deltaX: 0,
			deltaY: 0,
			event
		});
	};
	/** Event handler for 'touchmove' event */
	onTouchMove = (event) => {
		const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
		const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
		const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
		this.touchStart.x = clientX;
		this.touchStart.y = clientY;
		this.lastDelta = {
			x: deltaX,
			y: deltaY
		};
		this.emitter.emit("scroll", {
			deltaX,
			deltaY,
			event
		});
	};
	onTouchEnd = (event) => {
		this.emitter.emit("scroll", {
			deltaX: this.lastDelta.x,
			deltaY: this.lastDelta.y,
			event
		});
	};
	/** Event handler for 'wheel' event */
	onWheel = (event) => {
		let { deltaX, deltaY, deltaMode } = event;
		const multiplierX = getDeltaMultiplier(deltaMode, this.window.width);
		const multiplierY = getDeltaMultiplier(deltaMode, this.window.height);
		deltaX *= multiplierX;
		deltaY *= multiplierY;
		deltaX *= this.options.wheelMultiplier;
		deltaY *= this.options.wheelMultiplier;
		this.emitter.emit("scroll", {
			deltaX,
			deltaY,
			event
		});
	};
	onWindowResize = () => {
		this.window = {
			width: window.innerWidth,
			height: window.innerHeight
		};
	};
};
var defaultEasing = (t) => Math.min(1, 1.001 - 2 ** (-10 * t));
var Lenis = class {
	_isScrolling = false;
	_isStopped = false;
	_isLocked = false;
	_preventNextNativeScrollEvent = false;
	_resetVelocityTimeout = null;
	_rafId = null;
	_isDraggingSelection = false;
	reducedMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
	/**
	* Whether or not the user is touching the screen
	*/
	isTouching;
	/**
	* Whether or not the device is running iOS
	*/
	isIos;
	/**
	* The time in ms since the lenis instance was created
	*/
	time = 0;
	/**
	* User data that will be forwarded through the scroll event
	*
	* @example
	* lenis.scrollTo(100, {
	*   userData: {
	*     foo: 'bar'
	*   }
	* })
	*/
	userData = {};
	/**
	* The last velocity of the scroll
	*/
	lastVelocity = 0;
	/**
	* The current velocity of the scroll
	*/
	velocity = 0;
	/**
	* The direction of the scroll
	*/
	direction = 0;
	/**
	* The options passed to the lenis instance
	*/
	options;
	/**
	* The target scroll value
	*/
	targetScroll;
	/**
	* The animated scroll value
	*/
	animatedScroll;
	animate = new Animate();
	emitter = new Emitter();
	dimensions;
	virtualScroll;
	constructor({ wrapper = window, content = document.documentElement, eventsTarget = wrapper, smoothWheel = true, syncTouch = false, syncTouchLerp = .075, touchInertiaExponent = 1.7, duration, easing, lerp = .1, infinite = false, orientation = "vertical", gestureOrientation = orientation === "horizontal" ? "both" : "vertical", touchMultiplier = 1, wheelMultiplier = 1, autoResize = true, prevent, virtualScroll, overscroll = true, autoRaf = false, anchors = false, autoToggle = false, allowNestedScroll = false, __experimental__naiveDimensions = false, naiveDimensions = __experimental__naiveDimensions, stopInertiaOnNavigate = false, respectReducedMotion = true } = {}) {
		window.lenisVersion = version;
		if (!window.lenis) window.lenis = {};
		window.lenis.version = version;
		if (orientation === "horizontal") window.lenis.horizontal = true;
		if (syncTouch === true) window.lenis.touch = true;
		this.isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
		if (!wrapper || wrapper === document.documentElement) wrapper = window;
		if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
		else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
		this.options = {
			wrapper,
			content,
			eventsTarget,
			smoothWheel,
			syncTouch,
			syncTouchLerp,
			touchInertiaExponent,
			duration,
			easing,
			lerp,
			infinite,
			gestureOrientation,
			orientation,
			touchMultiplier,
			wheelMultiplier,
			autoResize,
			prevent,
			virtualScroll,
			overscroll,
			autoRaf,
			anchors,
			autoToggle,
			allowNestedScroll,
			naiveDimensions,
			stopInertiaOnNavigate,
			respectReducedMotion
		};
		this.dimensions = new Dimensions(wrapper, content, { autoResize });
		this.updateClassName();
		this.targetScroll = this.animatedScroll = this.actualScroll;
		this.options.wrapper.addEventListener("scroll", this.onNativeScroll);
		this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: true });
		if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.addEventListener("click", this.onClick);
		this.options.wrapper.addEventListener("pointerdown", this.onPointerDown);
		this.virtualScroll = new VirtualScroll(eventsTarget, {
			touchMultiplier,
			wheelMultiplier
		});
		this.virtualScroll.on("scroll", this.onVirtualScroll);
		if (this.options.autoToggle) {
			this.checkOverflow();
			this.rootElement.addEventListener("transitionend", this.onTransitionEnd);
		}
		if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
	}
	/**
	* Destroy the lenis instance, remove all event listeners and clean up the class name
	*/
	destroy() {
		this.emitter.destroy();
		this.options.wrapper.removeEventListener("scroll", this.onNativeScroll);
		this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: true });
		this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown);
		if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.removeEventListener("click", this.onClick);
		this.virtualScroll.destroy();
		this.dimensions.destroy();
		this.cleanUpClassName();
		if (this._rafId) cancelAnimationFrame(this._rafId);
	}
	on(event, callback) {
		return this.emitter.on(event, callback);
	}
	off(event, callback) {
		return this.emitter.off(event, callback);
	}
	onScrollEnd = (e) => {
		if (!(e instanceof CustomEvent)) {
			if (this.isScrolling === "smooth" || this.isScrolling === false) e.stopPropagation();
		}
	};
	dispatchScrollendEvent = () => {
		this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", {
			bubbles: this.options.wrapper === window,
			detail: { lenisScrollEnd: true }
		}));
	};
	get overflow() {
		const property = this.isHorizontal ? "overflow-x" : "overflow-y";
		return getComputedStyle(this.rootElement)[property];
	}
	checkOverflow() {
		if (["hidden", "clip"].includes(this.overflow)) this.internalStop();
		else this.internalStart();
	}
	onTransitionEnd = (event) => {
		if (event.propertyName?.includes("overflow") && event.target === this.rootElement) this.checkOverflow();
	};
	setScroll(scroll) {
		if (this.isHorizontal) this.options.wrapper.scrollTo({
			left: scroll,
			behavior: "instant"
		});
		else this.options.wrapper.scrollTo({
			top: scroll,
			behavior: "instant"
		});
	}
	onClick = (event) => {
		const linkElementsUrls = event.composedPath().filter((node) => node instanceof HTMLAnchorElement && node.href).map((element) => new URL(element.href));
		const currentUrl = new URL(window.location.href);
		if (this.options.anchors) {
			const anchorElementUrl = linkElementsUrls.find((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname === targetUrl.pathname && targetUrl.hash);
			if (anchorElementUrl) {
				const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
				const target = decodeURIComponent(anchorElementUrl.hash);
				this.scrollTo(target, options);
				return;
			}
		}
		if (this.options.stopInertiaOnNavigate) {
			if (linkElementsUrls.some((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname !== targetUrl.pathname)) {
				this.reset();
				return;
			}
		}
	};
	onPointerDown = (event) => {
		if (event.button === 1) this.reset();
	};
	isTouchOnSelectionHandle(event) {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;
		const touch = event.targetTouches[0] ?? event.changedTouches[0];
		if (!touch) return false;
		const rects = selection.getRangeAt(0).getClientRects();
		if (rects.length === 0) return false;
		const first = rects[0];
		const last = rects[rects.length - 1];
		const HANDLE_RADIUS = 40;
		const nearStart = Math.hypot(touch.clientX - first.left, touch.clientY - first.top) <= HANDLE_RADIUS;
		const nearEnd = Math.hypot(touch.clientX - last.right, touch.clientY - last.bottom) <= HANDLE_RADIUS;
		return nearStart || nearEnd;
	}
	onVirtualScroll = (data) => {
		if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false) return;
		const { deltaX, deltaY, event } = data;
		this.emitter.emit("virtual-scroll", {
			deltaX,
			deltaY,
			event
		});
		if (event.ctrlKey) return;
		if (event.lenisStopPropagation) return;
		const isTouch = event.type.includes("touch");
		const isWheel = event.type.includes("wheel");
		if (isTouch && this.isIos) {
			if (event.type === "touchstart") this._isDraggingSelection = this.isTouchOnSelectionHandle(event);
			if (this._isDraggingSelection) {
				if (event.type === "touchend") this._isDraggingSelection = false;
				return;
			}
		}
		this.isTouching = event.type === "touchstart" || event.type === "touchmove";
		const isClickOrTap = deltaX === 0 && deltaY === 0;
		if (this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked) {
			this.reset();
			return;
		}
		const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
		if (isClickOrTap || isUnknownGesture) return;
		let composedPath = event.composedPath();
		composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
		const prevent = this.options.prevent;
		const gestureOrientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
		if (composedPath.find((node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || gestureOrientation === "vertical" && node.hasAttribute?.("data-lenis-prevent-vertical") || gestureOrientation === "horizontal" && node.hasAttribute?.("data-lenis-prevent-horizontal") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.hasNestedScroll(node, {
			deltaX,
			deltaY
		})))) return;
		if (this.isStopped || this.isLocked) {
			if (event.cancelable) event.preventDefault();
			return;
		}
		if (!(this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel)) {
			this.isScrolling = "native";
			this.animate.stop();
			event.lenisStopPropagation = true;
			return;
		}
		let delta = deltaY;
		if (this.options.gestureOrientation === "both") delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
		else if (this.options.gestureOrientation === "horizontal") delta = deltaX;
		if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) event.lenisStopPropagation = true;
		if (event.cancelable) event.preventDefault();
		const isSyncTouch = isTouch && this.options.syncTouch;
		const hasTouchInertia = isTouch && event.type === "touchend";
		if (hasTouchInertia) delta = Math.sign(delta) * Math.abs(this.velocity) ** this.options.touchInertiaExponent;
		this.scrollTo(this.targetScroll + delta, {
			programmatic: false,
			...isSyncTouch ? { lerp: hasTouchInertia ? this.options.syncTouchLerp : 1 } : {
				lerp: this.options.lerp,
				duration: this.options.duration,
				easing: this.options.easing
			}
		});
	};
	/**
	* Force lenis to recalculate the dimensions
	*/
	resize() {
		this.dimensions.resize();
		this.animatedScroll = this.targetScroll = this.actualScroll;
		this.emit();
	}
	emit() {
		this.emitter.emit("scroll", this);
	}
	onNativeScroll = () => {
		if (this._resetVelocityTimeout !== null) {
			clearTimeout(this._resetVelocityTimeout);
			this._resetVelocityTimeout = null;
		}
		if (this._preventNextNativeScrollEvent) {
			this._preventNextNativeScrollEvent = false;
			return;
		}
		if (this.isScrolling === false || this.isScrolling === "native") {
			const lastScroll = this.animatedScroll;
			this.animatedScroll = this.targetScroll = this.actualScroll;
			this.lastVelocity = this.velocity;
			this.velocity = this.animatedScroll - lastScroll;
			this.direction = Math.sign(this.animatedScroll - lastScroll);
			if (!this.isStopped) this.isScrolling = "native";
			this.emit();
			if (this.velocity !== 0) this._resetVelocityTimeout = setTimeout(() => {
				this.lastVelocity = this.velocity;
				this.velocity = 0;
				this.isScrolling = false;
				this.emit();
			}, 400);
		}
	};
	reset() {
		this.isLocked = false;
		this.isScrolling = false;
		this.animatedScroll = this.targetScroll = this.actualScroll;
		this.lastVelocity = this.velocity = 0;
		this.animate.stop();
	}
	/**
	* Start lenis scroll after it has been stopped
	*/
	start() {
		if (!this.isStopped) return;
		if (this.options.autoToggle) {
			this.rootElement.style.removeProperty("overflow");
			return;
		}
		this.internalStart();
	}
	internalStart() {
		if (!this.isStopped) return;
		this.reset();
		this.isStopped = false;
		this.emit();
	}
	/**
	* Stop lenis scroll
	*/
	stop() {
		if (this.isStopped) return;
		if (this.options.autoToggle) {
			this.rootElement.style.setProperty("overflow", "clip");
			return;
		}
		this.internalStop();
	}
	internalStop() {
		if (this.isStopped) return;
		this.reset();
		this.isStopped = true;
		this.emit();
	}
	/**
	* RequestAnimationFrame for lenis
	*
	* @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
	*/
	raf = (time) => {
		const deltaTime = time - (this.time || time);
		this.time = time;
		this.animate.advance(deltaTime * .001);
		if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
	};
	/**
	* Scroll to a target value
	*
	* @param target The target value to scroll to
	* @param options The options for the scroll
	*
	* @example
	* lenis.scrollTo(100, {
	*   offset: 100,
	*   duration: 1,
	*   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
	*   lerp: 0.1,
	*   onStart: () => {
	*     console.log('onStart')
	*   },
	*   onComplete: () => {
	*     console.log('onComplete')
	*   },
	* })
	*/
	scrollTo(_target, { offset = 0, immediate = false, lock = false, programmatic = true, lerp = programmatic ? this.options.lerp : void 0, duration = programmatic ? this.options.duration : void 0, easing = programmatic ? this.options.easing : void 0, onStart, onComplete, force = false, userData } = {}) {
		if (this.prefersReducedMotion) if (programmatic) immediate = true;
		else {
			lerp = 1;
			duration = void 0;
			easing = void 0;
		}
		if ((this.isStopped || this.isLocked) && !force) return;
		let target = _target;
		let adjustedOffset = offset;
		if (typeof target === "string" && [
			"top",
			"left",
			"start",
			"#"
		].includes(target)) target = 0;
		else if (typeof target === "string" && [
			"bottom",
			"right",
			"end"
		].includes(target)) target = this.limit;
		else {
			let node = null;
			if (typeof target === "string") {
				node = target.startsWith("#") ? document.getElementById(target.slice(1)) : document.querySelector(target);
				if (!node) if (target === "#top") target = 0;
				else console.warn("Lenis: Target not found", target);
			} else if (target instanceof HTMLElement && target?.nodeType) node = target;
			if (node) {
				if (this.options.wrapper !== window) {
					const wrapperRect = this.rootElement.getBoundingClientRect();
					adjustedOffset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
				}
				const rect = node.getBoundingClientRect();
				const targetStyle = getComputedStyle(node);
				const scrollMargin = this.isHorizontal ? Number.parseFloat(targetStyle.scrollMarginLeft) : Number.parseFloat(targetStyle.scrollMarginTop);
				const containerStyle = getComputedStyle(this.rootElement);
				const scrollPadding = this.isHorizontal ? Number.parseFloat(containerStyle.scrollPaddingLeft) : Number.parseFloat(containerStyle.scrollPaddingTop);
				target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll - (Number.isNaN(scrollMargin) ? 0 : scrollMargin) - (Number.isNaN(scrollPadding) ? 0 : scrollPadding);
			}
		}
		if (typeof target !== "number") return;
		target += adjustedOffset;
		if (this.options.infinite) {
			if (programmatic) {
				this.targetScroll = this.animatedScroll = this.scroll;
				const distance = target - this.animatedScroll;
				if (distance > this.limit / 2) target -= this.limit;
				else if (distance < -this.limit / 2) target += this.limit;
			}
		} else target = clamp(0, target, this.limit);
		if (target === this.targetScroll) {
			onStart?.(this);
			onComplete?.(this);
			return;
		}
		this.userData = userData ?? {};
		if (immediate) {
			this.animatedScroll = this.targetScroll = target;
			this.setScroll(this.scroll);
			this.reset();
			this.preventNextNativeScrollEvent();
			this.emit();
			onComplete?.(this);
			this.userData = {};
			requestAnimationFrame(() => {
				this.dispatchScrollendEvent();
			});
			return;
		}
		if (!programmatic) this.targetScroll = target;
		if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
		else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
		this.animate.fromTo(this.animatedScroll, target, {
			duration,
			easing,
			lerp,
			onStart: () => {
				if (lock) this.isLocked = true;
				this.isScrolling = "smooth";
				onStart?.(this);
			},
			onUpdate: (value, completed) => {
				this.isScrolling = "smooth";
				this.lastVelocity = this.velocity;
				this.velocity = value - this.animatedScroll;
				this.direction = Math.sign(this.velocity);
				this.animatedScroll = value;
				this.setScroll(this.scroll);
				if (programmatic) this.targetScroll = value;
				if (!completed) this.emit();
				if (completed) {
					this.reset();
					this.emit();
					onComplete?.(this);
					this.userData = {};
					requestAnimationFrame(() => {
						this.dispatchScrollendEvent();
					});
					this.preventNextNativeScrollEvent();
				}
			}
		});
	}
	preventNextNativeScrollEvent() {
		this._preventNextNativeScrollEvent = true;
		requestAnimationFrame(() => {
			this._preventNextNativeScrollEvent = false;
		});
	}
	hasNestedScroll(node, { deltaX, deltaY }) {
		const time = Date.now();
		if (!node._lenis) node._lenis = {};
		const cache = node._lenis;
		let hasOverflowX;
		let hasOverflowY;
		let isScrollableX;
		let isScrollableY;
		let hasOverscrollBehaviorX;
		let hasOverscrollBehaviorY;
		let scrollWidth;
		let scrollHeight;
		let clientWidth;
		let clientHeight;
		if (time - (cache.time ?? 0) > 2e3) {
			cache.time = Date.now();
			const computedStyle = window.getComputedStyle(node);
			cache.computedStyle = computedStyle;
			hasOverflowX = [
				"auto",
				"overlay",
				"scroll"
			].includes(computedStyle.overflowX);
			hasOverflowY = [
				"auto",
				"overlay",
				"scroll"
			].includes(computedStyle.overflowY);
			hasOverscrollBehaviorX = ["auto"].includes(computedStyle.overscrollBehaviorX);
			hasOverscrollBehaviorY = ["auto"].includes(computedStyle.overscrollBehaviorY);
			cache.hasOverflowX = hasOverflowX;
			cache.hasOverflowY = hasOverflowY;
			if (!(hasOverflowX || hasOverflowY)) return false;
			scrollWidth = node.scrollWidth;
			scrollHeight = node.scrollHeight;
			clientWidth = node.clientWidth;
			clientHeight = node.clientHeight;
			isScrollableX = scrollWidth > clientWidth;
			isScrollableY = scrollHeight > clientHeight;
			cache.isScrollableX = isScrollableX;
			cache.isScrollableY = isScrollableY;
			cache.scrollWidth = scrollWidth;
			cache.scrollHeight = scrollHeight;
			cache.clientWidth = clientWidth;
			cache.clientHeight = clientHeight;
			cache.hasOverscrollBehaviorX = hasOverscrollBehaviorX;
			cache.hasOverscrollBehaviorY = hasOverscrollBehaviorY;
		} else {
			isScrollableX = cache.isScrollableX;
			isScrollableY = cache.isScrollableY;
			hasOverflowX = cache.hasOverflowX;
			hasOverflowY = cache.hasOverflowY;
			scrollWidth = cache.scrollWidth;
			scrollHeight = cache.scrollHeight;
			clientWidth = cache.clientWidth;
			clientHeight = cache.clientHeight;
			hasOverscrollBehaviorX = cache.hasOverscrollBehaviorX;
			hasOverscrollBehaviorY = cache.hasOverscrollBehaviorY;
		}
		if (!(hasOverflowX && isScrollableX || hasOverflowY && isScrollableY)) return false;
		const orientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
		let scroll;
		let maxScroll;
		let delta;
		let hasOverflow;
		let isScrollable;
		let hasOverscrollBehavior;
		if (orientation === "horizontal") {
			scroll = Math.round(node.scrollLeft);
			maxScroll = scrollWidth - clientWidth;
			delta = deltaX;
			hasOverflow = hasOverflowX;
			isScrollable = isScrollableX;
			hasOverscrollBehavior = hasOverscrollBehaviorX;
		} else if (orientation === "vertical") {
			scroll = Math.round(node.scrollTop);
			maxScroll = scrollHeight - clientHeight;
			delta = deltaY;
			hasOverflow = hasOverflowY;
			isScrollable = isScrollableY;
			hasOverscrollBehavior = hasOverscrollBehaviorY;
		} else return false;
		if (!hasOverscrollBehavior && (scroll >= maxScroll || scroll <= 0)) return true;
		return (delta > 0 ? scroll < maxScroll : scroll > 0) && hasOverflow && isScrollable;
	}
	/**
	* The root element on which lenis is instanced
	*/
	get rootElement() {
		return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
	}
	/**
	* The limit which is the maximum scroll value
	*/
	get limit() {
		if (this.options.naiveDimensions) {
			if (this.isHorizontal) return this.rootElement.scrollWidth - this.rootElement.clientWidth;
			return this.rootElement.scrollHeight - this.rootElement.clientHeight;
		}
		return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
	}
	/**
	* Whether or not the scroll is horizontal
	*/
	get isHorizontal() {
		return this.options.orientation === "horizontal";
	}
	/**
	* The actual scroll value
	*/
	get actualScroll() {
		const wrapper = this.options.wrapper;
		return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
	}
	/**
	* The current scroll value
	*/
	get scroll() {
		return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
	}
	/**
	* The progress of the scroll relative to the limit
	*/
	get progress() {
		return this.limit === 0 ? 1 : this.scroll / this.limit;
	}
	/**
	* Current scroll state
	*/
	get isScrolling() {
		return this._isScrolling;
	}
	set isScrolling(value) {
		if (this._isScrolling !== value) {
			this._isScrolling = value;
			this.updateClassName();
		}
	}
	/**
	* Check if lenis is stopped
	*/
	get isStopped() {
		return this._isStopped;
	}
	set isStopped(value) {
		if (this._isStopped !== value) {
			this._isStopped = value;
			this.updateClassName();
		}
	}
	/**
	* Check if lenis is locked
	*/
	get isLocked() {
		return this._isLocked;
	}
	set isLocked(value) {
		if (this._isLocked !== value) {
			this._isLocked = value;
			this.updateClassName();
		}
	}
	/**
	* Check if lenis is smooth scrolling
	*/
	get isSmooth() {
		return this.isScrolling === "smooth";
	}
	/**
	* Whether the user prefers reduced motion and lenis is honoring it (see `respectReducedMotion` option)
	*/
	get prefersReducedMotion() {
		return this.options.respectReducedMotion && this.reducedMotionMediaQuery.matches;
	}
	/**
	* The class name applied to the wrapper element
	*/
	get className() {
		let className = "lenis";
		if (this.options.autoToggle) className += " lenis-autoToggle";
		if (this.isStopped) className += " lenis-stopped";
		if (this.isLocked) className += " lenis-locked";
		if (this.isScrolling) className += " lenis-scrolling";
		if (this.isScrolling === "smooth") className += " lenis-smooth";
		return className;
	}
	updateClassName() {
		this.cleanUpClassName();
		this.className.split(" ").forEach((className) => {
			this.rootElement.classList.add(className);
		});
	}
	cleanUpClassName() {
		for (const className of Array.from(this.rootElement.classList)) if (className === "lenis" || className.startsWith("lenis-")) this.rootElement.classList.remove(className);
	}
};
//#endregion
//#region src/lib/scrollJump.ts
/**
* Geometry + easing for the bounce-eased section jumps (nav links, CTAs,
* logo, back-to-top). Kept DOM-free on purpose: the desktop (Lenis) and
* touch (rAF) paths in `islands/SmoothScroll.tsx` both plan a jump through
* here, so the two land on the same pixel with the same curve, and the part
* that used to be wrong is the part a unit test can actually see.
*/
/**
* Biggest `back` constant we ever use. `easeOutBack` with c1 = 1.05
* settles ~4% of the distance past the target and eases back — a gentle
* bounce, not the springy default (1.70158 ⇒ ~10%).
*/
var MAX_OVERSHOOT = 1.05;
/**
* How far past its target `easeOutBack(c1)` actually travels, as a fraction
* of the distance.
*
* Closed form rather than a sampled guess: the curve's maximum sits at
* u = -2·c1 / 3·(c1+1), and substituting that back reduces the peak to
* (4/27)·c1³/(c1+1)². The jump planner needs this number in pixels *before*
* it starts moving, which is what lets it refuse an overshoot that would
* run off the end of the document.
*/
function peakOvershoot(c1) {
	if (c1 <= 0) return 0;
	return 4 / 27 * c1 ** 3 / (c1 + 1) ** 2;
}
/**
* `easeOutBack` for a given back constant. c1 = 0 degrades to a plain
* ease-out cubic — same arrival feel, no overshoot at all.
*
* Returns exactly 1 at t ≥ 1 so a tween lands on its destination pixel
* instead of a rounding error away from it.
*/
function easeOutBack(c1) {
	const c3 = c1 + 1;
	return (t) => t >= 1 ? 1 : 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}
/**
* The largest back constant whose overshoot still fits inside `room` px.
*
* `peakOvershoot` is monotonic in c1, so a short bisection is exact enough
* and avoids inverting a cubic. Zero room ⇒ zero overshoot: at the very top
* or bottom of the document there is nothing to bounce into, and asking for
* one anyway is what made the jump stall (see `planJump`).
*/
function fitOvershoot(distance, room, max = MAX_OVERSHOOT) {
	const span = Math.abs(distance);
	if (span === 0 || room <= 0 || max <= 0) return 0;
	const wanted = room / span;
	if (wanted >= peakOvershoot(max)) return max;
	let lo = 0;
	let hi = max;
	for (let i = 0; i < 24; i += 1) {
		const mid = (lo + hi) / 2;
		if (peakOvershoot(mid) > wanted) hi = mid;
		else lo = mid;
	}
	return lo;
}
/**
* Resolve a jump against the *current* layout: where it lands, and which
* easing can actually be drawn there.
*
* The second half is the point. An overshooting ease has to travel past its
* destination, and past the top or bottom of the document there is nowhere
* to travel to — the browser simply clamps the scroll position, so the page
* froze for the ~500ms tail of every back-to-top and every jump to the last
* section while the animation played out against a wall. So the runway
* beyond the destination *in the direction of travel* is measured first and
* the overshoot is fitted to it, degrading to a clean ease-out where there
* is no room. A bounce you cannot draw is worse than no bounce.
*/
function planJump({ startY, targetY, maxY }) {
	const limit = Math.max(0, maxY);
	const destY = Math.min(Math.max(targetY, 0), limit);
	const distance = destY - startY;
	const overshoot = fitOvershoot(distance, distance > 0 ? limit - destY : destY);
	return {
		destY,
		distance,
		overshoot,
		easing: easeOutBack(overshoot)
	};
}
//#endregion
//#region src/lib/scrollLock.ts
/**
* Input lock for the duration of a programmatic scroll.
*
* The bounce-eased jumps in `islands/SmoothScroll.tsx` (nav links, the hero
* CTAs, the logo, the back-to-top nub) drive the scroll position frame by
* frame for 1.2s. Anything the visitor does with the wheel, a finger or the
* keyboard in that window fights the tween for the same one property, and
* both paths handled that differently and badly: on desktop Lenis kept
* writing its own position, so the visitor's wheel simply did nothing and
* the page felt stuck; on touch the tween *cancelled itself* on the first
* touch, so a jump that began while the finger was still on the glass was
* abandoned halfway to a section — arriving nowhere in particular.
*
* This locks the input instead: for the length of the jump the page belongs
* to the animation, and it is handed back the moment the jump lands.
*
* WHAT IS DELIBERATELY NOT BLOCKED, because a scroll lock is the kind of
* thing that quietly breaks a page:
*
*  - **Ctrl/⌘ + wheel** is browser ZOOM, not scrolling. Blocking it takes
*    page zoom away from someone who very likely needs it.
*  - **Arrow / Home / End inside an editable control** move the caret. The
*    contact form is on this page; eating those would look like a dead
*    keyboard.
*  - **Space on a button, link or summary** activates it. Space is a scroll
*    key only when nothing focusable is holding it.
*  - **Every other key**: Tab, Escape and shortcuts stay live, so focus can
*    always leave and nothing can trap a keyboard user.
*
* And it always ends: the listeners come off on completion, and a safety
* timeout releases them anyway if a completion callback never fires. A lock
* that can outlive its animation would be a page that cannot be scrolled at
* all, with nothing in the console to say why.
*/
/** Keys with which the browser scrolls the document. */
var SCROLL_KEYS = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"PageUp",
	"PageDown",
	"Home",
	"End",
	" ",
	"Spacebar"
]);
/** Elements whose own keyboard handling outranks scrolling. */
var EDITABLE = /* @__PURE__ */ new Set([
	"INPUT",
	"TEXTAREA",
	"SELECT"
]);
/** Elements that treat Space as "activate me". */
var SPACE_ACTIVATES = /* @__PURE__ */ new Set([
	"BUTTON",
	"A",
	"SUMMARY",
	"DETAILS",
	"OPTION"
]);
function isEditable(node) {
	if (!(node instanceof HTMLElement)) return false;
	return EDITABLE.has(node.tagName) || node.isContentEditable;
}
/**
* Does this keystroke mean "scroll the document"? Exported because it is the
* whole policy above expressed as one function, and it is the part worth
* testing without a scroll animation anywhere near it.
*/
function isScrollKey(event) {
	if (event.ctrlKey || event.metaKey || event.altKey) return false;
	if (!SCROLL_KEYS.has(event.key)) return false;
	const target = event.target;
	if (isEditable(target)) return false;
	if ((event.key === " " || event.key === "Spacebar") && target instanceof HTMLElement && SPACE_ACTIVATES.has(target.tagName)) return false;
	return true;
}
/** A wheel event the visitor means as scrolling, rather than as zoom. */
function isScrollWheel(event) {
	return !event.ctrlKey && !event.metaKey;
}
function createScrollLock(options = {}) {
	const target = options.target ?? globalThis;
	const maxDurationMs = options.maxDurationMs ?? 3e3;
	let engaged = false;
	let timer;
	const swallowWheel = (event) => {
		if (isScrollWheel(event)) event.preventDefault();
	};
	const swallowTouch = (event) => {
		event.preventDefault();
	};
	const swallowKey = (event) => {
		if (isScrollKey(event)) event.preventDefault();
	};
	const opts = { passive: false };
	const attach = () => {
		target.addEventListener("wheel", swallowWheel, opts);
		target.addEventListener("touchmove", swallowTouch, opts);
		target.addEventListener("keydown", swallowKey, opts);
	};
	const detach = () => {
		target.removeEventListener("wheel", swallowWheel, opts);
		target.removeEventListener("touchmove", swallowTouch, opts);
		target.removeEventListener("keydown", swallowKey, opts);
	};
	const release = () => {
		if (timer !== void 0) {
			clearTimeout(timer);
			timer = void 0;
		}
		if (!engaged) return;
		engaged = false;
		detach();
	};
	const engage = () => {
		if (timer !== void 0) clearTimeout(timer);
		timer = setTimeout(release, maxDurationMs);
		if (engaged) return;
		engaged = true;
		attach();
	};
	return {
		engage,
		release,
		destroy: release,
		get engaged() {
			return engaged;
		}
	};
}
//#endregion
//#region src/components/islands/SmoothScroll.tsx
/** How long a click-jump takes, both paths. */
var JUMP_DURATION_MS = 1200;
/**
* Clearance for the fixed floating header, read back off `<html>`'s
* `scroll-padding-top` (set in `styles/global.css`) instead of a constant
* kept here.
*
* One value then drives all four kinds of section jump: these tweens, the
* browser's own fragment landing on a cross-page `/#about`, back/forward
* restoration, and find-in-page / keyboard focus. It is also responsive —
* the bar is shorter below `lg` — which a JS constant was not.
*
* `scroll-padding-top` defaults to the keyword `auto`, which parses to NaN;
* treat that as no clearance rather than shifting every jump by NaN px.
*/
function headerClearance() {
	const raw = getComputedStyle(document.documentElement).scrollPaddingTop;
	const px = Number.parseFloat(raw);
	return Number.isFinite(px) ? px : 0;
}
/** Furthest the document can scroll. */
function maxScrollY() {
	const doc = document.documentElement;
	return Math.max(0, doc.scrollHeight - doc.clientHeight);
}
/**
* Resolve any accepted target to an absolute document Y, then plan the jump
* against the live layout. A number is taken as-is (back-to-top passes 0);
* an element gets the header clearance subtracted.
*/
function planFor(target) {
	const startY = window.scrollY;
	const node = typeof target === "string" ? document.querySelector(target) : target;
	return {
		startY,
		...planJump({
			startY,
			targetY: typeof node === "number" ? node : node instanceof HTMLElement ? startY + node.getBoundingClientRect().top - headerClearance() : startY,
			maxY: maxScrollY()
		})
	};
}
/**
* Mount once at the root of the layout. The playful ease-out-back *bounce* is
* reserved for programmatic jumps triggered by clicking something (nav links,
* CTAs, logo, back-to-top) — never for plain scrolling.
*
* Two implementations, same feel:
*  - **Fine pointer (desktop):** Lenis hijacks the wheel for a smooth
*    expo ease-out, and click-jumps run through `lenis.scrollTo` with the
*    bounce easing.
*  - **Coarse pointer (touch):** Lenis is skipped entirely — on iOS/Android
*    it fights native momentum-scroll and feels worse than the platform
*    default. Wheel/touch scrolling stays fully native; only click-jumps are
*    driven, via a self-contained `requestAnimationFrame` tween that reuses
*    the exact same bounce easing so mobile section-jumps bounce like desktop.
*
* Both paths plan through `~/lib/scrollJump`, so the destination pixel and
* the curve are identical; only the thing doing the writing differs.
*
* While a jump is in flight the page belongs to it: wheel, touch and the
* scroll keys are swallowed (`~/lib/scrollLock`) until it lands, so the
* visitor and the tween are never writing the same scroll position in the
* same frame. Clicking a DIFFERENT section mid-jump still works and simply
* retargets — the lock is on scrolling, not on navigating.
*/
function SmoothScroll() {
	useEffect(() => {
		const prefersReduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const inputLock = createScrollLock({ maxDurationMs: 1800 });
		const makeAnchorClickHandler = (scrollTo) => (event) => {
			if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			const link = event.target?.closest("a[href]");
			if (!(link instanceof HTMLAnchorElement)) return;
			if (link.target && link.target !== "_self") return;
			const url = new URL(link.href, location.href);
			if (url.origin !== location.origin) return;
			if (!(url.pathname.replace(/\/+$/, "") === location.pathname.replace(/\/+$/, "")) || !url.hash || url.hash === "#") return;
			let el = null;
			try {
				el = document.querySelector(url.hash);
			} catch {
				el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
			}
			if (!(el instanceof HTMLElement)) return;
			event.preventDefault();
			scrollTo(el);
			history.pushState(null, "", url.hash);
		};
		if (typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches) {
			let rafId = 0;
			const cancelTween = () => {
				if (rafId) {
					cancelAnimationFrame(rafId);
					rafId = 0;
				}
				inputLock.release();
			};
			const jumpTo = (y) => window.scrollTo({
				top: y,
				behavior: "instant"
			});
			const tdsScrollTo = (target, opts) => {
				cancelTween();
				const { startY, destY, distance, easing } = planFor(target);
				if ((opts?.immediate ?? prefersReduce()) || distance === 0) {
					jumpTo(destY);
					return;
				}
				inputLock.engage();
				const start = performance.now();
				const step = (now) => {
					const t = Math.min(1, (now - start) / JUMP_DURATION_MS);
					jumpTo(startY + distance * easing(t));
					if (t < 1) {
						rafId = requestAnimationFrame(step);
						return;
					}
					rafId = 0;
					inputLock.release();
				};
				rafId = requestAnimationFrame(step);
			};
			window.tdsScrollTo = tdsScrollTo;
			const onClick = makeAnchorClickHandler(tdsScrollTo);
			document.addEventListener("click", onClick);
			return () => {
				cancelTween();
				inputLock.destroy();
				document.removeEventListener("click", onClick);
				delete window.tdsScrollTo;
			};
		}
		const lenis = new Lenis({
			duration: 1.1,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true
		});
		window.lenis = lenis;
		const tdsScrollTo = (target, opts) => {
			const { destY, distance, easing } = planFor(target);
			const immediate = opts?.immediate ?? prefersReduce();
			const animated = !immediate && distance !== 0;
			if (animated) inputLock.engage();
			else inputLock.release();
			lenis.scrollTo(destY, {
				duration: JUMP_DURATION_MS / 1e3,
				easing,
				immediate,
				lock: animated,
				force: true,
				onComplete: () => inputLock.release()
			});
		};
		window.tdsScrollTo = tdsScrollTo;
		const onClick = makeAnchorClickHandler(tdsScrollTo);
		document.addEventListener("click", onClick);
		let rafId;
		const raf = (time) => {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		};
		rafId = requestAnimationFrame(raf);
		return () => {
			cancelAnimationFrame(rafId);
			inputLock.destroy();
			document.removeEventListener("click", onClick);
			lenis.destroy();
			delete window.lenis;
			delete window.tdsScrollTo;
		};
	}, []);
	return null;
}
//#endregion
//#region src/components/islands/ScrollProgress.tsx
/**
* Thin reading-progress bar fixed to the top of the viewport. Tracks
* window scroll position against documentElement.scrollHeight; uses
* requestAnimationFrame to keep updates in the same paint cycle as
* Lenis-driven smooth scrolling.
*
* Renders nothing until the page is actually scrollable — short pages
* (e.g. /preise on tall viewports) would otherwise show a permanently
* full bar.
*
* The bar's width is written STRAIGHT to the node, not held in state. It
* changes on every frame of every scroll, and a `useState` for it meant a
* React render, a reconciliation and a commit per frame, for the whole life
* of the page, to move one transform by a fraction of a percent. `scrollable`
* stays state because it changes about once per page and decides whether
* anything is mounted at all.
*/
function ScrollProgress() {
	const [scrollable, setScrollable] = useState(false);
	const barRef = useRef(null);
	const progressRef = useRef(0);
	/**
	* Callback ref rather than a plain one: the bar is mounted by the SAME
	* state flip that first measures the page, so on that render there is no
	* node yet to write to and the bar would start at zero however far down
	* the page a reload restored the visitor.
	*/
	const attachBar = useCallback((node) => {
		barRef.current = node;
		if (node) node.style.transform = `scaleX(${progressRef.current})`;
	}, []);
	useEffect(() => {
		let rafId = 0;
		let scrollableNow = false;
		const setScrollableOnce = (next) => {
			if (next === scrollableNow) return;
			scrollableNow = next;
			setScrollable(next);
		};
		const update = () => {
			const doc = document.documentElement;
			const max = doc.scrollHeight - doc.clientHeight;
			if (max <= 0) {
				setScrollableOnce(false);
				return;
			}
			setScrollableOnce(true);
			progressRef.current = Math.min(1, Math.max(0, window.scrollY / max));
			if (barRef.current) barRef.current.style.transform = `scaleX(${progressRef.current})`;
		};
		const onScroll = () => {
			if (rafId) return;
			rafId = requestAnimationFrame(() => {
				rafId = 0;
				update();
			});
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", update);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, []);
	if (!scrollable) return null;
	return /* @__PURE__ */ jsx("div", {
		"aria-hidden": "true",
		className: "fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none",
		children: /* @__PURE__ */ jsx("div", {
			ref: attachBar,
			className: "h-full origin-left bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-accent-pink)]",
			style: { transform: `scaleX(${progressRef.current})` }
		})
	});
}
//#endregion
//#region src/components/islands/CustomCursor.tsx
/**
* An additive custom cursor: a small dot pinned to the pointer plus a larger
* ring that trails it. The ring squashes/stretches along the movement vector
* (faster = more stretch), grows over interactive elements and pinches on
* click — so it reads as reactive to what the user is doing. Its colour flips
* between the brand accent (over light surfaces) and a light pink (over dark
* ones) by sampling the background luminance under the pointer, mirroring the
* approach in FloatingCta.astro. The native cursor stays visible underneath.
*
* Bails out on coarse pointers (touch) and under `prefers-reduced-motion`;
* matching CSS hides it there too. Mounted `client:idle`.
*/
function CustomCursor() {
	const ringRef = useRef(null);
	const dotRef = useRef(null);
	useEffect(() => {
		const fine = window.matchMedia("(pointer: fine)").matches;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!fine || reduce) return;
		const ring = ringRef.current;
		const dot = dotRef.current;
		if (!ring || !dot) return;
		let mouseX = window.innerWidth / 2;
		let mouseY = window.innerHeight / 2;
		let ringX = mouseX;
		let ringY = mouseY;
		let prevX = ringX;
		let prevY = ringY;
		let visible = false;
		let hovering = false;
		let onDark = false;
		const interactiveSelector = "a, button, [role='tab'], [role='button'], input, textarea, select, label, summary, .process-step-item";
		const parseRgb = (value) => {
			const match = value.match(/rgba?\(([^)]+)\)/);
			if (!match) return null;
			const [r, g, b, a = 1] = match[1].split(",").map((p) => parseFloat(p.trim()));
			return [
				r,
				g,
				b,
				a
			];
		};
		const isDark = (r, g, b) => .2126 * r + .7152 * g + .0722 * b < 115;
		const sampleOnDark = () => {
			const els = document.elementsFromPoint(mouseX, mouseY);
			for (const el of els) {
				if (el === ring || el === dot) continue;
				const rgb = parseRgb(getComputedStyle(el).backgroundColor);
				if (rgb && rgb[3] > .5) return isDark(rgb[0], rgb[1], rgb[2]);
			}
			const body = parseRgb(getComputedStyle(document.body).backgroundColor);
			return body ? isDark(body[0], body[1], body[2]) : false;
		};
		const onMove = (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			wake();
			dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
			if (!visible) {
				visible = true;
				ring.style.opacity = "1";
				dot.style.opacity = "1";
			}
			const next = !!e.target?.closest(interactiveSelector);
			if (next !== hovering) {
				hovering = next;
				ring.classList.toggle("is-hover", next);
			}
		};
		const onLeave = () => {
			visible = false;
			ring.style.opacity = "0";
			dot.style.opacity = "0";
		};
		const onDown = () => ring.classList.add("is-down");
		const onUp = () => ring.classList.remove("is-down");
		const SAMPLE_MS = 100;
		const SETTLED_PX = .05;
		let raf = 0;
		let lastSample = -Infinity;
		const loop = (now) => {
			ringX += (mouseX - ringX) * .28;
			ringY += (mouseY - ringY) * .28;
			const vx = ringX - prevX;
			const vy = ringY - prevY;
			prevX = ringX;
			prevY = ringY;
			const stretch = Math.min(Math.hypot(vx, vy) / 28, .45);
			const angle = Math.atan2(vy, vx) * 180 / Math.PI;
			const sx = (1 + stretch).toFixed(3);
			const sy = (1 - stretch * .6).toFixed(3);
			ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${sx}, ${sy})`;
			if (visible && now - lastSample >= SAMPLE_MS) {
				lastSample = now;
				const next = sampleOnDark();
				if (next !== onDark) {
					onDark = next;
					ring.classList.toggle("is-on-dark", next);
					dot.classList.toggle("is-on-dark", next);
				}
			}
			if (Math.abs(mouseX - ringX) < SETTLED_PX && Math.abs(mouseY - ringY) < SETTLED_PX) {
				raf = 0;
				return;
			}
			raf = requestAnimationFrame(loop);
		};
		const wake = () => {
			if (!raf) raf = requestAnimationFrame(loop);
		};
		wake();
		window.addEventListener("mousemove", onMove, { passive: true });
		document.addEventListener("mouseleave", onLeave);
		window.addEventListener("mousedown", onDown, { passive: true });
		window.addEventListener("mouseup", onUp, { passive: true });
		window.addEventListener("scroll", wake, { passive: true });
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseleave", onLeave);
			window.removeEventListener("mousedown", onDown);
			window.removeEventListener("mouseup", onUp);
			window.removeEventListener("scroll", wake);
		};
	}, []);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
		ref: ringRef,
		className: "tds-cursor-ring",
		"aria-hidden": "true"
	}), /* @__PURE__ */ jsx("div", {
		ref: dotRef,
		className: "tds-cursor-dot",
		"aria-hidden": "true"
	})] });
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/i18n/index.js
var translations$1 = {
	de: {
		nav: {
			about: "Über mich",
			services: "Leistungen",
			tech: "Tech",
			portfolio: "Portfolio",
			process: "Prozess",
			blog: "Journal",
			contact: "Kontakt",
			cta: "Unverbindlich anfragen",
			pricing: "Preise"
		},
		hero: {
			availability: "Verfügbar für Projekte · Q3 2026",
			location: "Schwarzenbek · Hamburg",
			headline: "Digitalisierung, die",
			headlineAccent: "Arbeit",
			headlineSuffix: "abnimmt.",
			sub: "Websites, Webshops und Werkzeuge für kleine Betriebe. Ich schaue, wo es hakt – und baue, was hilft. Aus Schwarzenbek bei Hamburg.",
			cta1: "Unverbindlich anfragen",
			cta2: "Leistungen ansehen",
			scrollHint: "Scrollen"
		},
		about: {
			label: "— 01 / Über mich",
			headline: "Hi, ich bin",
			headlineAccent: "Julian.",
			lead: "Ich bin freier Entwickler in Schwarzenbek bei Hamburg. Ich arbeite für Selbstständige und kleine Betriebe ohne eigene IT.",
			p1: "Website, Webshop, kleines Programm oder ein Ablauf, der einfacher werden soll: Ich höre zu, sortiere das Vorhaben und setze es um. Ein Ansprechpartner, von Anfang bis Ende.",
			p2: "Standardsoftware zwingt Sie, sich anzupassen. Ein gutes Werkzeug macht es andersherum. Manchmal ist die ehrliche Antwort: Es lohnt sich nicht.",
			portraitPlaceholder: "Hier könnte ein Schwarz-Weiß-Portrait von Julian stehen — schräg sitzend am Schreibtisch, leicht zur Kamera gewandt, naturnahes Licht.",
			stat1Value: "5+",
			stat1Label: "Jahre Erfahrung",
			stat2Value: "5",
			stat2Label: "Leistungsbereiche",
			stat3Value: "1:1",
			stat3Label: "Persönliche Betreuung"
		},
		services: {
			label: "— 02 / Leistungen",
			headline: "Was ich für Sie",
			headlineAccent: "leiste.",
			items: [
				{
					number: "01",
					title: "Digitalisierung für Unternehmen",
					description: "Listen von Hand, Zahlen aus drei Quellen, immer wieder abtippen. Ich nehme mir einen konkreten Ablauf vor und mache ihn einfacher – nicht gleich den ganzen Betrieb.",
					tags: [
						"Abläufe",
						"Auswertungen",
						"Automatisierung",
						"Schnittstellen"
					]
				},
				{
					number: "02",
					title: "Digitale Konzepte",
					description: "Sie haben eine Idee, aber noch keinen Plan. Ich mache daraus ein verständliches Konzept: was gebraucht wird, welcher Weg sinnvoll ist, was er kostet.",
					tags: [
						"Anforderungen",
						"Klickbarer Entwurf",
						"Aufwand",
						"Fahrplan"
					]
				},
				{
					number: "03",
					title: "Auftragsentwicklung",
					description: "Nicht jede Aufgabe braucht ein großes Programm. Oft reicht das Werkzeug, das zu Ihrer Arbeit passt: eine Excel-Vorlage, eine kleine Anwendung, eine Auswertung.",
					tags: [
						"Excel-Vorlage",
						"Kleine Anwendung",
						"Auswertung",
						"Datenübernahme"
					]
				},
				{
					number: "04",
					title: "Webauftritt",
					description: "Veraltet, unklar oder noch gar nicht da? Dann springen Interessenten ab, bevor sie anfragen. Ich baue neu, bringe Bestehendes auf Stand – und pflege es weiter.",
					tags: [
						"Neue Website",
						"Überarbeitung",
						"Pflege",
						"Auffindbarkeit"
					]
				},
				{
					number: "05",
					title: "Webshop",
					description: "Ihr Laden läuft, jetzt soll es online weitergehen. Ich plane, baue und betreue den Shop – auf Wunsch so, dass Artikel und Bestand vom Handy aus laufen.",
					tags: [
						"Onlineverkauf",
						"Produktpflege",
						"Bestand per Handy",
						"Betreuung"
					]
				}
			]
		},
		tech: {
			label: "Tech Stack",
			headline: "Womit ich",
			headlineAccent: "arbeite.",
			body: "Werkzeuge, die sich bewährt haben – keine Glaubensfrage, sondern das Richtige fürs Problem. Sprachen wechseln, gute Architektur bleibt."
		},
		portfolio: {
			label: "— 03 / Portfolio",
			headline: "Ausgewählte",
			headlineAccent: "Projekte.",
			comingSoon: "Demnächst",
			placeholderLabel: "Platzhalter",
			items: [
				{
					number: "01",
					badge: "Web-App",
					title: "Mittelstands-Plattform",
					description: "Eine maßgeschneiderte Webanwendung für einen mittelständischen Kunden – individuell entwickelt, skalierbar gebaut.",
					stack: [
						"Angular",
						"Node.js",
						"SQL"
					],
					imagePlaceholder: "Screenshot des Dashboards mit zentraler KPI-Übersicht, links Sidebar-Navigation, rechts ein Detailpanel."
				},
				{
					number: "02",
					badge: "Digitalisierung",
					title: "Prozess-Automatisierung",
					description: "Automatisierung manueller Geschäftsprozesse durch intelligente Workflows und Datenpipelines.",
					stack: [
						"Python",
						"KNIME",
						"SQL"
					],
					imagePlaceholder: "Workflow-Diagramm: KNIME-Knoten, die Daten aus drei Quellen zusammenführen, validieren und in eine SQL-Tabelle schreiben."
				},
				{
					number: "03",
					badge: "Web-Auftritt",
					title: "Markenpräsenz Mittelstand",
					description: "Professioneller Webauftritt für ein etabliertes Unternehmen – performant, barrierefrei, individuell.",
					stack: ["WordPress", "TypeScript"],
					imagePlaceholder: "Hero-Mockup der Kunden-Website auf Desktop und Mobile – ruhige Typografie, großes Schlüsselbild."
				},
				{
					number: "04",
					badge: "App",
					title: "Interne Business-App",
					description: "Desktop-Applikation zur internen Prozessverwaltung – intuitiv bedienbar, wartungsfreundlich dokumentiert.",
					stack: [
						"C#",
						"SQL",
						"Vue"
					],
					imagePlaceholder: "Screenshot der Desktop-App: Listenansicht der Aufträge mit Filterleiste oben und Detail-Panel rechts."
				}
			]
		},
		process: {
			label: "— 04 / Vorgehen",
			headline: "Wie ich",
			headlineAccent: "arbeite.",
			body: "Kein starrer Ablauf. Je nach Vorhaben verschiebt sich das Gewicht. Die vier Schritte sind der übliche Rahmen, kein Korsett.",
			steps: [
				{
					number: "01",
					title: "Zuhören",
					duration: "Zum Einstieg",
					description: "Sie schildern mir, wo es hakt. Ich frage nach – und sage ehrlich, ob sich eine Umsetzung lohnt."
				},
				{
					number: "02",
					title: "Konzept",
					duration: "Je nach Umfang",
					description: "Was wird gebraucht, welcher Weg ist sinnvoll, was kostet er? Die Grundlage steht, bevor Budget fließt."
				},
				{
					number: "03",
					title: "Umsetzung",
					duration: "Nach Absprache",
					description: "Ich baue es und zeige Ihnen Zwischenstände. Nachsteuern ist unterwegs günstig, hinterher teuer."
				},
				{
					number: "04",
					title: "Betreuung",
					duration: "Auf Wunsch",
					description: "Übergabe, Einweisung, auf Wunsch Pflege und Anpassungen. Ansprechpartner bleibe ich in jedem Fall."
				}
			]
		},
		blog: {
			label: "— 05 / Journal",
			headline: "Gedanken &",
			headlineAccent: "Artikel.",
			readMore: "Weiterlesen",
			allPosts: "Alle Artikel",
			placeholderLabel: "Platzhalter",
			posts: [
				{
					category: "Digitalisierung",
					title: "Digitalisierung fängt nicht beim Großprojekt an.",
					excerpt: "Sie fängt bei dem einen Ablauf an, der Sie jede Woche Stunden kostet – und den außer Ihnen niemand sieht.",
					date: "2026-08-04",
					slug: "digitalisierung-faengt-klein-an",
					imagePlaceholder: "Handgeschriebene Liste auf einem Klemmbrett neben einem Laptop – warmes Morgenlicht, Werkstatt im Hintergrund."
				},
				{
					category: "Webshop",
					title: "Lohnt sich ein Webshop für mein Ladengeschäft?",
					excerpt: "Nicht für jedes Sortiment. Vier Fragen, die die Antwort meist schon vorwegnehmen.",
					date: "2026-07-21",
					slug: "lohnt-sich-ein-webshop",
					imagePlaceholder: "Ladentheke von oben – Produkte, ein Notizblock und ein Smartphone mit offener Produktliste."
				},
				{
					category: "Werkzeuge",
					title: "Excel-Tabelle oder eigenes Werkzeug?",
					excerpt: "Eine Tabelle ist erstaunlich weit tragfähig. Es gibt aber drei Punkte, an denen sie zuverlässig kippt.",
					date: "2026-07-07",
					slug: "excel-oder-eigenes-werkzeug",
					imagePlaceholder: "Bildschirm mit einer weit gescrollten Tabelle, daneben ein Notizzettel mit Formelfragment."
				}
			]
		},
		contact: {
			label: "— 06 / Kontakt",
			headline: "Lassen Sie uns",
			headlineAccent: "reden.",
			sub: "Schreiben Sie mir in zwei Sätzen, wo es hakt. Ich antworte in der Regel innerhalb von 24 Stunden.",
			form: {
				name: "Name",
				namePlaceholder: "Hanna Schmidt",
				email: "E-Mail",
				emailPlaceholder: "hanna@manufaktur.de",
				company: "Unternehmen (optional)",
				companyPlaceholder: "Schmidt Manufaktur",
				message: "Nachricht",
				messagePlaceholder: "Wir pflegen unsere Preise noch in drei Listen gleichzeitig — das kostet jede Woche einen halben Tag.",
				consent: "Ich willige in die Verarbeitung meiner Daten gemäß der",
				consentLink: "Datenschutzerklärung",
				consentSuffix: "ein.",
				submit: "Nachricht senden",
				submitting: "Wird gesendet …",
				successTitle: "Nachricht erhalten!",
				successMessage: "Danke für Ihre Nachricht. Ich melde mich in der Regel innerhalb von 24 Stunden.",
				errorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es noch einmal."
			},
			info: {
				emailLabel: "E-Mail",
				phoneLabel: "Handy",
				locationLabel: "Standort",
				socialLabel: "Social",
				email: "kontakt@tracht-digital.de",
				phone: "+49 178 822 4022",
				location: "Schwarzenbek · nähe Hamburg"
			}
		},
		pricing: {
			label: "— Preise",
			headline: "Transparente",
			headlineAccent: "Stundensätze.",
			sub: "Klare Preise, keine Pauschalpakete. Stundengenau abgerechnet, ehrlich geschätzt, mit einer Obergrenze, auf die Sie sich verlassen können.",
			teaserLabel: "Preise",
			teaserHeadline: "Klare Sätze,",
			teaserHeadlineAccent: "keine Pauschalen.",
			teaserSub: "Ab 95 € pro Stunde – stundengenau abgerechnet, ohne versteckte Kosten.",
			teaserCta: "Alle Stundensätze ansehen",
			teaserFromLabel: "ab",
			hourSuffix: "/ Stunde",
			includesLabel: "Beinhaltet:",
			items: [
				{
					title: "Beratung & Konzeption",
					rate: 120,
					description: "Strategische Begleitung, Architektur-Workshops, technische Reviews. Am Ende steht ein verständliches Konzept – nicht nur Folien.",
					includes: [
						"Aufnahme und Sortierung Ihrer Anforderungen",
						"Architektur- & Anforderungs-Workshops",
						"Code- & Stack-Reviews mit dokumentierten Empfehlungen",
						"Schriftliche Konzepte und Entscheidungsgrundlagen"
					],
					highlight: false
				},
				{
					title: "Web- & App-Entwicklung",
					rate: 105,
					description: "Frontend, Backend, mobile und Desktop-Apps. Sauber gebaut, getestet, dokumentiert – auch in zwei Jahren noch wartbar.",
					includes: [
						"Komponentenentwicklung (React, Vue, Angular)",
						"API- und Backend-Entwicklung (Node.js, C#, SQL)",
						"Mobile- und Desktop-Apps",
						"Tests, CI/CD und Dokumentation inklusive"
					],
					highlight: true
				},
				{
					title: "Digitalisierung & Automation",
					rate: 105,
					description: "Manuelle Abläufe durch Workflows, Datenpipelines und Integrationen ablösen. Konkrete Umsetzung, kein PowerPoint.",
					includes: [
						"Prozessanalyse vor Ort oder remote",
						"Workflow-Automation (Python, KNIME, n8n)",
						"Datenpipelines, ETL und SQL-Reporting",
						"Integration bestehender Tools und Systeme"
					],
					highlight: false
				},
				{
					title: "Wartung & Support",
					rate: 85,
					description: "Bestehende Systeme pflegen, Updates einspielen, Fehler beheben. Reaktionszeit nach Vereinbarung.",
					includes: [
						"Bug-Fixes und Hotfixes",
						"Dependency- und Sicherheits-Updates",
						"Monitoring und Performance-Optimierung",
						"Auf Wunsch monatliches Retainer-Modell"
					],
					highlight: false
				},
				{
					title: "Workshops & Schulungen",
					rate: 135,
					description: "Wissen weitergeben statt zurückhalten. Workshops für Ihr Team – von TypeScript-Basics bis Architektur.",
					includes: [
						"Inhouse- oder Remote-Workshops",
						"Maßgeschneiderte Schulungsunterlagen",
						"Hands-on-Übungen mit Ihrem echten Code",
						"Nachgespräch und Aufzeichnung inklusive"
					],
					highlight: false
				}
			],
			notesTitle: "Gut zu wissen",
			notes: [
				"Alle Preise zzgl. gesetzlicher Mehrwertsteuer (19 %).",
				"Tagessatz auf Anfrage – Rabatt ab 5 Tagen pro Monat verfügbar.",
				"Festpreis möglich, wenn der Umfang vorab klar ist.",
				"Reisekosten werden separat abgerechnet."
			],
			ctaTitle: "Klingt passend?",
			ctaSub: "Schreiben Sie mir kurz, worum es geht. Ich sage Ihnen ehrlich, ob und wie ich helfen kann.",
			ctaButton: "Unverbindlich anfragen",
			back: "Zurück"
		},
		consulting: {
			label: "— Beratung",
			headline: "Erst zuhören,",
			headlineAccent: "dann bauen.",
			body: "Vielleicht haben Sie ein klares Vorhaben, vielleicht nur das Gefühl, dass etwas einfacher laufen müsste. Beides ist ein guter Anfang.",
			primaryCta: "Unverbindlich anfragen",
			secondaryCta: "Leistungen ansehen"
		},
		footer: {
			slogan: "Digitale Lösungen, die wirklich passen.",
			tagline: "Persönlich, passgenau, aus einer Hand — aus Schwarzenbek bei Hamburg.",
			nav: "Navigation",
			contactTitle: "Kontakt",
			copyright: "© 2026 Tracht Digital Solutions. Alle Rechte vorbehalten.",
			impressum: "Impressum",
			datenschutz: "Datenschutz",
			pricing: "Preise"
		},
		errors: {
			name: "Bitte geben Sie Ihren Namen an.",
			email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
			message: "Mindestens 20 Zeichen, bitte.",
			consent: "Zustimmung erforderlich."
		},
		cookieNotice: {
			label: "Hinweis zu Cookies und Datenschutz",
			siteText: "Diese Website verwendet keine Tracking-Cookies. Es werden lediglich technisch notwendige Einstellungen (z. B. Ihr Farbschema) lokal in Ihrem Browser gespeichert.",
			panelText: "Dieser Bereich verwendet ausschließlich ein technisch notwendiges Cookie für die sichere Anmeldung (Session-Cookie). Es findet kein Tracking statt.",
			privacy: "Mehr in der Datenschutzerklärung.",
			accept: "Verstanden",
			consentText: "Wir zeigen auf diesem Blog Werbung von Google AdSense. Dafür werden – nur mit Ihrer Einwilligung – Cookies und ähnliche Technologien zu Werbezwecken gesetzt. Ihre Wahl ist freiwillig und jederzeit änderbar.",
			consentAccept: "Akzeptieren",
			consentDecline: "Ablehnen"
		},
		toast: { dismiss: "Schließen" }
	},
	en: {
		nav: {
			about: "About",
			services: "Services",
			tech: "Tech",
			portfolio: "Portfolio",
			process: "Process",
			blog: "Journal",
			contact: "Contact",
			cta: "Get in touch",
			pricing: "Pricing"
		},
		hero: {
			availability: "Available for projects · Q3 2026",
			location: "Schwarzenbek · Hamburg",
			headline: "Digitalization that takes",
			headlineAccent: "work",
			headlineSuffix: "off your hands.",
			sub: "Websites, online shops and tools for small businesses. I look at where things stick – and build what helps. From Schwarzenbek near Hamburg.",
			cta1: "Get in touch",
			cta2: "See services",
			scrollHint: "Scroll"
		},
		about: {
			label: "— 01 / About",
			headline: "Hi, I'm",
			headlineAccent: "Julian.",
			lead: "I'm a freelance developer in Schwarzenbek near Hamburg. I work with freelancers and small businesses that have no IT department.",
			p1: "Website, online shop, a small program or a workflow that should get simpler: I listen, sort out the plan and build it. One contact, start to finish.",
			p2: "Off-the-shelf software makes you adapt to it. A good tool works the other way round. Sometimes the honest answer is: it isn't worth it.",
			portraitPlaceholder: "A black-and-white portrait of Julian — seated at an angle at his desk, slightly turned toward the camera, soft natural light.",
			stat1Value: "5+",
			stat1Label: "Years of experience",
			stat2Value: "5",
			stat2Label: "Areas of work",
			stat3Value: "1:1",
			stat3Label: "Personal support"
		},
		services: {
			label: "— 02 / Services",
			headline: "What I",
			headlineAccent: "deliver.",
			items: [
				{
					number: "01",
					title: "Digitalization for Businesses",
					description: "Lists kept by hand, figures from three places, the same retyping every day. I take one concrete workflow and make it simpler – not the whole business at once.",
					tags: [
						"Workflows",
						"Reporting",
						"Automation",
						"Integrations"
					]
				},
				{
					number: "02",
					title: "Digital Concepts",
					description: "You have an idea but no plan yet. I turn it into a concept you can read: what is needed, which route makes sense, what it costs.",
					tags: [
						"Requirements",
						"Clickable draft",
						"Effort",
						"Roadmap"
					]
				},
				{
					number: "03",
					title: "Custom Development",
					description: "Not every task needs a big program. Often it just needs the tool that fits your work: a spreadsheet template, a small application, a report.",
					tags: [
						"Spreadsheet template",
						"Small application",
						"Reporting",
						"Data import"
					]
				},
				{
					number: "04",
					title: "Web Presence",
					description: "Out of date, unclear or not there at all? Then people leave before they get in touch. I build new, bring existing sites up to standard – and maintain them.",
					tags: [
						"New website",
						"Rework",
						"Maintenance",
						"Findability"
					]
				},
				{
					number: "05",
					title: "Online Shop",
					description: "Your shop runs locally, now it should run online too. I plan, build and look after it – set up so items and stock can be managed from a phone.",
					tags: [
						"Online sales",
						"Product upkeep",
						"Stock by phone",
						"Support"
					]
				}
			]
		},
		tech: {
			label: "Tech Stack",
			headline: "What I",
			headlineAccent: "work with.",
			body: "Tools that have proven themselves – not a matter of faith, just the right thing for the problem. Languages change; good architecture stays."
		},
		portfolio: {
			label: "— 03 / Portfolio",
			headline: "Selected",
			headlineAccent: "projects.",
			comingSoon: "Coming soon",
			placeholderLabel: "Placeholder",
			items: [
				{
					number: "01",
					badge: "Web App",
					title: "Mid-market platform",
					description: "A custom-built web application for a mid-market client – individually developed, built to scale.",
					stack: [
						"Angular",
						"Node.js",
						"SQL"
					],
					imagePlaceholder: "Dashboard screenshot with central KPI overview, sidebar navigation on the left, detail panel on the right."
				},
				{
					number: "02",
					badge: "Digitalization",
					title: "Process automation",
					description: "Automation of manual business processes through intelligent workflows and data pipelines.",
					stack: [
						"Python",
						"KNIME",
						"SQL"
					],
					imagePlaceholder: "Workflow diagram: KNIME nodes pulling data from three sources, validating it, writing into a SQL table."
				},
				{
					number: "03",
					badge: "Web presence",
					title: "Brand presence",
					description: "Professional web presence for an established company – performant, accessible, individually crafted.",
					stack: ["WordPress", "TypeScript"],
					imagePlaceholder: "Hero mockup of the client site on desktop and mobile — quiet typography, large keystone image."
				},
				{
					number: "04",
					badge: "App",
					title: "Internal business app",
					description: "Desktop application for internal process management – intuitively usable, cleanly documented.",
					stack: [
						"C#",
						"SQL",
						"Vue"
					],
					imagePlaceholder: "Desktop app screenshot: list view of orders with filter bar at the top and detail panel on the right."
				}
			]
		},
		process: {
			label: "— 04 / Process",
			headline: "How I",
			headlineAccent: "work.",
			body: "No rigid process. The weight shifts with the job. The four steps below are the usual frame, not a corset.",
			steps: [
				{
					number: "01",
					title: "Listening",
					duration: "To begin with",
					description: "You tell me where things get stuck. I keep asking – and say honestly whether building something is worth it."
				},
				{
					number: "02",
					title: "Concept",
					duration: "Depends on scope",
					description: "What is needed, which route makes sense, what does it cost? The groundwork is there before any budget moves."
				},
				{
					number: "03",
					title: "Delivery",
					duration: "As agreed",
					description: "I build it and show you where it stands. Changing course is cheap along the way and expensive afterwards."
				},
				{
					number: "04",
					title: "Support",
					duration: "If you want it",
					description: "Handover, a walkthrough, and maintenance if you want it. Either way I stay your point of contact."
				}
			]
		},
		blog: {
			label: "— 05 / Journal",
			headline: "Thoughts &",
			headlineAccent: "articles.",
			readMore: "Read more",
			allPosts: "All articles",
			placeholderLabel: "Placeholder",
			posts: [
				{
					category: "Digitalization",
					title: "Digitalization doesn't start with a big project.",
					excerpt: "It starts with the one routine that costs you hours every week – the one nobody but you can see.",
					date: "2026-08-04",
					slug: "digitalisierung-faengt-klein-an",
					imagePlaceholder: "A handwritten list on a clipboard beside a laptop — warm morning light, workshop in the background."
				},
				{
					category: "Online shop",
					title: "Is an online shop worth it for my local business?",
					excerpt: "Not for every range of products. Four questions that usually answer it for you.",
					date: "2026-07-21",
					slug: "lohnt-sich-ein-webshop",
					imagePlaceholder: "A shop counter from above — products, a notepad and a phone showing an open product list."
				},
				{
					category: "Tools",
					title: "Spreadsheet or a tool of your own?",
					excerpt: "A spreadsheet carries you surprisingly far. There are three points, though, where it reliably tips over.",
					date: "2026-07-07",
					slug: "excel-oder-eigenes-werkzeug",
					imagePlaceholder: "A screen showing a spreadsheet scrolled far down, next to a sticky note with a fragment of a formula."
				}
			]
		},
		contact: {
			label: "— 06 / Contact",
			headline: "Let's",
			headlineAccent: "talk.",
			sub: "Tell me in two sentences where things are getting stuck. I usually respond within 24 hours.",
			form: {
				name: "Name",
				namePlaceholder: "Alex Marlow",
				email: "Email",
				emailPlaceholder: "alex@marlow.studio",
				company: "Company (optional)",
				companyPlaceholder: "Marlow Studios",
				message: "Message",
				messagePlaceholder: "We still keep our prices in three separate lists — it costs us half a day every week.",
				consent: "I consent to the processing of my data in accordance with the",
				consentLink: "Privacy Policy",
				consentSuffix: ".",
				submit: "Send message",
				submitting: "Sending …",
				successTitle: "Message received!",
				successMessage: "Thank you for your message. I'll get back to you within 24 hours.",
				errorMessage: "Something went wrong. Please try again."
			},
			info: {
				emailLabel: "Email",
				phoneLabel: "Mobile",
				locationLabel: "Location",
				socialLabel: "Social",
				email: "contact@tracht-digital.de",
				phone: "+49 178 822 4022",
				location: "Schwarzenbek · near Hamburg"
			}
		},
		pricing: {
			label: "— Pricing",
			headline: "Transparent",
			headlineAccent: "hourly rates.",
			sub: "Clear pricing, no opaque packages. Billed by the actual hour, honestly estimated, with a ceiling you can rely on.",
			teaserLabel: "Pricing",
			teaserHeadline: "Clear rates,",
			teaserHeadlineAccent: "no packages.",
			teaserSub: "From €95 per hour – billed by the actual hour, no hidden fees.",
			teaserCta: "See all hourly rates",
			teaserFromLabel: "from",
			hourSuffix: "/ hour",
			includesLabel: "Included:",
			items: [
				{
					title: "Consulting & Strategy",
					rate: 120,
					description: "Strategic guidance, architecture workshops, technical reviews. You end up with a clear written concept — not just slides.",
					includes: [
						"Capturing and sorting your requirements",
						"Architecture and requirements workshops",
						"Code and stack reviews with documented recommendations",
						"Written concepts and decision-making input"
					],
					highlight: false
				},
				{
					title: "Web & App Development",
					rate: 105,
					description: "Frontend, backend, mobile and desktop apps. Cleanly built, tested, documented – still maintainable in two years.",
					includes: [
						"Component development (React, Vue, Angular)",
						"API and backend development (Node.js, C#, SQL)",
						"Mobile and desktop apps",
						"Tests, CI/CD and documentation included"
					],
					highlight: true
				},
				{
					title: "Digitalization & Automation",
					rate: 105,
					description: "Replacing manual processes with workflows, data pipelines and integrations. Concrete work, no PowerPoint.",
					includes: [
						"On-site or remote process analysis",
						"Workflow automation (Python, KNIME, n8n)",
						"Data pipelines, ETL and SQL reporting",
						"Integration of existing tools and systems"
					],
					highlight: false
				},
				{
					title: "Maintenance & Support",
					rate: 85,
					description: "Maintaining existing systems, rolling out updates, fixing bugs. Response times by agreement.",
					includes: [
						"Bug fixes and hotfixes",
						"Dependency and security updates",
						"Monitoring and performance optimization",
						"Optional monthly retainer model"
					],
					highlight: false
				},
				{
					title: "Workshops & Training",
					rate: 135,
					description: "Sharing knowledge instead of hoarding it. Workshops for your team – from TypeScript basics to architecture.",
					includes: [
						"On-site or remote workshops",
						"Tailored training materials",
						"Hands-on exercises with your real code",
						"Follow-up call and recording included"
					],
					highlight: false
				}
			],
			notesTitle: "Good to know",
			notes: [
				"All prices exclude German VAT (19 %).",
				"Day rate available on request — discount for 5+ days per month.",
				"Fixed price possible when the scope is clear up front.",
				"Travel costs are billed separately."
			],
			ctaTitle: "Sounds like a fit?",
			ctaSub: "Tell me briefly what it's about. I'll tell you honestly whether and how I can help.",
			ctaButton: "Get in touch",
			back: "Back"
		},
		consulting: {
			label: "— Consulting",
			headline: "Listen first,",
			headlineAccent: "build after.",
			body: "Maybe you have a clear plan, maybe just a feeling that something ought to be simpler. Either is a good place to start.",
			primaryCta: "Get in touch",
			secondaryCta: "See services"
		},
		footer: {
			slogan: "Digital solutions that truly fit.",
			tagline: "Personal, tailored, all from one source — from Schwarzenbek near Hamburg.",
			nav: "Navigation",
			contactTitle: "Contact",
			copyright: "© 2026 Tracht Digital Solutions. All rights reserved.",
			impressum: "Legal Notice",
			datenschutz: "Privacy Policy",
			pricing: "Pricing"
		},
		errors: {
			name: "Please enter your name.",
			email: "Please enter a valid email address.",
			message: "At least 20 characters, please.",
			consent: "Consent required."
		},
		cookieNotice: {
			label: "Cookie and privacy notice",
			siteText: "This website does not use tracking cookies. Only technically necessary preferences (e.g. your colour scheme) are stored locally in your browser.",
			panelText: "This area only uses one technically necessary cookie for secure sign-in (session cookie). No tracking takes place.",
			privacy: "More in the privacy policy.",
			accept: "Got it",
			consentText: "This blog shows advertising from Google AdSense. With your consent — and only then — cookies and similar technologies are set for advertising. Your choice is free and can be changed at any time.",
			consentAccept: "Accept",
			consentDecline: "Decline"
		},
		toast: { dismiss: "Dismiss" }
	}
};
//#endregion
//#region src/lib/i18n.ts
function resolveLang(currentLocale) {
	return currentLocale === "en" ? "en" : "de";
}
function tFor(currentLocale) {
	return translations$1[resolveLang(currentLocale)];
}
/** Prefix a site-internal path with the EN locale segment when needed. */
function localizePath(path, lang) {
	if (lang === "de") return path;
	if (path.startsWith("/en/") || path === "/en") return path;
	if (path === "/") return "/en/";
	return `/en${path.startsWith("/") ? "" : "/"}${path}`;
}
//#endregion
//#region src/components/FloatingCta.astro
createAstro("https://tracht-digital.de");
var $$FloatingCta = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FloatingCta;
	const lang = resolveLang(Astro.currentLocale);
	const home = localizePath("/", lang);
	const href = `${home === "/" ? "" : home.replace(/\/$/, "")}/#contact`;
	const label = lang === "de" ? "Erstgespräch vereinbaren" : "Arrange an initial consultation";
	const topLabel = lang === "en" ? "Back to top" : "Nach oben";
	return renderTemplate`${maybeRenderHead($$result)}<div class="floating-cta-group" data-scrolled-down="false" data-near="false" data-on-dark="false" data-astro-cid-72f5watn><button type="button" class="floating-cta-top"${addAttribute(topLabel, "aria-label")} data-astro-cid-72f5watn><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="floating-cta-top__icon" data-astro-cid-72f5watn><line x1="12" y1="19" x2="12" y2="5" data-astro-cid-72f5watn></line><polyline points="5 12 12 5 19 12" data-astro-cid-72f5watn></polyline></svg></button><a${addAttribute(href, "href")} class="floating-cta"${addAttribute(label, "aria-label")} data-astro-cid-72f5watn><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="floating-cta__icon" data-astro-cid-72f5watn><rect x="3" y="4" width="18" height="18" rx="2" data-astro-cid-72f5watn></rect><line x1="16" y1="2" x2="16" y2="6" data-astro-cid-72f5watn></line><line x1="8" y1="2" x2="8" y2="6" data-astro-cid-72f5watn></line><line x1="3" y1="10" x2="21" y2="10" data-astro-cid-72f5watn></line></svg><span class="floating-cta__label" data-astro-cid-72f5watn>${label}</span><span aria-hidden="true" class="floating-cta__arrow" data-astro-cid-72f5watn>→</span></a></div>${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/FloatingCta.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/FloatingCta.astro", void 0);
//#endregion
//#region src/components/JsonLd.astro
createAstro("https://tracht-digital.de");
var $$JsonLd = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$JsonLd;
	const { data } = Astro.props;
	return renderTemplate`${(Array.isArray(data) ? data : [data]).map((graph) => renderTemplate`<script type="application/ld+json">${unescapeHTML(JSON.stringify(graph))}<\/script>`)}`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/components/JsonLd.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/components/index.js
var SEMANTIC_CHIP_VARIANTS$1 = [
	"neutral",
	"success",
	"warning",
	"danger",
	"info"
];
var CATEGORICAL_CHIP_VARIANTS$1 = [
	"cat-violet",
	"cat-teal",
	"cat-amber",
	"cat-rose",
	"cat-cyan"
];
var CHIP_VARIANTS$1 = [...SEMANTIC_CHIP_VARIANTS$1, ...CATEGORICAL_CHIP_VARIANTS$1];
new Set(CHIP_VARIANTS$1);
var THEME_STORAGE_KEY$1 = "tds-theme";
var THEME_ATTRIBUTE$1 = "data-theme";
var THEME_CHANGE_EVENT = "tds:theme-change";
var DARK_QUERY = "(prefers-color-scheme: dark)";
var hasDocument = () => typeof document !== "undefined";
function systemTheme() {
	try {
		return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function resolveTheme(preference) {
	return preference === "system" ? systemTheme() : preference;
}
function applyThemePreference(preference, options = {}) {
	const theme = resolveTheme(preference);
	try {
		if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY$1);
		else localStorage.setItem(THEME_STORAGE_KEY$1, preference);
	} catch {}
	if (hasDocument()) document.documentElement.setAttribute(THEME_ATTRIBUTE$1, theme);
	if (options.announce !== false && typeof window !== "undefined") try {
		const detail = {
			preference,
			theme
		};
		window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail }));
	} catch {}
	return theme;
}
var cssEase = {
	out: `cubic-bezier(${[
		.2,
		.8,
		.2,
		1
	].join(", ")})`,
	inOut: `cubic-bezier(${[
		.4,
		0,
		.2,
		1
	].join(", ")})`
};
function ThemeToggle({ labelToDark = "Auf Dunkel umschalten", labelToLight = "Auf Hell umschalten" } = {}) {
	const [theme, setTheme] = useState("light");
	const [mounted, setMounted] = useState(false);
	const buttonRef = useRef(null);
	useEffect(() => {
		const current = document.documentElement.getAttribute(THEME_ATTRIBUTE$1);
		setTheme(current === "dark" ? "dark" : "light");
		setMounted(true);
	}, []);
	const flip = () => {
		const next = theme === "dark" ? "light" : "dark";
		const apply = () => {
			setTheme(next);
			applyThemePreference(next);
		};
		const startViewTransition = document.startViewTransition;
		const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!startViewTransition || prefersReduced) {
			apply();
			return;
		}
		if (window.matchMedia("(pointer: coarse)").matches) {
			startViewTransition.call(document, () => {
				flushSync(apply);
			}).ready.then(() => {
				document.documentElement.animate({
					opacity: [0, 1],
					transform: ["scale(1.02)", "scale(1)"]
				}, {
					duration: 320,
					easing: cssEase.out,
					pseudoElement: "::view-transition-new(root)"
				});
			});
			return;
		}
		const rect = buttonRef.current?.getBoundingClientRect();
		const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
		const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
		const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
		startViewTransition.call(document, () => {
			flushSync(apply);
		}).ready.then(() => {
			document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] }, {
				duration: 480,
				easing: cssEase.inOut,
				pseudoElement: "::view-transition-new(root)"
			});
		});
	};
	const label = mounted && theme === "dark" ? labelToLight : labelToDark;
	return /* @__PURE__ */ jsxs("button", {
		ref: buttonRef,
		type: "button",
		onClick: flip,
		"aria-label": label,
		title: label,
		className: "tds-theme-toggle inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer",
		children: [/* @__PURE__ */ jsx("svg", {
			"aria-hidden": "true",
			width: "18",
			height: "18",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: mounted && theme === "dark" ? "hidden" : "block",
			children: /* @__PURE__ */ jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
		}), /* @__PURE__ */ jsxs("svg", {
			"aria-hidden": "true",
			width: "18",
			height: "18",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: mounted && theme === "dark" ? "block" : "hidden",
			children: [
				/* @__PURE__ */ jsx("circle", {
					cx: "12",
					cy: "12",
					r: "4"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "12",
					y1: "2",
					x2: "12",
					y2: "5"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "12",
					y1: "19",
					x2: "12",
					y2: "22"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "2",
					y1: "12",
					x2: "5",
					y2: "12"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "19",
					y1: "12",
					x2: "22",
					y2: "12"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "4.93",
					y1: "4.93",
					x2: "6.99",
					y2: "6.99"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "17.01",
					y1: "17.01",
					x2: "19.07",
					y2: "19.07"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "4.93",
					y1: "19.07",
					x2: "6.99",
					y2: "17.01"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "17.01",
					y1: "6.99",
					x2: "19.07",
					y2: "4.93"
				})
			]
		})]
	});
}
var translations = {
	de: {
		nav: {
			about: "Über mich",
			services: "Leistungen",
			tech: "Tech",
			portfolio: "Portfolio",
			process: "Prozess",
			blog: "Journal",
			contact: "Kontakt",
			cta: "Unverbindlich anfragen",
			pricing: "Preise"
		},
		hero: {
			availability: "Verfügbar für Projekte · Q3 2026",
			location: "Schwarzenbek · Hamburg",
			headline: "Digitalisierung, die",
			headlineAccent: "Arbeit",
			headlineSuffix: "abnimmt.",
			sub: "Websites, Webshops und Werkzeuge für kleine Betriebe. Ich schaue, wo es hakt – und baue, was hilft. Aus Schwarzenbek bei Hamburg.",
			cta1: "Unverbindlich anfragen",
			cta2: "Leistungen ansehen",
			scrollHint: "Scrollen"
		},
		about: {
			label: "— 01 / Über mich",
			headline: "Hi, ich bin",
			headlineAccent: "Julian.",
			lead: "Ich bin freier Entwickler in Schwarzenbek bei Hamburg. Ich arbeite für Selbstständige und kleine Betriebe ohne eigene IT.",
			p1: "Website, Webshop, kleines Programm oder ein Ablauf, der einfacher werden soll: Ich höre zu, sortiere das Vorhaben und setze es um. Ein Ansprechpartner, von Anfang bis Ende.",
			p2: "Standardsoftware zwingt Sie, sich anzupassen. Ein gutes Werkzeug macht es andersherum. Manchmal ist die ehrliche Antwort: Es lohnt sich nicht.",
			portraitPlaceholder: "Hier könnte ein Schwarz-Weiß-Portrait von Julian stehen — schräg sitzend am Schreibtisch, leicht zur Kamera gewandt, naturnahes Licht.",
			stat1Value: "5+",
			stat1Label: "Jahre Erfahrung",
			stat2Value: "5",
			stat2Label: "Leistungsbereiche",
			stat3Value: "1:1",
			stat3Label: "Persönliche Betreuung"
		},
		services: {
			label: "— 02 / Leistungen",
			headline: "Was ich für Sie",
			headlineAccent: "leiste.",
			items: [
				{
					number: "01",
					title: "Digitalisierung für Unternehmen",
					description: "Listen von Hand, Zahlen aus drei Quellen, immer wieder abtippen. Ich nehme mir einen konkreten Ablauf vor und mache ihn einfacher – nicht gleich den ganzen Betrieb.",
					tags: [
						"Abläufe",
						"Auswertungen",
						"Automatisierung",
						"Schnittstellen"
					]
				},
				{
					number: "02",
					title: "Digitale Konzepte",
					description: "Sie haben eine Idee, aber noch keinen Plan. Ich mache daraus ein verständliches Konzept: was gebraucht wird, welcher Weg sinnvoll ist, was er kostet.",
					tags: [
						"Anforderungen",
						"Klickbarer Entwurf",
						"Aufwand",
						"Fahrplan"
					]
				},
				{
					number: "03",
					title: "Auftragsentwicklung",
					description: "Nicht jede Aufgabe braucht ein großes Programm. Oft reicht das Werkzeug, das zu Ihrer Arbeit passt: eine Excel-Vorlage, eine kleine Anwendung, eine Auswertung.",
					tags: [
						"Excel-Vorlage",
						"Kleine Anwendung",
						"Auswertung",
						"Datenübernahme"
					]
				},
				{
					number: "04",
					title: "Webauftritt",
					description: "Veraltet, unklar oder noch gar nicht da? Dann springen Interessenten ab, bevor sie anfragen. Ich baue neu, bringe Bestehendes auf Stand – und pflege es weiter.",
					tags: [
						"Neue Website",
						"Überarbeitung",
						"Pflege",
						"Auffindbarkeit"
					]
				},
				{
					number: "05",
					title: "Webshop",
					description: "Ihr Laden läuft, jetzt soll es online weitergehen. Ich plane, baue und betreue den Shop – auf Wunsch so, dass Artikel und Bestand vom Handy aus laufen.",
					tags: [
						"Onlineverkauf",
						"Produktpflege",
						"Bestand per Handy",
						"Betreuung"
					]
				}
			]
		},
		tech: {
			label: "Tech Stack",
			headline: "Womit ich",
			headlineAccent: "arbeite.",
			body: "Werkzeuge, die sich bewährt haben – keine Glaubensfrage, sondern das Richtige fürs Problem. Sprachen wechseln, gute Architektur bleibt."
		},
		portfolio: {
			label: "— 03 / Portfolio",
			headline: "Ausgewählte",
			headlineAccent: "Projekte.",
			comingSoon: "Demnächst",
			placeholderLabel: "Platzhalter",
			items: [
				{
					number: "01",
					badge: "Web-App",
					title: "Mittelstands-Plattform",
					description: "Eine maßgeschneiderte Webanwendung für einen mittelständischen Kunden – individuell entwickelt, skalierbar gebaut.",
					stack: [
						"Angular",
						"Node.js",
						"SQL"
					],
					imagePlaceholder: "Screenshot des Dashboards mit zentraler KPI-Übersicht, links Sidebar-Navigation, rechts ein Detailpanel."
				},
				{
					number: "02",
					badge: "Digitalisierung",
					title: "Prozess-Automatisierung",
					description: "Automatisierung manueller Geschäftsprozesse durch intelligente Workflows und Datenpipelines.",
					stack: [
						"Python",
						"KNIME",
						"SQL"
					],
					imagePlaceholder: "Workflow-Diagramm: KNIME-Knoten, die Daten aus drei Quellen zusammenführen, validieren und in eine SQL-Tabelle schreiben."
				},
				{
					number: "03",
					badge: "Web-Auftritt",
					title: "Markenpräsenz Mittelstand",
					description: "Professioneller Webauftritt für ein etabliertes Unternehmen – performant, barrierefrei, individuell.",
					stack: ["WordPress", "TypeScript"],
					imagePlaceholder: "Hero-Mockup der Kunden-Website auf Desktop und Mobile – ruhige Typografie, großes Schlüsselbild."
				},
				{
					number: "04",
					badge: "App",
					title: "Interne Business-App",
					description: "Desktop-Applikation zur internen Prozessverwaltung – intuitiv bedienbar, wartungsfreundlich dokumentiert.",
					stack: [
						"C#",
						"SQL",
						"Vue"
					],
					imagePlaceholder: "Screenshot der Desktop-App: Listenansicht der Aufträge mit Filterleiste oben und Detail-Panel rechts."
				}
			]
		},
		process: {
			label: "— 04 / Vorgehen",
			headline: "Wie ich",
			headlineAccent: "arbeite.",
			body: "Kein starrer Ablauf. Je nach Vorhaben verschiebt sich das Gewicht. Die vier Schritte sind der übliche Rahmen, kein Korsett.",
			steps: [
				{
					number: "01",
					title: "Zuhören",
					duration: "Zum Einstieg",
					description: "Sie schildern mir, wo es hakt. Ich frage nach – und sage ehrlich, ob sich eine Umsetzung lohnt."
				},
				{
					number: "02",
					title: "Konzept",
					duration: "Je nach Umfang",
					description: "Was wird gebraucht, welcher Weg ist sinnvoll, was kostet er? Die Grundlage steht, bevor Budget fließt."
				},
				{
					number: "03",
					title: "Umsetzung",
					duration: "Nach Absprache",
					description: "Ich baue es und zeige Ihnen Zwischenstände. Nachsteuern ist unterwegs günstig, hinterher teuer."
				},
				{
					number: "04",
					title: "Betreuung",
					duration: "Auf Wunsch",
					description: "Übergabe, Einweisung, auf Wunsch Pflege und Anpassungen. Ansprechpartner bleibe ich in jedem Fall."
				}
			]
		},
		blog: {
			label: "— 05 / Journal",
			headline: "Gedanken &",
			headlineAccent: "Artikel.",
			readMore: "Weiterlesen",
			allPosts: "Alle Artikel",
			placeholderLabel: "Platzhalter",
			posts: [
				{
					category: "Digitalisierung",
					title: "Digitalisierung fängt nicht beim Großprojekt an.",
					excerpt: "Sie fängt bei dem einen Ablauf an, der Sie jede Woche Stunden kostet – und den außer Ihnen niemand sieht.",
					date: "2026-08-04",
					slug: "digitalisierung-faengt-klein-an",
					imagePlaceholder: "Handgeschriebene Liste auf einem Klemmbrett neben einem Laptop – warmes Morgenlicht, Werkstatt im Hintergrund."
				},
				{
					category: "Webshop",
					title: "Lohnt sich ein Webshop für mein Ladengeschäft?",
					excerpt: "Nicht für jedes Sortiment. Vier Fragen, die die Antwort meist schon vorwegnehmen.",
					date: "2026-07-21",
					slug: "lohnt-sich-ein-webshop",
					imagePlaceholder: "Ladentheke von oben – Produkte, ein Notizblock und ein Smartphone mit offener Produktliste."
				},
				{
					category: "Werkzeuge",
					title: "Excel-Tabelle oder eigenes Werkzeug?",
					excerpt: "Eine Tabelle ist erstaunlich weit tragfähig. Es gibt aber drei Punkte, an denen sie zuverlässig kippt.",
					date: "2026-07-07",
					slug: "excel-oder-eigenes-werkzeug",
					imagePlaceholder: "Bildschirm mit einer weit gescrollten Tabelle, daneben ein Notizzettel mit Formelfragment."
				}
			]
		},
		contact: {
			label: "— 06 / Kontakt",
			headline: "Lassen Sie uns",
			headlineAccent: "reden.",
			sub: "Schreiben Sie mir in zwei Sätzen, wo es hakt. Ich antworte in der Regel innerhalb von 24 Stunden.",
			form: {
				name: "Name",
				namePlaceholder: "Hanna Schmidt",
				email: "E-Mail",
				emailPlaceholder: "hanna@manufaktur.de",
				company: "Unternehmen (optional)",
				companyPlaceholder: "Schmidt Manufaktur",
				message: "Nachricht",
				messagePlaceholder: "Wir pflegen unsere Preise noch in drei Listen gleichzeitig — das kostet jede Woche einen halben Tag.",
				consent: "Ich willige in die Verarbeitung meiner Daten gemäß der",
				consentLink: "Datenschutzerklärung",
				consentSuffix: "ein.",
				submit: "Nachricht senden",
				submitting: "Wird gesendet …",
				successTitle: "Nachricht erhalten!",
				successMessage: "Danke für Ihre Nachricht. Ich melde mich in der Regel innerhalb von 24 Stunden.",
				errorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es noch einmal."
			},
			info: {
				emailLabel: "E-Mail",
				phoneLabel: "Handy",
				locationLabel: "Standort",
				socialLabel: "Social",
				email: "kontakt@tracht-digital.de",
				phone: "+49 178 822 4022",
				location: "Schwarzenbek · nähe Hamburg"
			}
		},
		pricing: {
			label: "— Preise",
			headline: "Transparente",
			headlineAccent: "Stundensätze.",
			sub: "Klare Preise, keine Pauschalpakete. Stundengenau abgerechnet, ehrlich geschätzt, mit einer Obergrenze, auf die Sie sich verlassen können.",
			teaserLabel: "Preise",
			teaserHeadline: "Klare Sätze,",
			teaserHeadlineAccent: "keine Pauschalen.",
			teaserSub: "Ab 95 € pro Stunde – stundengenau abgerechnet, ohne versteckte Kosten.",
			teaserCta: "Alle Stundensätze ansehen",
			teaserFromLabel: "ab",
			hourSuffix: "/ Stunde",
			includesLabel: "Beinhaltet:",
			items: [
				{
					title: "Beratung & Konzeption",
					rate: 120,
					description: "Strategische Begleitung, Architektur-Workshops, technische Reviews. Am Ende steht ein verständliches Konzept – nicht nur Folien.",
					includes: [
						"Aufnahme und Sortierung Ihrer Anforderungen",
						"Architektur- & Anforderungs-Workshops",
						"Code- & Stack-Reviews mit dokumentierten Empfehlungen",
						"Schriftliche Konzepte und Entscheidungsgrundlagen"
					],
					highlight: false
				},
				{
					title: "Web- & App-Entwicklung",
					rate: 105,
					description: "Frontend, Backend, mobile und Desktop-Apps. Sauber gebaut, getestet, dokumentiert – auch in zwei Jahren noch wartbar.",
					includes: [
						"Komponentenentwicklung (React, Vue, Angular)",
						"API- und Backend-Entwicklung (Node.js, C#, SQL)",
						"Mobile- und Desktop-Apps",
						"Tests, CI/CD und Dokumentation inklusive"
					],
					highlight: true
				},
				{
					title: "Digitalisierung & Automation",
					rate: 105,
					description: "Manuelle Abläufe durch Workflows, Datenpipelines und Integrationen ablösen. Konkrete Umsetzung, kein PowerPoint.",
					includes: [
						"Prozessanalyse vor Ort oder remote",
						"Workflow-Automation (Python, KNIME, n8n)",
						"Datenpipelines, ETL und SQL-Reporting",
						"Integration bestehender Tools und Systeme"
					],
					highlight: false
				},
				{
					title: "Wartung & Support",
					rate: 85,
					description: "Bestehende Systeme pflegen, Updates einspielen, Fehler beheben. Reaktionszeit nach Vereinbarung.",
					includes: [
						"Bug-Fixes und Hotfixes",
						"Dependency- und Sicherheits-Updates",
						"Monitoring und Performance-Optimierung",
						"Auf Wunsch monatliches Retainer-Modell"
					],
					highlight: false
				},
				{
					title: "Workshops & Schulungen",
					rate: 135,
					description: "Wissen weitergeben statt zurückhalten. Workshops für Ihr Team – von TypeScript-Basics bis Architektur.",
					includes: [
						"Inhouse- oder Remote-Workshops",
						"Maßgeschneiderte Schulungsunterlagen",
						"Hands-on-Übungen mit Ihrem echten Code",
						"Nachgespräch und Aufzeichnung inklusive"
					],
					highlight: false
				}
			],
			notesTitle: "Gut zu wissen",
			notes: [
				"Alle Preise zzgl. gesetzlicher Mehrwertsteuer (19 %).",
				"Tagessatz auf Anfrage – Rabatt ab 5 Tagen pro Monat verfügbar.",
				"Festpreis möglich, wenn der Umfang vorab klar ist.",
				"Reisekosten werden separat abgerechnet."
			],
			ctaTitle: "Klingt passend?",
			ctaSub: "Schreiben Sie mir kurz, worum es geht. Ich sage Ihnen ehrlich, ob und wie ich helfen kann.",
			ctaButton: "Unverbindlich anfragen",
			back: "Zurück"
		},
		consulting: {
			label: "— Beratung",
			headline: "Erst zuhören,",
			headlineAccent: "dann bauen.",
			body: "Vielleicht haben Sie ein klares Vorhaben, vielleicht nur das Gefühl, dass etwas einfacher laufen müsste. Beides ist ein guter Anfang.",
			primaryCta: "Unverbindlich anfragen",
			secondaryCta: "Leistungen ansehen"
		},
		footer: {
			slogan: "Digitale Lösungen, die wirklich passen.",
			tagline: "Persönlich, passgenau, aus einer Hand — aus Schwarzenbek bei Hamburg.",
			nav: "Navigation",
			contactTitle: "Kontakt",
			copyright: "© 2026 Tracht Digital Solutions. Alle Rechte vorbehalten.",
			impressum: "Impressum",
			datenschutz: "Datenschutz",
			pricing: "Preise"
		},
		errors: {
			name: "Bitte geben Sie Ihren Namen an.",
			email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
			message: "Mindestens 20 Zeichen, bitte.",
			consent: "Zustimmung erforderlich."
		},
		cookieNotice: {
			label: "Hinweis zu Cookies und Datenschutz",
			siteText: "Diese Website verwendet keine Tracking-Cookies. Es werden lediglich technisch notwendige Einstellungen (z. B. Ihr Farbschema) lokal in Ihrem Browser gespeichert.",
			panelText: "Dieser Bereich verwendet ausschließlich ein technisch notwendiges Cookie für die sichere Anmeldung (Session-Cookie). Es findet kein Tracking statt.",
			privacy: "Mehr in der Datenschutzerklärung.",
			accept: "Verstanden",
			consentText: "Wir zeigen auf diesem Blog Werbung von Google AdSense. Dafür werden – nur mit Ihrer Einwilligung – Cookies und ähnliche Technologien zu Werbezwecken gesetzt. Ihre Wahl ist freiwillig und jederzeit änderbar.",
			consentAccept: "Akzeptieren",
			consentDecline: "Ablehnen"
		},
		toast: { dismiss: "Schließen" }
	},
	en: {
		nav: {
			about: "About",
			services: "Services",
			tech: "Tech",
			portfolio: "Portfolio",
			process: "Process",
			blog: "Journal",
			contact: "Contact",
			cta: "Get in touch",
			pricing: "Pricing"
		},
		hero: {
			availability: "Available for projects · Q3 2026",
			location: "Schwarzenbek · Hamburg",
			headline: "Digitalization that takes",
			headlineAccent: "work",
			headlineSuffix: "off your hands.",
			sub: "Websites, online shops and tools for small businesses. I look at where things stick – and build what helps. From Schwarzenbek near Hamburg.",
			cta1: "Get in touch",
			cta2: "See services",
			scrollHint: "Scroll"
		},
		about: {
			label: "— 01 / About",
			headline: "Hi, I'm",
			headlineAccent: "Julian.",
			lead: "I'm a freelance developer in Schwarzenbek near Hamburg. I work with freelancers and small businesses that have no IT department.",
			p1: "Website, online shop, a small program or a workflow that should get simpler: I listen, sort out the plan and build it. One contact, start to finish.",
			p2: "Off-the-shelf software makes you adapt to it. A good tool works the other way round. Sometimes the honest answer is: it isn't worth it.",
			portraitPlaceholder: "A black-and-white portrait of Julian — seated at an angle at his desk, slightly turned toward the camera, soft natural light.",
			stat1Value: "5+",
			stat1Label: "Years of experience",
			stat2Value: "5",
			stat2Label: "Areas of work",
			stat3Value: "1:1",
			stat3Label: "Personal support"
		},
		services: {
			label: "— 02 / Services",
			headline: "What I",
			headlineAccent: "deliver.",
			items: [
				{
					number: "01",
					title: "Digitalization for Businesses",
					description: "Lists kept by hand, figures from three places, the same retyping every day. I take one concrete workflow and make it simpler – not the whole business at once.",
					tags: [
						"Workflows",
						"Reporting",
						"Automation",
						"Integrations"
					]
				},
				{
					number: "02",
					title: "Digital Concepts",
					description: "You have an idea but no plan yet. I turn it into a concept you can read: what is needed, which route makes sense, what it costs.",
					tags: [
						"Requirements",
						"Clickable draft",
						"Effort",
						"Roadmap"
					]
				},
				{
					number: "03",
					title: "Custom Development",
					description: "Not every task needs a big program. Often it just needs the tool that fits your work: a spreadsheet template, a small application, a report.",
					tags: [
						"Spreadsheet template",
						"Small application",
						"Reporting",
						"Data import"
					]
				},
				{
					number: "04",
					title: "Web Presence",
					description: "Out of date, unclear or not there at all? Then people leave before they get in touch. I build new, bring existing sites up to standard – and maintain them.",
					tags: [
						"New website",
						"Rework",
						"Maintenance",
						"Findability"
					]
				},
				{
					number: "05",
					title: "Online Shop",
					description: "Your shop runs locally, now it should run online too. I plan, build and look after it – set up so items and stock can be managed from a phone.",
					tags: [
						"Online sales",
						"Product upkeep",
						"Stock by phone",
						"Support"
					]
				}
			]
		},
		tech: {
			label: "Tech Stack",
			headline: "What I",
			headlineAccent: "work with.",
			body: "Tools that have proven themselves – not a matter of faith, just the right thing for the problem. Languages change; good architecture stays."
		},
		portfolio: {
			label: "— 03 / Portfolio",
			headline: "Selected",
			headlineAccent: "projects.",
			comingSoon: "Coming soon",
			placeholderLabel: "Placeholder",
			items: [
				{
					number: "01",
					badge: "Web App",
					title: "Mid-market platform",
					description: "A custom-built web application for a mid-market client – individually developed, built to scale.",
					stack: [
						"Angular",
						"Node.js",
						"SQL"
					],
					imagePlaceholder: "Dashboard screenshot with central KPI overview, sidebar navigation on the left, detail panel on the right."
				},
				{
					number: "02",
					badge: "Digitalization",
					title: "Process automation",
					description: "Automation of manual business processes through intelligent workflows and data pipelines.",
					stack: [
						"Python",
						"KNIME",
						"SQL"
					],
					imagePlaceholder: "Workflow diagram: KNIME nodes pulling data from three sources, validating it, writing into a SQL table."
				},
				{
					number: "03",
					badge: "Web presence",
					title: "Brand presence",
					description: "Professional web presence for an established company – performant, accessible, individually crafted.",
					stack: ["WordPress", "TypeScript"],
					imagePlaceholder: "Hero mockup of the client site on desktop and mobile — quiet typography, large keystone image."
				},
				{
					number: "04",
					badge: "App",
					title: "Internal business app",
					description: "Desktop application for internal process management – intuitively usable, cleanly documented.",
					stack: [
						"C#",
						"SQL",
						"Vue"
					],
					imagePlaceholder: "Desktop app screenshot: list view of orders with filter bar at the top and detail panel on the right."
				}
			]
		},
		process: {
			label: "— 04 / Process",
			headline: "How I",
			headlineAccent: "work.",
			body: "No rigid process. The weight shifts with the job. The four steps below are the usual frame, not a corset.",
			steps: [
				{
					number: "01",
					title: "Listening",
					duration: "To begin with",
					description: "You tell me where things get stuck. I keep asking – and say honestly whether building something is worth it."
				},
				{
					number: "02",
					title: "Concept",
					duration: "Depends on scope",
					description: "What is needed, which route makes sense, what does it cost? The groundwork is there before any budget moves."
				},
				{
					number: "03",
					title: "Delivery",
					duration: "As agreed",
					description: "I build it and show you where it stands. Changing course is cheap along the way and expensive afterwards."
				},
				{
					number: "04",
					title: "Support",
					duration: "If you want it",
					description: "Handover, a walkthrough, and maintenance if you want it. Either way I stay your point of contact."
				}
			]
		},
		blog: {
			label: "— 05 / Journal",
			headline: "Thoughts &",
			headlineAccent: "articles.",
			readMore: "Read more",
			allPosts: "All articles",
			placeholderLabel: "Placeholder",
			posts: [
				{
					category: "Digitalization",
					title: "Digitalization doesn't start with a big project.",
					excerpt: "It starts with the one routine that costs you hours every week – the one nobody but you can see.",
					date: "2026-08-04",
					slug: "digitalisierung-faengt-klein-an",
					imagePlaceholder: "A handwritten list on a clipboard beside a laptop — warm morning light, workshop in the background."
				},
				{
					category: "Online shop",
					title: "Is an online shop worth it for my local business?",
					excerpt: "Not for every range of products. Four questions that usually answer it for you.",
					date: "2026-07-21",
					slug: "lohnt-sich-ein-webshop",
					imagePlaceholder: "A shop counter from above — products, a notepad and a phone showing an open product list."
				},
				{
					category: "Tools",
					title: "Spreadsheet or a tool of your own?",
					excerpt: "A spreadsheet carries you surprisingly far. There are three points, though, where it reliably tips over.",
					date: "2026-07-07",
					slug: "excel-oder-eigenes-werkzeug",
					imagePlaceholder: "A screen showing a spreadsheet scrolled far down, next to a sticky note with a fragment of a formula."
				}
			]
		},
		contact: {
			label: "— 06 / Contact",
			headline: "Let's",
			headlineAccent: "talk.",
			sub: "Tell me in two sentences where things are getting stuck. I usually respond within 24 hours.",
			form: {
				name: "Name",
				namePlaceholder: "Alex Marlow",
				email: "Email",
				emailPlaceholder: "alex@marlow.studio",
				company: "Company (optional)",
				companyPlaceholder: "Marlow Studios",
				message: "Message",
				messagePlaceholder: "We still keep our prices in three separate lists — it costs us half a day every week.",
				consent: "I consent to the processing of my data in accordance with the",
				consentLink: "Privacy Policy",
				consentSuffix: ".",
				submit: "Send message",
				submitting: "Sending …",
				successTitle: "Message received!",
				successMessage: "Thank you for your message. I'll get back to you within 24 hours.",
				errorMessage: "Something went wrong. Please try again."
			},
			info: {
				emailLabel: "Email",
				phoneLabel: "Mobile",
				locationLabel: "Location",
				socialLabel: "Social",
				email: "contact@tracht-digital.de",
				phone: "+49 178 822 4022",
				location: "Schwarzenbek · near Hamburg"
			}
		},
		pricing: {
			label: "— Pricing",
			headline: "Transparent",
			headlineAccent: "hourly rates.",
			sub: "Clear pricing, no opaque packages. Billed by the actual hour, honestly estimated, with a ceiling you can rely on.",
			teaserLabel: "Pricing",
			teaserHeadline: "Clear rates,",
			teaserHeadlineAccent: "no packages.",
			teaserSub: "From €95 per hour – billed by the actual hour, no hidden fees.",
			teaserCta: "See all hourly rates",
			teaserFromLabel: "from",
			hourSuffix: "/ hour",
			includesLabel: "Included:",
			items: [
				{
					title: "Consulting & Strategy",
					rate: 120,
					description: "Strategic guidance, architecture workshops, technical reviews. You end up with a clear written concept — not just slides.",
					includes: [
						"Capturing and sorting your requirements",
						"Architecture and requirements workshops",
						"Code and stack reviews with documented recommendations",
						"Written concepts and decision-making input"
					],
					highlight: false
				},
				{
					title: "Web & App Development",
					rate: 105,
					description: "Frontend, backend, mobile and desktop apps. Cleanly built, tested, documented – still maintainable in two years.",
					includes: [
						"Component development (React, Vue, Angular)",
						"API and backend development (Node.js, C#, SQL)",
						"Mobile and desktop apps",
						"Tests, CI/CD and documentation included"
					],
					highlight: true
				},
				{
					title: "Digitalization & Automation",
					rate: 105,
					description: "Replacing manual processes with workflows, data pipelines and integrations. Concrete work, no PowerPoint.",
					includes: [
						"On-site or remote process analysis",
						"Workflow automation (Python, KNIME, n8n)",
						"Data pipelines, ETL and SQL reporting",
						"Integration of existing tools and systems"
					],
					highlight: false
				},
				{
					title: "Maintenance & Support",
					rate: 85,
					description: "Maintaining existing systems, rolling out updates, fixing bugs. Response times by agreement.",
					includes: [
						"Bug fixes and hotfixes",
						"Dependency and security updates",
						"Monitoring and performance optimization",
						"Optional monthly retainer model"
					],
					highlight: false
				},
				{
					title: "Workshops & Training",
					rate: 135,
					description: "Sharing knowledge instead of hoarding it. Workshops for your team – from TypeScript basics to architecture.",
					includes: [
						"On-site or remote workshops",
						"Tailored training materials",
						"Hands-on exercises with your real code",
						"Follow-up call and recording included"
					],
					highlight: false
				}
			],
			notesTitle: "Good to know",
			notes: [
				"All prices exclude German VAT (19 %).",
				"Day rate available on request — discount for 5+ days per month.",
				"Fixed price possible when the scope is clear up front.",
				"Travel costs are billed separately."
			],
			ctaTitle: "Sounds like a fit?",
			ctaSub: "Tell me briefly what it's about. I'll tell you honestly whether and how I can help.",
			ctaButton: "Get in touch",
			back: "Back"
		},
		consulting: {
			label: "— Consulting",
			headline: "Listen first,",
			headlineAccent: "build after.",
			body: "Maybe you have a clear plan, maybe just a feeling that something ought to be simpler. Either is a good place to start.",
			primaryCta: "Get in touch",
			secondaryCta: "See services"
		},
		footer: {
			slogan: "Digital solutions that truly fit.",
			tagline: "Personal, tailored, all from one source — from Schwarzenbek near Hamburg.",
			nav: "Navigation",
			contactTitle: "Contact",
			copyright: "© 2026 Tracht Digital Solutions. All rights reserved.",
			impressum: "Legal Notice",
			datenschutz: "Privacy Policy",
			pricing: "Pricing"
		},
		errors: {
			name: "Please enter your name.",
			email: "Please enter a valid email address.",
			message: "At least 20 characters, please.",
			consent: "Consent required."
		},
		cookieNotice: {
			label: "Cookie and privacy notice",
			siteText: "This website does not use tracking cookies. Only technically necessary preferences (e.g. your colour scheme) are stored locally in your browser.",
			panelText: "This area only uses one technically necessary cookie for secure sign-in (session cookie). No tracking takes place.",
			privacy: "More in the privacy policy.",
			accept: "Got it",
			consentText: "This blog shows advertising from Google AdSense. With your consent — and only then — cookies and similar technologies are set for advertising. Your choice is free and can be changed at any time.",
			consentAccept: "Accept",
			consentDecline: "Decline"
		},
		toast: { dismiss: "Dismiss" }
	}
};
var DEFAULT_STORAGE_KEY = "tds-cookie-notice";
var DEFAULT_PRIVACY_URL = "https://tracht-digital.de/legal/datenschutz";
var AD_CONSENT_KEY = "tds-ad-consent";
var AD_CONSENT_EVENT = "tds-ad-consent";
function getAdConsent() {
	if (typeof window === "undefined") return null;
	try {
		const v = window.localStorage.getItem(AD_CONSENT_KEY);
		return v === "granted" || v === "denied" ? v : null;
	} catch {
		return null;
	}
}
function setAdConsent(value) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(AD_CONSENT_KEY, value);
	} catch {}
	try {
		window.dispatchEvent(new CustomEvent(AD_CONSENT_EVENT, { detail: value }));
	} catch {}
}
function CookieNotice({ lang = "de", variant = "site", consent = false, privacyUrl = DEFAULT_PRIVACY_URL, storageKey = DEFAULT_STORAGE_KEY } = {}) {
	const [visible, setVisible] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		try {
			if (consent) {
				if (getAdConsent() !== null) return;
			} else if (localStorage.getItem(storageKey) === "1") return;
		} catch {}
		setVisible(true);
	}, [consent, storageKey]);
	useEffect(() => {
		const el = ref.current;
		if (!visible || !el || typeof window === "undefined") return;
		const root = document.documentElement;
		const publish = () => {
			root.style.setProperty("--tds-bottom-lane", `${Math.ceil(el.getBoundingClientRect().height)}px`);
		};
		publish();
		const ro = typeof ResizeObserver === "function" ? new ResizeObserver(publish) : null;
		ro?.observe(el);
		window.addEventListener("resize", publish);
		return () => {
			ro?.disconnect();
			window.removeEventListener("resize", publish);
			root.style.removeProperty("--tds-bottom-lane");
		};
	}, [visible]);
	if (!visible) return null;
	const t = translations[lang].cookieNotice;
	const dismiss = () => {
		setVisible(false);
		try {
			localStorage.setItem(storageKey, "1");
		} catch {}
	};
	const decide = (value) => {
		setVisible(false);
		setAdConsent(value);
	};
	return /* @__PURE__ */ jsxs("aside", {
		ref,
		className: "cookie-notice",
		role: "region",
		"aria-label": t.label,
		children: [/* @__PURE__ */ jsxs("p", {
			className: "cookie-notice-text",
			children: [
				consent ? t.consentText : variant === "panel" ? t.panelText : t.siteText,
				" ",
				/* @__PURE__ */ jsx("a", {
					className: "cookie-notice-link",
					href: privacyUrl,
					children: t.privacy
				})
			]
		}), consent ? /* @__PURE__ */ jsxs("div", {
			className: "cookie-notice-actions",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "cookie-notice-btn cookie-notice-btn--ghost",
				onClick: () => decide("denied"),
				children: t.consentDecline
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "cookie-notice-btn",
				onClick: () => decide("granted"),
				children: t.consentAccept
			})]
		}) : /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "cookie-notice-btn",
			onClick: dismiss,
			children: t.accept
		})]
	});
}
var RUNTIME_CONFIG_PATH = "/tds-runtime.json";
var STATE_KEY = /* @__PURE__ */ Symbol.for("@tracht-digital-solutions/tds-shared:api-state");
var state = (() => {
	const host = globalThis;
	const existing = host[STATE_KEY];
	if (existing !== void 0) return existing;
	const fresh = {
		cached: null,
		runtimePromise: null,
		runtimeValue: null,
		onUnauthorized: null,
		headersProvider: null
	};
	host[STATE_KEY] = fresh;
	return fresh;
})();
var trimEnd = (value) => value.replace(/\/+$/, "");
function apiBase() {
	if (state.cached !== null) return state.cached;
	const env = typeof import.meta !== "undefined" ? Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_DEMO_MODE": "true",
		"SITE": "https://tracht-digital.de",
		"SSR": true
	}, {
		CI: "true",
		_: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm",
		PATH: "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/node_modules/.bin:/home/runner/work/tds-landingpage-frontend/node_modules/.bin:/home/runner/work/node_modules/.bin:/home/runner/node_modules/.bin:/home/node_modules/.bin:/node_modules/.bin:/opt/hostedtoolcache/node/22.23.2/x64/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/opt/hostedtoolcache/node/22.23.2/x64/bin:/snap/bin:/home/runner/.local/bin:/opt/pipx_bin:/home/runner/.cargo/bin:/home/runner/.config/composer/vendor/bin:/usr/local/.ghcup/bin:/home/runner/.dotnet/tools:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
	})?.PUBLIC_API_BASE ?? "" : "";
	if (typeof document === "undefined") return trimEnd(env || "https://api.tracht-digital.de");
	let meta = "";
	try {
		meta = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	state.cached = trimEnd(meta.trim() || env || "https://api.tracht-digital.de");
	return state.cached;
}
async function runtimeConfig() {
	if (state.runtimePromise !== null) return state.runtimePromise;
	if (typeof document === "undefined" || typeof fetch !== "function") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	let declared = "";
	try {
		declared = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	if (declared.trim() !== "") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	state.runtimePromise = (async () => {
		try {
			const res = await fetch(RUNTIME_CONFIG_PATH, {
				credentials: "same-origin",
				headers: { Accept: "application/json" },
				signal: typeof AbortSignal?.timeout === "function" ? AbortSignal.timeout(3e3) : void 0
			});
			if (!res.ok) return null;
			if (!(res.headers.get("content-type") ?? "").includes("json")) return null;
			const parsed = await res.json();
			if (parsed === null || typeof parsed !== "object") return null;
			const config = parsed;
			if (typeof config.apiBase === "string" && config.apiBase !== "") state.cached = trimEnd(config.apiBase);
			state.runtimeValue = config;
			return config;
		} catch {
			return null;
		}
	})();
	return state.runtimePromise;
}
function apiUrl(path) {
	if (/^(https?:)?\/\//i.test(path)) return path;
	return `${apiBase()}${path.startsWith("/") ? "" : "/"}${path}`;
}
async function apiFetch(path, init = {}) {
	await runtimeConfig();
	const url = apiUrl(path);
	let extra = {};
	if (state.headersProvider !== null) try {
		extra = state.headersProvider(url);
	} catch {}
	const res = await fetch(url, {
		credentials: "include",
		...init,
		headers: {
			...extra,
			...init.headers
		}
	});
	if (res.status === 401 && state.onUnauthorized !== null) try {
		await state.onUnauthorized(url);
	} catch {}
	return res;
}
var STR = {
	de: {
		close: "Schließen",
		hide: "Ausblenden",
		chat: "Chat",
		faq: "FAQ",
		docs: "Hilfe",
		contact: "Kontakt",
		startPrompt: "Schreib uns – wir antworten so schnell wie möglich.",
		namePh: "Name (optional)",
		emailPh: "E-Mail (optional)",
		msgPh: "Nachricht …",
		send: "Senden",
		start: "Chat starten",
		subjectPh: "Betreff (optional)",
		contactMsgPh: "Deine Nachricht …",
		contactSend: "Absenden",
		contactOk: "Danke! Wir melden uns.",
		contactErr: "Bitte Name, gültige E-Mail und eine Nachricht (min. 20 Zeichen) angeben.",
		rate: "Zu viele Anfragen – bitte später erneut versuchen.",
		empty: "Noch keine Nachrichten."
	},
	en: {
		close: "Close",
		hide: "Hide",
		chat: "Chat",
		faq: "FAQ",
		docs: "Help",
		contact: "Contact",
		startPrompt: "Message us – we reply as soon as we can.",
		namePh: "Name (optional)",
		emailPh: "Email (optional)",
		msgPh: "Message …",
		send: "Send",
		start: "Start chat",
		subjectPh: "Subject (optional)",
		contactMsgPh: "Your message …",
		contactSend: "Submit",
		contactOk: "Thanks! We'll be in touch.",
		contactErr: "Please provide a name, a valid email and a message (min. 20 chars).",
		rate: "Too many requests – please try again later.",
		empty: "No messages yet."
	}
};
var HIDDEN_KEY = "tds-live-chat-hidden";
var POLL_MS = 4e3;
function LiveChatCta({ frontend, apiBase: apiBase2, lang = "de" }) {
	const t = STR[lang === "en" ? "en" : "de"];
	const [config, setConfig] = useState(null);
	const [hidden, setHidden] = useState(true);
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState("chat");
	const launcherRef = useRef(null);
	const api = useCallback((path, init) => apiBase2 ? fetch(`${apiBase2}${path}`, {
		credentials: "include",
		...init
	}) : apiFetch(path, init), [apiBase2]);
	useEffect(() => {
		let alive = true;
		let dismissed = false;
		try {
			dismissed = localStorage.getItem(`${HIDDEN_KEY}:${frontend}`) === "1";
		} catch {}
		api(`/live-chat-cta/config?frontend=${encodeURIComponent(frontend)}&lang=${lang}`).then((r) => r.ok ? r.json() : null).then((d) => {
			if (!alive || !d || !d.enabled) return;
			setConfig(d);
			setHidden(dismissed);
			const first = [
				"chat",
				"faq",
				"docs",
				"contact"
			].find((k) => d.tabs[k]);
			if (first) setTab(first);
		}).catch(() => {});
		return () => {
			alive = false;
		};
	}, [
		api,
		frontend,
		lang
	]);
	useEffect(() => {
		const el = launcherRef.current;
		const root = typeof document === "undefined" ? null : document.documentElement;
		if (!root) return;
		if (!el || open || hidden || !config) {
			root.style.removeProperty("--tds-right-lane");
			return;
		}
		const publish = () => {
			root.style.setProperty("--tds-right-lane", `${Math.ceil(el.getBoundingClientRect().height)}px`);
		};
		publish();
		const ro = typeof ResizeObserver === "function" ? new ResizeObserver(publish) : null;
		ro?.observe(el);
		window.addEventListener("resize", publish);
		return () => {
			ro?.disconnect();
			window.removeEventListener("resize", publish);
			root.style.removeProperty("--tds-right-lane");
		};
	}, [
		config,
		hidden,
		open
	]);
	const hide = () => {
		setHidden(true);
		setOpen(false);
		try {
			localStorage.setItem(`${HIDDEN_KEY}:${frontend}`, "1");
		} catch {}
	};
	if (!config || hidden) return null;
	const enabledTabs = [
		"chat",
		"faq",
		"docs",
		"contact"
	].filter((k) => config.tabs[k]);
	if (enabledTabs.length === 0) return null;
	const accent = config.cta.accent || "#050f68";
	if (!open) return /* @__PURE__ */ jsxs("div", {
		ref: launcherRef,
		className: "live-chat-cta live-chat-cta--closed",
		style: { "--lc-accent": accent },
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "live-chat-cta__launcher",
			onClick: () => setOpen(true),
			children: [/* @__PURE__ */ jsx("span", {
				className: "live-chat-cta__launcher-icon",
				"aria-hidden": "true",
				children: "💬"
			}), /* @__PURE__ */ jsx("span", {
				className: "live-chat-cta__launcher-label",
				children: config.cta.label
			})]
		}), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "live-chat-cta__hide",
			onClick: hide,
			"aria-label": t.hide,
			title: t.hide,
			children: "×"
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta live-chat-cta--open",
		style: { "--lc-accent": accent },
		role: "dialog",
		"aria-label": config.cta.label,
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "live-chat-cta__head",
				children: [/* @__PURE__ */ jsx("span", {
					className: "live-chat-cta__title",
					children: config.cta.label
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "live-chat-cta__close",
					onClick: () => setOpen(false),
					"aria-label": t.close,
					title: t.close,
					children: "−"
				})]
			}),
			enabledTabs.length > 1 ? /* @__PURE__ */ jsx("nav", {
				className: "live-chat-cta__tabs",
				role: "tablist",
				children: enabledTabs.map((k) => /* @__PURE__ */ jsx("button", {
					type: "button",
					role: "tab",
					"aria-selected": tab === k,
					className: tab === k ? "is-active" : "",
					onClick: () => setTab(k),
					children: t[k]
				}, k))
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "live-chat-cta__body",
				children: [
					tab === "chat" && config.tabs.chat ? /* @__PURE__ */ jsx(ChatPane, {
						api,
						frontend,
						greeting: config.cta.greeting,
						t
					}) : null,
					tab === "faq" && config.tabs.faq ? /* @__PURE__ */ jsx(FaqPane, { faqs: config.faqs }) : null,
					tab === "docs" && config.tabs.docs ? /* @__PURE__ */ jsx(DocsPane, { docs: config.docs }) : null,
					tab === "contact" && config.tabs.contact ? /* @__PURE__ */ jsx(ContactPane, {
						api,
						frontend,
						t
					}) : null
				]
			})
		]
	});
}
function sessionKey(frontend) {
	return `tds-live-chat-session:${frontend}`;
}
function ChatPane({ api, frontend, greeting, t }) {
	const [session, setSession] = useState(null);
	const [messages, setMessages] = useState([]);
	const [draft, setDraft] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [busy, setBusy] = useState(false);
	const endRef = useRef(null);
	const cursor = useRef(0);
	useEffect(() => {
		try {
			const raw = localStorage.getItem(sessionKey(frontend));
			if (raw) setSession(JSON.parse(raw));
		} catch {}
	}, [frontend]);
	const poll = useCallback(async () => {
		if (!session) return;
		const res = await api(`/live-chat-cta/chat/${session.id}/messages?since=${cursor.current}`, { headers: { "X-Chat-Token": session.token } });
		if (res.ok) {
			const incoming = (await res.json()).messages ?? [];
			if (incoming.length > 0) {
				cursor.current = incoming[incoming.length - 1].id;
				setMessages((m) => [...m, ...incoming]);
			}
		}
	}, [api, session]);
	useEffect(() => {
		if (!session) return;
		poll();
		const timer = setInterval(() => void poll(), POLL_MS);
		return () => clearInterval(timer);
	}, [session, poll]);
	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	const start = async () => {
		const body = draft.trim();
		if (!body) return;
		setBusy(true);
		const res = await api("/live-chat-cta/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				email,
				frontend,
				message: body
			})
		});
		setBusy(false);
		if (res.ok) {
			const d = await res.json();
			const s = {
				id: d.id,
				token: d.token
			};
			try {
				localStorage.setItem(sessionKey(frontend), JSON.stringify(s));
			} catch {}
			setSession(s);
			setDraft("");
		}
	};
	const send = async () => {
		if (!session) return;
		const body = draft.trim();
		if (!body) return;
		setBusy(true);
		const res = await api(`/live-chat-cta/chat/${session.id}/messages`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Chat-Token": session.token
			},
			body: JSON.stringify({ body })
		});
		setBusy(false);
		if (res.ok) {
			setDraft("");
			await poll();
		}
	};
	if (!session) return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__chat",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "live-chat-cta__greeting",
				children: greeting
			}),
			/* @__PURE__ */ jsx("p", {
				className: "live-chat-cta__hint",
				children: t.startPrompt
			}),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: t.namePh
			}),
			/* @__PURE__ */ jsx("input", {
				type: "email",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				placeholder: t.emailPh
			}),
			/* @__PURE__ */ jsx("textarea", {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: t.msgPh,
				rows: 3
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: start,
				disabled: busy || !draft.trim(),
				children: t.start
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__chat",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "live-chat-cta__messages",
			children: [
				messages.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "live-chat-cta__hint",
					children: greeting
				}) : null,
				messages.map((m) => /* @__PURE__ */ jsx("div", {
					className: `live-chat-cta__msg live-chat-cta__msg--${m.author}`,
					children: m.body
				}, m.id)),
				/* @__PURE__ */ jsx("div", { ref: endRef })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "live-chat-cta__compose",
			children: [/* @__PURE__ */ jsx("textarea", {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: t.msgPh,
				rows: 2,
				onKeyDown: (e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						send();
					}
				}
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: send,
				disabled: busy || !draft.trim(),
				children: t.send
			})]
		})]
	});
}
function FaqPane({ faqs }) {
	const [open, setOpen] = useState(null);
	if (faqs.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "live-chat-cta__hint",
		children: "—"
	});
	return /* @__PURE__ */ jsx("ul", {
		className: "live-chat-cta__faq",
		children: faqs.map((f) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			"aria-expanded": open === f.id,
			onClick: () => setOpen(open === f.id ? null : f.id),
			children: f.question
		}), open === f.id ? /* @__PURE__ */ jsx(Prose, {
			text: f.answer,
			className: "live-chat-cta__faq-answer"
		}) : null] }, f.id))
	});
}
function DocsPane({ docs }) {
	const [active, setActive] = useState(null);
	if (docs.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "live-chat-cta__hint",
		children: "—"
	});
	const current = docs.find((d) => d.id === active) ?? null;
	if (current) return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__doc",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "live-chat-cta__back",
				onClick: () => setActive(null),
				children: "← "
			}),
			/* @__PURE__ */ jsx("h4", { children: current.title }),
			/* @__PURE__ */ jsx(Prose, {
				text: current.body_markdown,
				className: "live-chat-cta__doc-body"
			})
		]
	});
	return /* @__PURE__ */ jsx("ul", {
		className: "live-chat-cta__docs",
		children: docs.map((d) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => setActive(d.id),
			children: d.title
		}) }, d.id))
	});
}
function ContactPane({ api, frontend, t }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [website, setWebsite] = useState("");
	const [busy, setBusy] = useState(false);
	const [status, setStatus] = useState(null);
	const [done, setDone] = useState(false);
	const submit = async () => {
		setBusy(true);
		setStatus(null);
		const res = await api("/live-chat-cta/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				email,
				subject,
				message,
				frontend,
				website
			})
		});
		setBusy(false);
		if (res.ok) setDone(true);
		else if (res.status === 429) setStatus(t.rate);
		else setStatus(t.contactErr);
	};
	if (done) return /* @__PURE__ */ jsx("p", {
		className: "live-chat-cta__ok",
		children: t.contactOk
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__contact",
		children: [
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: t.namePh
			}),
			/* @__PURE__ */ jsx("input", {
				type: "email",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				placeholder: t.emailPh
			}),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: subject,
				onChange: (e) => setSubject(e.target.value),
				placeholder: t.subjectPh
			}),
			/* @__PURE__ */ jsx("textarea", {
				value: message,
				onChange: (e) => setMessage(e.target.value),
				placeholder: t.contactMsgPh,
				rows: 4
			}),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: website,
				onChange: (e) => setWebsite(e.target.value),
				tabIndex: -1,
				autoComplete: "off",
				"aria-hidden": "true",
				style: {
					position: "absolute",
					left: "-9999px",
					width: 1,
					height: 1,
					opacity: 0
				}
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "live-chat-cta__err",
				children: status
			}) : null,
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: submit,
				disabled: busy,
				children: t.contactSend
			})
		]
	});
}
function Prose({ text, className }) {
	const paragraphs = text.split(/\n{2,}/);
	return /* @__PURE__ */ jsx("div", {
		className,
		children: paragraphs.map((p, i) => /* @__PURE__ */ jsx("p", { children: p.split("\n").map((line, j) => /* @__PURE__ */ jsxs("span", { children: [line, j < p.split("\n").length - 1 ? /* @__PURE__ */ jsx("br", {}) : null] }, j)) }, i))
	});
}
var abs = (s) => ({
	position: "absolute",
	...s
});
var FLAT_TINT = "var(--tds-flat-tint, color-mix(in srgb, var(--color-primary) 9%, var(--color-paper)))";
function AbstractCover({ variant, style, className }) {
	const v = (Math.abs(variant) - 1) % 6 + 1;
	const base = {
		position: "relative",
		overflow: "hidden",
		width: "100%",
		height: "100%",
		...style
	};
	if (v === 1) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-surface-navy)"
		},
		"aria-hidden": "true",
		children: [/* @__PURE__ */ jsx("div", { style: abs({
			right: "-12%",
			top: "-30%",
			width: "70%",
			aspectRatio: "1",
			borderRadius: "50%",
			border: "1.5px solid rgba(255,255,255,.35)"
		}) }), /* @__PURE__ */ jsx("div", { style: abs({
			right: "12%",
			bottom: "14%",
			width: "13%",
			aspectRatio: "1",
			background: "var(--color-surface-accent)"
		}) })]
	});
	if (v === 2) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-soft)"
		},
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "-10%",
				bottom: "-45%",
				width: "65%",
				aspectRatio: "1",
				borderRadius: "50%",
				background: "var(--color-surface-navy)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				right: "14%",
				top: "18%",
				width: "26%",
				height: 3,
				background: "var(--color-accent)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				right: "14%",
				top: "28%",
				width: "34%",
				aspectRatio: "1",
				borderRadius: "50%",
				border: "1.5px solid var(--color-primary)",
				opacity: .5
			}) })
		]
	});
	if (v === 3) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-surface-ink)"
		},
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { style: abs({
				inset: 0,
				opacity: .18,
				backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
				backgroundSize: "44px 44px",
				backgroundPosition: "22px 18px"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "18%",
				top: "30%",
				width: "17%",
				aspectRatio: "1",
				borderRadius: "50%",
				background: "var(--color-surface-accent)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "42%",
				top: "30%",
				right: "14%",
				bottom: "32%",
				border: "1.5px solid rgba(255,255,255,.55)"
			}) })
		]
	});
	if (v === 4) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: FLAT_TINT
		},
		"aria-hidden": "true",
		children: [[
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ jsx("div", { style: abs({
			left: `${16 + i * 14}%`,
			top: `${34 - i * 8}%`,
			bottom: 0,
			width: "7%",
			background: i === 1 ? "var(--color-primary)" : "var(--color-surface-navy)",
			opacity: i === 1 ? .55 : 1
		}) }, i)), /* @__PURE__ */ jsx("div", { style: abs({
			right: "16%",
			top: "22%",
			width: "10%",
			aspectRatio: "1",
			borderRadius: "50%",
			background: "var(--color-surface-accent)"
		}) })]
	});
	if (v === 5) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-surface-navy)"
		},
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "-18%",
				top: "-18%",
				width: "52%",
				aspectRatio: "1",
				borderRadius: "50%",
				background: "rgba(0,0,0,.35)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				right: "-8%",
				bottom: "-40%",
				width: "56%",
				aspectRatio: "1",
				borderRadius: "50%",
				border: "1.5px solid rgba(255,255,255,.3)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "46%",
				top: "44%",
				width: "20%",
				height: 3,
				background: "var(--color-surface-accent)"
			}) })
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-surface-ink)"
		},
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "14%",
				top: "24%",
				width: "30%",
				aspectRatio: "1",
				border: "1.5px solid rgba(255,255,255,.4)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "26%",
				top: "44%",
				width: "30%",
				aspectRatio: "1",
				background: "var(--color-surface-navy)",
				filter: "brightness(1.8)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				right: "16%",
				top: "30%",
				width: "9%",
				aspectRatio: "1",
				borderRadius: "50%",
				background: "var(--color-surface-accent)"
			}) })
		]
	});
}
function coverVariant(slug) {
	let h = 0;
	for (let i = 0; i < slug.length; i++) h = h * 31 + slug.charCodeAt(i) | 0;
	return Math.abs(h) % 6 + 1;
}
function hasPhotoCover(coverHint) {
	if (!coverHint) return false;
	return /^https?:\/\//i.test(coverHint) || /^\/.+\.(webp|avif|png|jpe?g|svg)$/i.test(coverHint);
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/astro/index.js
var SEMANTIC_CHIP_VARIANTS = [
	"neutral",
	"success",
	"warning",
	"danger",
	"info"
];
var CATEGORICAL_CHIP_VARIANTS = [
	"cat-violet",
	"cat-teal",
	"cat-amber",
	"cat-rose",
	"cat-cyan"
];
var CHIP_VARIANTS = [...SEMANTIC_CHIP_VARIANTS, ...CATEGORICAL_CHIP_VARIANTS];
new Set(CHIP_VARIANTS);
var THEME_STORAGE_KEY = "tds-theme";
var THEME_ATTRIBUTE = "data-theme";
var themeBootstrapScript = `(function () {
  function apply(root) {
    try {
      var saved = localStorage.getItem("${THEME_STORAGE_KEY}");
      if (saved === "light" || saved === "dark") {
        root.setAttribute("${THEME_ATTRIBUTE}", saved);
        return;
      }
    } catch (e) { /* storage disabled \u2014 fall through to OS */ }
    var dark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("${THEME_ATTRIBUTE}", dark ? "dark" : "light");
  }
  apply(document.documentElement);
  document.addEventListener("astro:before-swap", function (event) {
    apply(event.newDocument.documentElement);
  });
})();`;
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://tracht-digital.de");
var $$Layout = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title, description = siteConfig.description.de, lang = "de", canonical, alternates, ogImage = siteConfig.defaultOgImage, noindex = false, jsonLd, bare = false } = Astro.props;
	const site = Astro.site?.origin ?? siteConfig.url;
	const url = canonical ?? new URL(Astro.url.pathname, site).toString();
	const ogImageAbs = ogImage.startsWith("http") ? ogImage : new URL(ogImage, site).toString();
	const ogLocale = lang === "de" ? "de_DE" : "en_GB";
	const altOgLocale = lang === "de" ? "en_GB" : "de_DE";
	const hidden = noindex || await isExcluded(Astro.url.pathname);
	const neutralPath = Astro.url.pathname.replace(/^\/en\/?/, "/") || "/";
	const absoluteUrl = (value) => value.startsWith("http") ? value : new URL(value, site).toString();
	const deAltUrl = alternates ? absoluteUrl(alternates.de) : new URL(neutralPath, site).toString();
	const enAltUrl = alternates ? absoluteUrl(alternates.en) : new URL(neutralPath === "/" ? "/en/" : `/en${neutralPath}`, site).toString();
	const showCookieNotice = !bare && await cookieBannerEnabled();
	return renderTemplate`<!-- data-surface selects the geometry layer from tds-shared's design
     library (surfaces/marketing.css): round pills, 6px lifted cards, the
     700 display voice. Do not author radii locally. --><html${addAttribute(lang, "lang")} data-surface="marketing"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro.generator, "content")}><meta name="theme-color" content="#050f68" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#0b0a07" media="(prefers-color-scheme: dark)"><script>${unescapeHTML(themeBootstrapScript)}<\/script>${hidden && renderTemplate`<meta name="robots" content="noindex,nofollow">`}<link rel="icon" type="image/png" href="/favicon.png" sizes="any"><link rel="canonical"${addAttribute(url, "href")}><!-- Resource hints — connect to the API origins we know we'll
         hit (the contact form on submit, the content API on every
         page that has a Journal section). \`preconnect\`
         opens the TLS handshake early; \`dns-prefetch\` is the cheap
         fallback for browsers that ignore preconnect on a different
         origin. --><link rel="preconnect" href="https://api.tracht-digital.de" crossorigin><link rel="dns-prefetch" href="https://api.tracht-digital.de"><link rel="preconnect" href="https://blog.tracht-digital.de" crossorigin><link rel="dns-prefetch" href="https://blog.tracht-digital.de"><!-- i18n alternates — only emitted when the page is indexable.
         Legal pages opt out of both search and hreflang. -->${!hidden && renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<link rel="alternate" hreflang="de"${addAttribute(deAltUrl, "href")}><link rel="alternate" hreflang="en"${addAttribute(enAltUrl, "href")}><link rel="alternate" hreflang="x-default"${addAttribute(deAltUrl, "href")}>` })}`}<!-- Cross-property: sibling blog at blog.tracht-digital.de --><link rel="alternate" type="application/rss+xml"${addAttribute(lang === "en" ? "Tracht Digital — Journal" : "Tracht Digital — Journal (Feed)", "title")}${addAttribute(`${siteConfig.blogUrl}/rss.xml`, "href")}><link rel="me"${addAttribute(siteConfig.blogUrl, "href")}><title>${title}</title><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(url, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(ogImageAbs, "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt"${addAttribute(title, "content")}><meta property="og:locale"${addAttribute(ogLocale, "content")}>${!hidden && renderTemplate`<meta property="og:locale:alternate"${addAttribute(altOgLocale, "content")}>`}<meta property="og:site_name"${addAttribute(siteConfig.name, "content")}><!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(ogImageAbs, "content")}>${jsonLd && renderTemplate`${renderComponent($$result, "JsonLd", $$JsonLd, { "data": jsonLd })}`}${renderSlot($$result, $$slots["head"])}${renderHead($$result)}</head><body><a href="#main" class="absolute -top-full left-0 z-50 px-6 py-3 bg-[var(--color-surface-navy)] text-white text-sm font-semibold focus:top-0 transition-all">Skip to content</a>${!bare && renderTemplate`${renderComponent($$result, "SmoothScroll", SmoothScroll, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "~/components/islands/SmoothScroll.tsx",
		"client:component-export": "default"
	})}`}${!bare && renderTemplate`${renderComponent($$result, "ScrollProgress", ScrollProgress, {
		"client:idle": true,
		"client:component-hydration": "idle",
		"client:component-path": "~/components/islands/ScrollProgress.tsx",
		"client:component-export": "default"
	})}`}${!bare && renderTemplate`${renderComponent($$result, "CustomCursor", CustomCursor, {
		"client:idle": true,
		"client:component-hydration": "idle",
		"client:component-path": "~/components/islands/CustomCursor.tsx",
		"client:component-export": "default"
	})}`}${renderSlot($$result, $$slots["default"])}${!bare && renderTemplate`${renderComponent($$result, "FloatingCta", $$FloatingCta, {})}`}${showCookieNotice && renderTemplate`${renderComponent($$result, "CookieNotice", CookieNotice, {
		"client:idle": true,
		"lang": lang,
		"privacyUrl": "/legal/datenschutz",
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "CookieNotice"
	})}`}${!bare && renderTemplate`${renderComponent($$result, "LiveChatCta", LiveChatCta, {
		"client:idle": true,
		"frontend": "landingpage",
		"lang": lang,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "LiveChatCta"
	})}`}${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts")}</body></html>`;
}, "/home/runner/work/tds-landingpage-frontend/tds-landingpage-frontend/src/layouts/Layout.astro", void 0);
//#endregion
export { hasPhotoCover as a, tFor as c, coverVariant as i, translations$1 as l, AbstractCover as n, localizePath as o, ThemeToggle as r, resolveLang as s, $$Layout as t, renderScript as u };
