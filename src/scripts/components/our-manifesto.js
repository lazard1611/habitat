import { BREAKPOINTS } from '../utils/constants';
import { getWindowSize, onWindowResize } from '../utils';

const ourManifesto = () => {
	const SELECTORS = {
		section: '.js-our-manifesto-section',
		item: '.js-our-manifesto-item',
	};

	const CLASSES = {
		activeState: 'our_manifesto__item--active_state',
		activePicState: 'our_manifesto__pic--active_state',
	};

	const $sections = document.querySelectorAll(SELECTORS.section);
	if (!$sections.length) return;

	const addActiveState = (item) => {
		if (!item.classList.contains(CLASSES.activeState)) {
			item.classList.add(CLASSES.activeState);
		}
	};

	const removeActiveState = (item) => {
		if (item.classList.contains(CLASSES.activeState)) {
			item.classList.remove(CLASSES.activeState);
		}
	};

	let loadScript = true;

	$sections.forEach(($section) => {
		const $items = $section.querySelectorAll(SELECTORS.item);
		if (!$items.length) return;

		gsap.registerPlugin(TweenMax, ScrollTrigger);

		let mm = gsap.matchMedia();
		mm.add('(min-width: 1201px)', () => {
			if (!loadScript) return;
			const getMousePos = (e) => {
				let posx = 0;
				let posy = 0;
				if (!e) e = window.event;
				if (e.pageX || e.pageY) {
					posx = e.pageX;
					posy = e.pageY;
				}
				else if (e.clientX || e.clientY) 	{
					posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}
				return { x : posx, y : posy }
			}

			class HoverImgFx3 {
				constructor(el) {
					this.DOM = {el: el};
					this.DOM.reveal = document.createElement('div');
					this.DOM.reveal.className = 'hover-reveal';
					this.DOM.reveal.style.overflow = 'hidden';

					if(this.DOM.el.dataset.text) {
						this.DOM.reveal.innerHTML = `<div class="hover-reveal__inner">
						<div class="hover-reveal__img" style="background-image:url(${this.DOM.el.dataset.img})"></div>
							<div class="hover-reveal__text">${this.DOM.el.dataset.text}</div>
						</div>
						`;
					} else {
						this.DOM.reveal.innerHTML = `<div class="hover-reveal__inner"><div class="hover-reveal__img" style="background-image:url(${this.DOM.el.dataset.img})"></div></div>`;
					}
					this.DOM.el.appendChild(this.DOM.reveal);
					this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
					this.DOM.revealInner.style.overflow = 'hidden';
					this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');
					this.initEvents();
				}
				initEvents() {
					this.positionElement = (ev) => {
						const mousePos = getMousePos(ev);
						const parentRect = this.DOM.el.getBoundingClientRect();
						const docScrolls = {
							left: document.body.scrollLeft + document.documentElement.scrollLeft,
							top: document.body.scrollTop + document.documentElement.scrollTop
						};
						this.DOM.reveal.style.top = `${mousePos.y - parentRect.top + docScrolls.top + 20}px`;
						this.DOM.reveal.style.left = `${mousePos.x - parentRect.left + docScrolls.left + 20}px`;
					};
					this.mouseenterFn = (ev) => {
						this.positionElement(ev);
						this.showImage();
					};
					this.mousemoveFn = ev => requestAnimationFrame(() => {
						this.positionElement(ev);
					});
					this.mouseleaveFn = () => {
						this.hideImage();
					};

					this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
					this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
					this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
				}
				showImage() {
					TweenMax.killTweensOf(this.DOM.revealInner);
					TweenMax.killTweensOf(this.DOM.revealImg);

					this.tl = new TimelineMax({
						onStart: () => {
							this.DOM.reveal.style.opacity = 1;
							TweenMax.set(this.DOM.el, {zIndex: 1000});
						}
					})
						.add('begin')
						.set([this.DOM.revealInner, this.DOM.revealImg], {transformOrigin: '50% 100%'})
						.add(new TweenMax(this.DOM.revealInner, 0.4, {
							ease: Expo.easeOut,
							startAt: {x: '50%', y: '120%', rotation: 50},
							x: '0%',
							y: '0%',
							rotation: 0
						}), 'begin')
						.add(new TweenMax(this.DOM.revealImg, 0.4, {
							ease: Expo.easeOut,
							startAt: {x: '-50%', y: '-120%', rotation: -50},
							x: '0%',
							y: '0%',
							rotation: 0
						}), 'begin')
						.add(new TweenMax(this.DOM.revealImg, 0.7, {
							ease: Expo.easeOut,
							startAt: {scale: 2},
							scale: 1
						}), 'begin');
				}
				hideImage() {
					TweenMax.killTweensOf(this.DOM.revealInner);
					TweenMax.killTweensOf(this.DOM.revealImg);

					this.tl = new TimelineMax({
						onStart: () => {
							TweenMax.set(this.DOM.el, {zIndex: 999});
						},
						onComplete: () => {
							TweenMax.set(this.DOM.el, {zIndex: ''});
							TweenMax.set(this.DOM.reveal, {opacity: 0});
						}
					})
						.add('begin')
						.add(new TweenMax(this.DOM.revealInner, 0.6, {
							ease: Expo.easeOut,
							y: '-120%',
							rotation: -5
						}), 'begin')
						.add(new TweenMax(this.DOM.revealImg, 0.6, {
							ease: Expo.easeOut,
							y: '120%',
							rotation: 5,
							scale: 1.2
						}), 'begin')
				}
			}

			$items.forEach(($item) => new HoverImgFx3($item));
		});

		loadScript = false;

		$items.forEach(($item, index) => {
			ScrollTrigger.create({
				scroller: '.wrapper_in',
				trigger: $item,
				start: 'top center',
				end: 'bottom center',
				// markers: true,
				onEnter: () => {
					addActiveState($item);
				},
				onEnterBack: () => {
					addActiveState($item);
				},
				onLeave: () => {
					if (index !== $items.length - 1) {
						removeActiveState($item);
					}
				},
				onLeaveBack: () => {
					if (index !== 0) {
						removeActiveState($item);
					}
				},
			});
		});
	});
};

export default ourManifesto;
