import { BREAKPOINTS, loadScript } from '../utils/constants';

const projects = () => {
	const SELECTORS = {
		section: '.js-projects-section',
		list: '.js-projects-list',
		item: '.js-item-projects',
		subtitle: '.js-projects-subtitle',
		title: '.js-projects-title',
		label: '.js-projects-label',
	};

	let loadScript = true;

	gsap.registerPlugin(ScrollTrigger, SplitText);
	const $sections = document.querySelectorAll(SELECTORS.section);
	if (!$sections.length) return;

	$sections.forEach(($section) => {
		const $list = $section.querySelector(SELECTORS.list);
		if (!$list) return;
		const $items = $section.querySelectorAll(SELECTORS.item);
		if (!$list) return;
		// console.log($items);

		$items.forEach(($item, index) => {

			let mm = gsap.matchMedia();
			mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
				if (!loadScript) {
					return;
				} else {
					gsap.set($item, {opacity: 1});
				}
				const tl = gsap.timeline({
					paused: true,
				});

				ScrollTrigger.create({
					trigger: $item,
					// start: `top ${$section.offsetTop}+=30`,
					start: 'top 90%',
					end: 'bottom center',
					scroller: '.wrapper_in',
					// markers: true,
					animation: tl,
				});

				tl.fromTo(
					$item,
					{
						opacity: 0,
						y: 100,
					},
					{
						stagger: 0.6,
						opacity: 1,
						duration: 0.8,
						y: 0,
					},
				);

				const $subtitle = $item.querySelector(SELECTORS.subtitle);
				if (!$subtitle) return;
				const $title = $item.querySelector(SELECTORS.title);
				if (!$title) return;
				const $label = $item.querySelector(SELECTORS.label);
				if (!$label) return;
				const $img = $item.querySelector('img');
				if (!$img) return;
				const $parentNode = $subtitle.parentElement;
				const tlContent = gsap.timeline({
					paused: true,
				});

				const splitTitle = new SplitText($title, {
					type: 'words',
					linesClass: 'split-line',
				});
				const { words } = splitTitle;
				const allDone = () => {
					splitTitle.revert();
				};

				ScrollTrigger.create({
					trigger: $parentNode,
					start: 'top 95%',
					end: 'bottom center',
					scroller: '.wrapper_in',
					// markers: true,
					animation: tlContent,
				});

				tlContent
					.fromTo(
						$subtitle,
						{
							y: 50,
							opacity: 0,
						},
						{
							y: 0,
							opacity: 1,
						},
						'start_1',
					)
					.fromTo(
						words,
						{
							y: 50,
							opacity: 0,
						},
						{
							y: 0,
							opacity: 1,
							stagger: 0.1,
						},
						'start_1',
					)
					.fromTo(
						$label,
						{
							y: $label.clientHeight,
							opacity: 0,
						},
						{
							y: 0,
							opacity: 1,
							stagger: 0.1,
						},
					);
				// Parallax
				gsap.fromTo(
					$img,
					{
						yPercent: -5,
						ease: "none",
					},
					{
						scrollTrigger: {
							trigger: $img,
							scroller: '.wrapper_in',
							start: "top bottom",
							end: "bottom top",
							scrub: 1
						},
						yPercent: 5,
						ease: "none",
					}
				);
			});
		});

		loadScript = false;
	});
};

export default projects;
