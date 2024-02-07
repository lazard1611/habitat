import { BREAKPOINTS } from '../utils/constants';

const awards = () => {
	const SELECTORS = {
		section: '.js-awards-section',
		item: '.js-awards-item',
	};

	const $sections = document.querySelectorAll(SELECTORS.section);
	if (!$sections.length) return;
	let initScript = true;

	$sections.forEach(($section) => {
		const $items = $section.querySelectorAll(SELECTORS.item);
		if (!$items.length) return;
		let mm = gsap.matchMedia();
		mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
			if (!initScript) return;
			const tl = gsap.timeline({
				paused: true,
			});

			gsap.registerPlugin(ScrollTrigger);

			ScrollTrigger.create({
				scroller: '.wrapper_in',
				trigger: $section,
				start: 'top 75%',
				end: 'bottom 75%',
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

export default awards;
