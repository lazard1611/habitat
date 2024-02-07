const ourCapabilities = () => {
	const SELECTORS = {
		section: '.js-our-capabilities-section',
		flash: '.js-flashlight-bg',
	};

	const $sections = document.querySelectorAll(SELECTORS.section);
	if (!$sections.length) return;

	$sections.forEach(($section) => {
		const $flashlight = $section.querySelector(SELECTORS.flash);
		if (!$flashlight) return;

		const handleMouseMove = (e) => {
			const sectionRect = $section.getBoundingClientRect();
			const relativeX = ((e.clientX - sectionRect.left) / $section.clientWidth) * 100;
			const relativeY = ((e.clientY - sectionRect.top) / $section.clientHeight) * 100;

			$flashlight.style.background = `radial-gradient(circle 25rem at ${relativeX}% ${relativeY}%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%`;
		};

		const handleMouseLeave = () => {
			$flashlight.style.background = 'rgba(0, 0, 0, 0.5)';
		};

		$section.addEventListener('mousemove', handleMouseMove);
		$section.addEventListener('mouseleave', handleMouseLeave);
	});
};

export default ourCapabilities;
