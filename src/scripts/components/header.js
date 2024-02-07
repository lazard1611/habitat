import { scroll, globalUpdate } from './smooth-animation';
import { onWindowScroll, exist, onWindowResize } from '../utils/index';
import { BREAKPOINTS } from '../utils/constants';

const header = () => {
	const CLASSNAMES = {
		bodyOpenMenuState: 'body--open_menu_state',
		headerScrollState: 'header--scroll_state',
		headerScrollPos: 'header--pos_state',
	};

	const $header = document.querySelector('header');

	let prevScrollPos = window.pageYOffset;

	const headerScroll = (windowScrollTop) => {
		let scrollPosition = windowScrollTop && windowScrollTop.scroll && windowScrollTop.scroll.y ? windowScrollTop.scroll.y : 0;

		if (scrollPosition > 10 && !$header.classList.contains(CLASSNAMES.headerScrollState)) {
			$header.classList.add(CLASSNAMES.headerScrollState);
		} else if (scrollPosition <= 10 && $header.classList.contains(CLASSNAMES.headerScrollState)) {
			$header.classList.remove(CLASSNAMES.headerScrollState);
		}

		if (scrollPosition > prevScrollPos) {
			$header.classList.add(CLASSNAMES.headerScrollPos);
		} else {
			$header.classList.remove(CLASSNAMES.headerScrollPos);
		}

		prevScrollPos = scrollPosition;
	};

	scroll.on('scroll', (e) => {
		headerScroll(e);
	});

	if (!exist($header)) return;

	onWindowScroll(headerScroll);

	onWindowResize(() => scroll.update());
};

export default header;
