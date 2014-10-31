module.exports.config = {
    files: {
        javascripts: {
            joinTo: {
                "js/app.js": /^app/,
                "js/vendor.js": /^(?!app)/
            },
			order: {
				before: [
					"dist/jquery.js"
				]
			}
        },

        stylesheets: {
            joinTo: "css/app.css"
        },

        templates: {
            joinTo: "js/app.js"
        }
    },
    server: {
        port: 3334
    }
};