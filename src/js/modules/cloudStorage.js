
// parts.cloudStorage

{
	dispatch(event) {
		let Self = parts.cloudStorage,
			match,
			target,
			el;
		switch (event.type) {
			case "init-view":
				// ignore if already rendered
				if (event.section.find(".panel-left .storage").length) return;

				Self.section = event.section;

				// render tree view
				el = Self.section.find(".panel-left");
				match = `//Settings//block[@id="external-storage"]`;
				window.render({ template: "storage-list", prepend: el, match });

				// hide legend if no external storage in list
				el = Self.section.find("legend").get(1);
				el.toggleClass("hidden", el.nextAll(".storage").length > 0);

				// make first active
				Self.section.find(".panel-left .storage").get(0).trigger("click");
				break;
			case "select-storage":
				el = $(event.target);
				if (el.hasClass("active") || !el.hasClass("storage")) return;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// toogle "remove storage" - depending on selection
				Self.section.find(".panel-left .option-button[data-click='remove-storage']")
					.toggleClass("disabled", el.data("id") !== "defiant-cloud");

				target = Self.section.find(".tab-body_");
				match = el.data("id") === "defiant-cloud"
							? `//FileSystem`
							: `//block[@id="external-storage"]/*[@icon="${el.data("id")}"]`;

				// render storage details
				window.render({ template: "storage-details", match, target });
				break;
			case "add-storage":
				target = Self.section.find(".tab-body_");
				match = "*";
				// render empty storage details
				window.render({ template: "storage-details", match, target });
				break;
			case "remove-storage":
				if (event.el.hasClass("disabled")) return;

				el = Self.section.find(".panel-left .active");
				// confirm action
				window.dialog.confirm({
					message: "Are you sure you want to remove storage?",
					onOk: () => {
						// remove element from DOM
						el.remove();

						// hide legend if no external storage in list
						el = Self.section.find("legend").get(1);
						el.toggleClass("hidden", el.nextAll(".storage").length > 0);
					}
				});
				break;
			case "connect-cloud-storage":
				el = event.el.parents(".tab-active_");
				el.addClass("connecting");
				el.find(".loading").removeClass("paused");
				el.find("selectbox").attr({ disabled: true });

				setTimeout(() => {
					el.removeClass("connecting").addClass("connected");
					el.find(".loading").addClass("paused");
					el.find("selectbox").removeAttr("disabled");
				}, 3000);
				break;
		}
	}
}


// Root.shell_.execute_(`win -o preferences { type: "go-to", view: "cloudStorage" }`);
