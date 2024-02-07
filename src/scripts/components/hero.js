import { BREAKPOINTS } from '../utils/constants';
import { onWindowResize } from '../utils';

export let tlHero = gsap.timeline({
	paused: true,
});

const hero = () => {
	const SELECTORS = {
		section: '.js-hero-section',
		title: '.js-hero-title',
		text: '.js-hero-description',
	};

	const $sections = document.querySelectorAll(SELECTORS.section);
	if (!$sections.length) return;
	let isScriptComplete = false;

	$sections.forEach(($section) => {
		const $title = $section.querySelector(SELECTORS.title);
		if (!$title) return;
		const $text = $section.querySelector(SELECTORS.text);
		if (!$text) return;

		const splitTitle = new SplitText($title, {
			type: 'words, chars',
			linesClass: 'split-line',
		});
		const { chars, words } = splitTitle;
		if (!chars) return;
		const allDone = () => {
			splitTitle.revert();
		};

		let mm = gsap.matchMedia();
		mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
			if (isScriptComplete) return;
			gsap.set(words, { overflow: 'hidden' });

			tlHero.fromTo(
				chars,
				{
					y: 200,
				},
				{
					opacity: 1,
					duration: 0.4,
					ease: 'circ',
					y: 0,
					stagger: 0.02,
				},
			)
				.fromTo(
					$text,
					{
						y: $text.clientHeight,
						opacity: 0,
					},
					{
						duration: 0.7,
						y: 0,
						opacity: 1,
					},
				)

			// .call(() => {
			// 	allDone();
			// });
		});
		isScriptComplete = true;
	});
};

export default hero;
