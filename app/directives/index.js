[
    "menu/menu",
    "menu/menuItem",
    "profileImage/profileImage",
	"dropdown/dropdown",
	"checkbox/checkbox",
	"text/text",
    "modal/modal",
    "time",
    "calendar/calendar"
].forEach(function(location) {
	require("directives/" + location);
})