import { BREAKPOINTS } from '../utils/constants';


const cursor = () => {
	const SELECTORS = {
		cursor: '.js-cursor',
		cursorScale: '.js-cursor-scale',
	};

	const $cursor = document.querySelector(SELECTORS.cursor);
	if (!$cursor) return;
	const $body = document.body;
	const isTouchscreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

	if (!isTouchscreen) {
		$cursor.style.opacity = '1';
	}

	let mm = gsap.matchMedia();
	mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
		gsap.set($cursor, {
			scale: 0.5,
		});

		const handleMouseMove = (e) => {
			const relativeX = e.clientX - 10;
			const relativeY = e.clientY - 10;

			gsap.to($cursor, 0.2, {
				x: relativeX,
				y: relativeY,
			});
		};

		const handleMouseEnter = (e) => {
			const $parentTarget = e.target.closest(SELECTORS.cursorScale);
			const $target = e.target.classList.contains(SELECTORS.cursorScale.slice(1));
			if ($target || $parentTarget) {
				gsap.to($cursor, {
					scale: 1,
				});
			}
		};

		const handleMouseLeave = (e) => {
			const $parentTarget = e.target.closest(SELECTORS.cursorScale);
			const $target = e.target.classList.contains(SELECTORS.cursorScale.slice(1));
			if ($target || $parentTarget) {
				gsap.to($cursor, {
					scale: 0.5,
				});
			}
		};

		$body.addEventListener('mousemove', handleMouseMove);
		$body.addEventListener('mouseover', handleMouseEnter);
		$body.addEventListener('mouseout', handleMouseLeave);
	});
};

export default cursor;
