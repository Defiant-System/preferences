
// parts.dateTime

{
	dispatch(event) {
		let self = parts.dateTime,
			isLocked,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;

				// temp
				self.section.find(".tab-row_ > div:nth-child(2)").trigger("click");
				break;
			case "go-to-language":
				preferences.dispatch({ type: "go-to", view: "language" });
				break;
			case "select-time-zone":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				console.log( el.data("utc") );
				break;
			case "unlock-view":
				isLocked = event.el.hasClass("unlocked");
				event.el.toggleClass("unlocked", isLocked);
				break;
		}
	}
}
