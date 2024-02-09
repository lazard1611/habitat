import { scroll } from './smooth-animation';
import { CustomEase } from '../../../assets/libs/CustomEase';
import { BREAKPOINTS } from '../utils/constants';
import { tlHero } from './hero';
import projects from './projects';

const preloader = () => {
	const SELECTORS = {
		item: '.js-preload-item',
		preloadMob: '.js-preload-mob',
	};

	const CLASSES = {
		activeState: 'body--preload',
	};

	let preloaderEnable = true;

	gsap.registerPlugin(CustomEase);

	const $items = document.querySelectorAll(SELECTORS.item);
	if (!$items.length) return;
	const $preloadMob = document.querySelector(SELECTORS.preloadMob);
	const srcArr = [];
	const $body = document.body;
	let mm = gsap.matchMedia();

	$preloadMob.style.opacity = '0';

	const scrollDisable = () => {
		scroll.stop();
	};
	scrollDisable();

	const scrollEnable = () => {
		scroll.start();
	};

	const removeClass = () => {
		if ($body.classList.contains(CLASSES.activeState)) {
			$body.classList.remove(CLASSES.activeState);
		}
	};

	// const setDisableOpacityBody = () => {
	// 	$body.style.opacity = '0';
	// };
	// setDisableOpacityBody();

	const setEnableOpacityBody = () => {
		$body.style.opacity = '1';
	};

	const createImg = (src, index) => {
		const img = document.createElement('img');
		img.setAttribute('src', src);
		img.setAttribute('alt', `Image ${index + 1}`);
		return img;
	};

	$items.forEach(($item, index) => {
		const srcForImg = $item.getAttribute('data-src');
		if (!srcForImg) return;
		srcArr.push(srcForImg);
	});

	const shuffledImages = srcArr.sort(() => Math.random() - 0.5);

	const selectedImages = shuffledImages.slice(0, 3);

	selectedImages.forEach((src, index) => {
		const $item = $items[index];
		let img = createImg(src, index);
		$item.appendChild(img);
	});

	const deleteEmpItems = (item) => {
		if (!item.querySelector('img')) {
			item.remove();
		}
	};

	$items.forEach(($item, index) => {
		deleteEmpItems($item);
	});

	mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
		if (!preloaderEnable) return;
		const tl = gsap.timeline({
			delay: 1,
		});

		const easeCustom = CustomEase.create(
			'custom',
			'M0,0 C0,0 0.514,0.082 0.596,0.158 0.788,0.336 0.8,0.393 0.888,0.67 0.934,0.816 0.924,0.875 0.942,0.936 0.96,1 1,1 1,1',
		);

		const $newItems = document.querySelectorAll(SELECTORS.item);
		if (!$newItems.length) return;
		const $newItemsReverse = [...$newItems].reverse();
		const setOpacityItem = () => {
			gsap.set($newItemsReverse, {opacity: 1});
		};

		tl.to($newItemsReverse, {
			stagger: 1.2,
			duration: 0.8,
			yPercent: -100,
			ease: easeCustom,
			onStart: () => {
				setOpacityItem();
				setEnableOpacityBody();
			},
			onComplete: () => {
				tlHero.play();
				projects();
				setTimeout(() => {
					removeClass();
					scrollEnable();
				}, 1000);
			},
		});

	});
	mm.add(`(max-width: ${BREAKPOINTS.mediaPoint1 - 1}px)`, () => {
		if (!preloaderEnable) return;
		const setOpacityItemMob = () => {
			gsap.to($preloadMob, {opacity: 0});
		};

		if ($preloadMob && preloaderEnable) {
			gsap.to($preloadMob, {
				duration: 3,
				onStart: () => {
					setEnableOpacityBody();
					$preloadMob.style.opacity = '1';
				},
				onComplete: () => {
					tlHero.play();
					projects();
					setTimeout(() => {
						setOpacityItemMob();
						removeClass();
						scrollEnable();
					}, 500);
				},
			});
		} else {
			setEnableOpacityBody();
			setOpacityItemMob();
		}
	});
	preloaderEnable = false;
};

export default preloader;
