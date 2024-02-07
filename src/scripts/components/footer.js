import { scroll, globalUpdate } from './smooth-animation';
import { BREAKPOINTS } from '../utils/constants';
import {onWindowResize} from "../utils";

const footer = () => {
	const SELECTORS = {
		title: '.js-title-split',
	};

	const CLASSES = {
		bodyClass: 'body--and_anim_state',
	};

	const $body = document.body;
	let isInitTitle = true;
	let mm = gsap.matchMedia();

	const $footer = document.querySelector('footer');
	if (!$footer) return;
	const $footerChild = $footer.children;
	if (!$footerChild) return;
	const $title = $footer.querySelector(SELECTORS.title);
	if (!$title) return;

	const splitTitle = new SplitText($title, {
		type: 'lines,words,chars',
		linesClass: 'split-line',
	});

	mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
		// globalUpdate();
		gsap.registerPlugin(ScrollTrigger, SplitText);
		scroll.update();

		const splitTitle = new SplitText($title, {
			type: 'lines,words,chars',
			linesClass: 'split-line',
		});

		const { chars } = splitTitle;

		const tl = gsap.timeline({
			paused: true,
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
			onLeave: () => {
				$body.classList.add(CLASSES.bodyClass);
			},
			onEnterBack: () => {
				$body.classList.remove(CLASSES.bodyClass);
			},
			onUpdate: (self) => {
				if (self.progress > 0.4 && isInitTitle) {
					animTitle();
					isInitTitle = false;
				}
			},
		});

		gsap.set(chars, { y: 200 });
		const animTitle = () => {
			// console.log('init anim');
			gsap.to(
				chars,
				{
					opacity: 1,
					duration: 0.4,
					// delay: 0.2,
					ease: 'circ',
					y: 0,
					stagger: 0.02,
				}, 'start'
			);
		}

		tl.addLabel('start')
			.fromTo(
				$footer,
				{
					yPercent: -100,
				},
				{
					yPercent: 0,
					ease: 'none',
				},
				'start'
			)
			.fromTo(
				$footerChild,
				{
					opacity: 0.1,
					y: 300,
				},
				{
					opacity: 1,
					y: 0,
					ease: 'power1',
				},
				'start'
			)
	});

	mm.add(`(max-width: ${BREAKPOINTS.mediaPoint1 - 1}px)`, () => {
		// scroll.update();
		gsap.registerPlugin(ScrollTrigger);

		ScrollTrigger.create({
			scroller: '.wrapper_in',
			trigger: $footer,
			start: 'top top+=40',
			end: 'bottom bottom',
			// markers: true,
			onEnter: () => {
				$body.classList.add(CLASSES.bodyClass);
			},
			onLeaveBack: () => {
				$body.classList.remove(CLASSES.bodyClass);
			},
		});
	})

	onWindowResize(() => {
		isInitTitle = true;
		// globalUpdate();
	});
};

export default footer;
