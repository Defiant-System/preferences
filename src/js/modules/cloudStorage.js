
// parts.cloudStorage

{
	dispatch(event) {
		let Self = parts.cloudStorage,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
			case "select-storage":
				el = $(event.target);
				if (el.hasClass("active") || el.hasClass("panel-left")) return;

				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				break;
			case "add-storage":
			case "remove-storage":
				break;
			case "connect-cloud-storage":
				el = event.el.parents(".tab-active_");
				el.addClass("connecting");
				el.find(".loading").removeClass("paused");

				setTimeout(() => {
					el.removeClass("connecting").addClass("connected");
					el.find(".loading").addClass("paused");
				}, 2500);
				break;
		}
	}
}


// Root.shell_.execute_(`win -o preferences { type: "go-to", view: "cloudStorage" }`);
