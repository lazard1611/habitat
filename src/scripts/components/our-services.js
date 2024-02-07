import { BREAKPOINTS } from '../utils/constants';
import {onWindowResize} from "../utils";
import { scroll } from "./smooth-animation";

const ourServices = () => {
	const SELECTORS = {
		section: '.js-our-services-section',
		item: '.js-our-services-item',
		content: '.js-our-services-content',
		picture: '.js-our-services-picture',
	};

	const $sections = document.querySelectorAll(SELECTORS.section);
	if (!$sections.length) return;
	const slideTriggers = [];

	$sections.forEach(($section) => {
		const $items = $section.querySelectorAll(SELECTORS.item);
		if (!$items.length) return;
		const $itemsLength = $items.length;
		const contentHeightArr = [];

		let mm = gsap.matchMedia();
		mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
			gsap.registerPlugin(ScrollTrigger);

			const opacityContent = 0.4;

			const entranceAnimation = (index, content, picture, nextContent, nextPicture) => {
				const tl = gsap.timeline();
				let contentWidth;
				let pictureWidth;

				onWindowResize(() => {
					contentWidth = content.clientWidth;
					pictureWidth = picture.clientWidth;
				});

				if (index !== $items.length - 1) {
					tl.addLabel(`content_${index}`)
						.fromTo(
							content,
							{
								opacity: 1,
							},
							{
								opacity: 0,
							},
							`content_${index}`,
						)
						.fromTo(
							nextContent,
							{
								opacity: opacityContent,
								x: contentWidth + 390,
							},
							{
								opacity: 1,
								x: 0,
							},
							`content_${index}`,
						)
						.fromTo(
							nextPicture,
							{
								x: pictureWidth + 2,
							},
							{
								x: 0,
								delay: 0.2,
							},
							`content_${index}`,
						)
						.to(picture, {
							opacity: 0,
						});
				}
				if ($items[index + 2]) {
					tl.fromTo(
						$items[index + 2],
						{
							opacity: 0,
						},
						{
							opacity: 1,
						},
						`content_${index}`,
					);
				}
			};

			const exitAnimation = (index, content, picture, nextContent, nextPicture) => {
				const tl = gsap.timeline();
				let contentWidth;
				let pictureWidth;

				onWindowResize(() => {
					contentWidth = content.clientWidth;
					pictureWidth = picture.clientWidth;
				});

				if (index !== $items.length - 1) {
					tl.addLabel(`content_${index}`)
						.fromTo(
							content,
							{
								opacity: 0,
							},
							{
								duration: 1,
								opacity: 1,
							},
							`content_${index}`,
						)
						.fromTo(
							nextContent,
							{
								opacity: 0,
								x: 0,
							},
							{
								opacity: opacityContent,
								x: contentWidth + 390,
							},
							`content_${index}`,
						)
						.to(
							picture,
							{
								opacity: 1,
							},
							`content_${index}`,
						)
						.fromTo(
							nextPicture,
							{
								x: 0,
							},
							{
								x: pictureWidth + 2,
								delay: 0.2,
							},
							`content_${index}`,
						);
				}
				if ($items[index + 2]) {
					tl.fromTo(
						$items[index + 2],
						{
							opacity: opacityContent,
						},
						{
							opacity: 0,
						},
						`content_${index}`,
					);
				}
			};

			const getContentHeightVal = () => {
				$items.forEach(($item) => {
					const $content = $item.querySelector(SELECTORS.content);
					const contentHeight = $content.clientHeight;
					contentHeightArr.push(contentHeight);
				});
			};
			getContentHeightVal();

			const maxValueHeightContent = contentHeightArr.reduce((acc, item) => {
					if (acc < item) {
						return item;
					} else {
						return acc;
					}
				}, 0);

			$items.forEach(($item, index) => {
				const $content = $item.querySelector(SELECTORS.content);
				if (!$content) return;
				const $picture = $item.querySelector(SELECTORS.picture);
				if (!$picture) return;
				const contentWidth = $content.clientWidth;
				const pictureWidth = $picture.clientWidth;

				if (index !== 0) {
					gsap.set($content, {
						x: contentWidth + 390,
						opacity: opacityContent,
					});
					gsap.set($picture, {
						x: pictureWidth + 2,
					});
				} else {
					gsap.set($content, { opacity: 1});
					gsap.set($picture, {opacity: 1});
				}

				$content.style.height = `${maxValueHeightContent}px`;

				const $nextEl = $item.nextElementSibling;
				if (!$nextEl) return;
				const $nextElContent = $nextEl.querySelector(SELECTORS.content);
				const $nextElPicture = $nextEl.querySelector(SELECTORS.picture);

				slideTriggers[index] = ScrollTrigger.create({
					scroller: '.wrapper_in',
					trigger: $item,
					// markers: true,
					start: () => `${window.innerHeight / 2 + window.innerHeight * index * 0.6} top`,
					end: () => `+=${window.innerHeight}`,
					onEnter: () => {
						entranceAnimation(index, $content, $picture, $nextElContent, $nextElPicture);
					},
					onLeaveBack: () => {
						exitAnimation(index, $content, $picture, $nextElContent, $nextElPicture);
					},
				});
			});

			ScrollTrigger.create({
				scroller: '.wrapper_in',
				trigger: $section,
				start: 'top top',
				end: `+=${($itemsLength - 1) * window.innerHeight}`,
				pin: true,
				scrub: 1,
				// markers: true,
				invalidateOnRefresh: true,
			});
		});

		mm.add(`(max-width: ${BREAKPOINTS.mediaPoint1 - 1}px)`, () => {
			$items.forEach(($item, index) => {
				const $content = $item.querySelector(SELECTORS.content);
				if (!$content) return;
				const $picture = $item.querySelector(SELECTORS.picture);
				if (!$picture) return;
				gsap.set($content, { opacity: 1});
				gsap.set($picture, {opacity: 1});
				gsap.set($item, {opacity: 1});
				$content.style.height = 'auto';
			});
		});
	});

	onWindowResize(() => scroll.update());
};

export default ourServices;
