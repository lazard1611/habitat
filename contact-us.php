<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Habitat</title>
    <?php include('_header.php') ?>
</head>
<body class="contact_us">
<?php include('_header-nav.php') ?>

<div class="cursor js-cursor"></div>
<div class="wrapper">
	<div class="wrapper_in">
		<main class="base">
			<section class="section contact">
				<div class="contact__wrap">
					<div class="contact__col_left js-fade-block">
						<form action="#" class="contact__form js-form">
							<h2 class="contact__title js-fade-el">What are you looking for?</h2>
							<div class="contact__choice js-fade-el">
								<div class="contact__choice_check">
									<div class="contact__choice_title">Services</div>
									<div class="form_checkbox">
										<label class="form_checkbox__block">
											<input class="form_checkbox__element" type="checkbox"/>
											<span class="form_checkbox__label">product design</span>
										</label>
									</div>
									<div class="form_checkbox">
										<label class="form_checkbox__block">
											<input
													class="form_checkbox__element"
													type="checkbox"
											/><span class="form_checkbox__label"
											>web design</span
											>
										</label>
									</div>
									<div class="form_checkbox">
										<label class="form_checkbox__block">
											<input
													class="form_checkbox__element"
													type="checkbox"
											/><span class="form_checkbox__label"
											>branding design</span
											>
										</label>
									</div>
									<div class="form_checkbox">
										<label class="form_checkbox__block">
											<input
													class="form_checkbox__element"
													type="checkbox"
											/><span class="form_checkbox__label"
											>all together or something else</span
											>
										</label>
									</div>
								</div>
								<div class="contact__choice_radio">
									<div class="contact__choice_title">Do you need assistance for</div>
									<div class="form_radio">
										<label class="form_radio__block">
											<input
													class="form_radio__element"
													type="radio"
													name="radio_1"
											/><span class="form_radio__label">a project from scratch</span>
										</label>
									</div>
									<div class="form_radio">
										<label class="form_radio__block">
											<input
													class="form_radio__element"
													type="radio"
													name="radio_1"
											/><span class="form_radio__label">an existing project</span>
										</label>
									</div>
								</div>
							</div>

							<div class="contact__input_block js-fade-el">

								<div class="form_input__wrap">
									<div class="form__row">
										<div class="form__col">
											<div class="form_input">
												<input
														type="text"
														class="form_input__element js-form-element"
														name="name"
														id="name">
												<label class="form_input__label" for="name">What’s your name?</label>
												<div class="form_input__messages">Oooops, that name looks a bit weird</div>
											</div>
										</div>
										<div class="form__col">
											<div class="form_input">
												<input
														type="email"
														class="form_input__element js-form-element"
														name="email"
														id="email">
												<label class="form_input__label" for="email">What’s your email?</label>
												<div class="form_input__messages">Oooops, that email address looks a bit weird</div>
											</div>
										</div>
									</div>
								</div>

								<div class="form_textarea">
									<div class="form_textarea__block">
										<textarea
												class="form_textarea__element js-form-element"
												name="details"
												id="details"
												autocomplete="off"
										>
									</textarea>
										<label class="form_textarea__label" for="details">Project details</label>
										<div class="form_input__messages"></div>
										<label class="form__file js-cursor-scale">
											<picture class="form__file_pic">
												<img class="form__file_img" src="assets/img/clip.svg" alt>
											</picture>
											<input class="js-form-file" type="file" name="file">
										</label>
									</div>

									<div class="form__file_info js-form-file-info"></div>
								</div>
							</div>
							<button class="btn__decor_v2 js-cursor-scale js-fade-el" type="submit">
								<span>Submit</span>
							</button>
						</form>
					</div>
					<div class="contact__col_right js-fade-block">
						<h1 class="contact__title js-fade-el">Contact us</h1>
						<div class="contact__office_wrap js-fade-el">
							<div class="contact__mail_wrap">
								<div class="contact__mail_link">
									<a href="mailto:hello@hbtat.agency" class="contact__mail js-cursor-scale">hello@hbtat.agency</a>
								</div>
							</div>
							<div class="contact__office_bottom">
								<h3>Offices</h3>
								<div class="contact__office">
									<h4>Rivne, Ukraine</h4>
									<p>16 July 42, 33028</p>
								</div>
								<div class="contact__office">
									<h4>Amsterdam, Netherlands</h4>
									<p>Johan Huizingalaan 763a, 1066 VH </p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
		<footer class="footer">
			<div class="footer__bottom">
				<div class="footer__row">
					<div class="footer__col_left">
						<div class="footer__link_wrap">
							<a class="js-cursor-scale" href="#">hello@hbtat.agency</a>
						</div>
						<small>Legal Information</small>
					</div>
					<div class="footer__col_right">
						<ul class="footer__list">
							<li><a class="js-cursor-scale" href="#">Medium</a></li>
							<li><a class="js-cursor-scale" href="#">Behance</a></li>
							<li><a class="js-cursor-scale" href="#">Dribble</a></li>
						</ul>
						<ul class="footer__list">
							<li><a class="js-cursor-scale" href="#" target="_blank">Clutch</a></li>
							<li><a class="js-cursor-scale" href="#" target="_blank">Instagram</a></li>
							<li><a class="js-cursor-scale" href="#" target="_blank">Linked In</a></li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	</div>
</div>
<?php include('_scripts.php') ?>
</body>
</html>
