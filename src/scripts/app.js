import { pageLoad } from './utils/utils';
import preloader from './components/preloader';
import header from './components/header';
import cursor from './components/cursor';
import smoothAnimation from './components/smooth-animation';
import animationTitle from './components/animation-title';
import hero from './components/hero';
import projects from './components/projects';
import logos from './components/logos';
import team from './components/team';
import ourServices from './components/our-services';
import ourCapabilities from './components/our-capabilities';
import ourManifesto from './components/our-manifesto';
import gallery from './components/gallery';
import awards from './components/awards';
import faq from './components/faq';
import footer from './components/footer';
import contact from './components/contact';
import contactAnim from './components/contact-animation';

pageLoad(() => {
    preloader();
    header();
    cursor();
    smoothAnimation();
    animationTitle();
    hero();
    logos();
    team();
    ourServices();
    ourCapabilities();
    ourManifesto();
    gallery();
    awards();
    faq();
    footer();
    contact();
    contactAnim();
});


//If you really need Jquery
/*
$(document).ready(function(){

})
 */
