import { BREAKPOINTS } from '../utils/constants';

const contactAnim = () => {
    const SELECTORS = {
        section: '.contact',
        fadeBlock: '.js-fade-block',
        fadeElem: '.js-fade-el',
    }

    const $section = document.querySelector(SELECTORS.section);
    if (!$section) return;
    const $fadeBlocks = $section.querySelectorAll(SELECTORS.fadeBlock);
    if (!$fadeBlocks.length) return;

    let mm = gsap.matchMedia();
    mm.add(`(min-width: ${BREAKPOINTS.mediaPoint1}px)`, () => {
        $fadeBlocks.forEach(($fadeBlock) => {
            const $fadeEl = $fadeBlock.querySelectorAll(SELECTORS.fadeElem);
            if (!$fadeEl.length) return;

            gsap.fromTo(
                $fadeEl,
                {
                    opacity: 0,
                    y: 100,
                },
                {
                    duration: 0.5,
                    stagger: 0.5,
                    opacity: 1,
                    y: 0,
                });
        });
    });
};

export default contactAnim;
