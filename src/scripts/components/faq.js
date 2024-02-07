import Accordion from './accordion';
import { BREAKPOINTS } from '../utils/constants';

const faq = () => {
	const acc = new Accordion({
		triggers: document.querySelectorAll('.accordion__item_head'),
		activeStateName: 'accordion__item--active-mod',
	}).init();

	const SELECTORS = {
		section: '.js-faq-section',
		item: '.js-faq-item',
	};
	let initScript = true;

	const $sections = document.querySelectorAll(SELECTORS.section);
	if (!$sections.length) return;

	$sections.forEach(($section) => {
		const $items = $section.querySelectorAll(SELECTORS.item);
		if (!$items.length) return;
		const tl = gsap.timeline({
			paused: true,
		});
		let isClick = false;

		gsap.registerPlugin(ScrollTrigger);

		let mm = gsap.matchMedia();
		mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
			if (!initScript) return;
			ScrollTrigger.create({
				scroller: '.wrapper_in',
				trigger: $section,
				start: 'top 70%',
				end: 'bottom 70%',
				// markers: true,
				animation: tl,
			});

			tl.fromTo(
				$items,
				{
					y: 100,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					stagger: 0.4,
				},
			);
		});
		initScript = false;
	});
};

export default faq;
