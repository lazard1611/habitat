import { BREAKPOINTS } from '../utils/constants';

const gallery = () => {
	const SELECTORS = {
		section: '.js-gallery-section',
		item: '.js-gallery-item',
	};

	let initScript = true;

	const $sections = document.querySelectorAll(SELECTORS.section);
	if (!$sections.length) return;

	$sections.forEach(($section) => {
		const $items = $section.querySelectorAll(SELECTORS.item);
		if (!$items.length) return;

		gsap.registerPlugin(ScrollTrigger);

		let mm = gsap.matchMedia();
		mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
			if (!initScript) return;

			const tl = gsap.timeline({
				paused: true,
			});

			ScrollTrigger.create({
				scroller: '.wrapper_in',
				trigger: $section,
				start: 'top center',
				end: 'bottom center',
				// markers: true,
				animation: tl,
			});

			tl.fromTo(
				$items,
				{
					scale: 0,
				},
				{
					scale: 1,
					stagger: 0.1,
				},
			);
		});
	});
	initScript = false;
};

export default gallery;
