const urlapi = require('url');
const siteUrl = 'https://wecreateclarity.com/', // example `http://my-site.com/`
	themeName = 'clarity'; // put WP theme name, example `project-name`
const URL = urlapi.parse(siteUrl);

module.exports = {
	proxy: siteUrl,
	files: ["/assets/css/app.min.css", "/assets/js/app.min.js"],
	serveStatic: ["./"],
	rewriteRules: [
		{
			match: new RegExp(URL.path.substr(1) + "wp-content/themes/" + themeName + "/frontend/assets/css/app.min.css"), // put correct name for css file
			fn: function () {
				return "./assets/css/app.min.css"
			}
		},
		{
			match: new RegExp(URL.path.substr(1) + "wp-content/themes/" + themeName + "/frontend/assets/js/app.min.js"), // put correct name for js file
			fn: function () {
				return "./assets/js/app.min.js"
			}
		}
	],
	mode: 'development',
	watch: true
};
