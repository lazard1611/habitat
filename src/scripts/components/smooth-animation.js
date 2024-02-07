import LocomotiveScroll from 'locomotive-scroll';
import { onWindowResize } from '../utils';

const SELECTORS = {
	wrapper: '.wrapper',
	content: '.wrapper_in',
};

gsap.registerPlugin(ScrollTrigger, SplitText);

const $content = document.querySelector(SELECTORS.content);

export const scroll = new LocomotiveScroll({
	el: $content,
	smooth: true,
	tablet: {
		smooth: true,
		// breakpoint: BREAKPOINTS.mediaPoint1,
	},
	getSpeed: true,
	multiplier: 0.8,
	firefoxMultiplier: 80
});

const smoothAnimation = () => {

	scroll.on("scroll", ScrollTrigger.update);

	ScrollTrigger.scrollerProxy($content, {
		scrollTop(value) {
			return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
		},
		getBoundingClientRect() {
			return {
				top: 0,
				left: 0,
				width: window.innerWidth,
				height: window.innerHeight,
			};
		},
		pinType: $content.style.transform ? "transform" : "fixed",
	});

	ScrollTrigger.addEventListener("refresh", () => scroll.update());
	ScrollTrigger.refresh();
};

export const globalUpdate = () => {
	scroll.update();
	ScrollTrigger.addEventListener("refresh", () => scroll.update());
	ScrollTrigger.refresh();
}

onWindowResize(() =>
{
	// console.log('resize');
	globalUpdate();
});

export default smoothAnimation;
