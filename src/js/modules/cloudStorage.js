
// parts.cloudStorage

{
	dispatch(event) {
		let Self = parts.cloudStorage,
			node,
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

				// temp
				setTimeout(() => {
					Self.dispatch({ type: "add-storage" });
				}, 1000);
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

				// auto focus input field
				if (el.data("id") === "new-storage") {
					target.find("input[name='storage-name']").select();
				}
				break;
			case "select-storage-type":
				el = Self.section.find(`input[name='storage-name']`);
				if (!el.val()) {
					el.val(event.el.find("option[selected]").text());
				}
				// enable connect button
				Self.section.find(`button[data-click="connect-cloud-storage"]`).removeAttr("disabled");
				break;
			case "add-storage":
				let xBlock = window.bluePrint.selectSingleNode("sys://block[@id='external-storage']");
				node = xBlock.appendChild($.nodeFromString(`<item icon="new-storage"/>`));

				// render tree view
				el = Self.section.find(".panel-left .storage-list");
				match = `//block[@id="external-storage"]/*[@icon="new-storage"]`;
				window.render({ template: "storage-list-item", append: el, match });

				// auto select new storage
				el.find(".storage").trigger("click");

				// remove temp node
				node.parentNode.removeChild(node);
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
