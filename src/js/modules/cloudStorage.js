
// parts.cloudStorage

{
	dispatch(event) {
		let Self = parts.cloudStorage,
			node,
			match,
			target,
			value,
			active,
			el;
		switch (event.type) {
			// native events
			case "window.keystroke":
				el = $(event.target);
				if (el.attr("name") === "storage-name") {
					// put entered value into selected item in left panel
					value = el.val() || defiant.i18n("New Storage");
					Self.section.find(".panel-left .active .name").html(value);
				}
				break;
			// custom events
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
			case "show-section-help":
				console.log(event);
				break;
			case "select-storage":
				el = $(event.target);

				// remove any "new storage", if there is one
				active = el.parent().find(".storage[data-id='new-storage']");
				if (active[0] !== el[0]) active.remove();

				// conditional checks
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
				active = Self.section.find(".panel-left .storage[data-id='new-storage']");
				if (active.length) return;

				let xBlock = window.bluePrint.selectSingleNode("sys://block[@id='external-storage']");
				node = xBlock.appendChild($.nodeFromString(`<item icon="new-storage"/>`));

				// render tree view
				el = Self.section.find(".panel-left .storage-list");
				match = `//block[@id="external-storage"]/*[@icon="new-storage"]`;
				window.render({ template: "storage-list-item", append: el, match });

				// auto select new storage
				el.find(".storage:last").trigger("click");

				// hide legend if no external storage in list
				el = Self.section.find("legend").get(1);
				el.toggleClass("hidden", el.nextAll(".storage").length > 0);

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
						let next = el.prevAll(".storage").get(0);
						// remove element from DOM
						el.remove();
						// hide legend if no external storage in list
						el = Self.section.find("legend").get(1);
						el.toggleClass("hidden", el.nextAll(".storage").length > 0);
						// make active previous suibling
						next.trigger("click");
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
