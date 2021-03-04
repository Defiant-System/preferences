
// parts.general

{
	dispatch(event) {
		let Self = parts.general,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
			case "select-ui-theme":
				el = $(event.target);

				// indicate active theme
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// execute shell command
				defiant.shell(`sys -o ${el.data("arg")}`);
				break;
		}
	}
}
