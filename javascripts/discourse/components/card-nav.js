import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import { bool  } from "@ember/object/computed";
import discourseComputed, { observes } from "discourse-common/utils/decorators";

export default Component.extend({
  tagName: "",
  router: service(),
  // classNames: ["custom-category-boxes-container"],
  // classNameBindings: ["noneSelected:none-selected"],
  _allowedCategories(selectedCategories) {
    // filters categories to only include selected categories for each section
    if (this.onCategories) {
      console.log("on categories page");
      let availableCategories = this.site.categories.filter(category => {
        if (selectedCategories.indexOf(category.id) !== -1) {
          return true;
        } else {
          return false;
        }
      });
      console.log("about to return categories", availableCategories);
      return availableCategories;
    } else {
      console.log("on other pages");
      let navItem = [];
      for (let i = 1; i <= 4; i++) {
        navItem.push({
          link: settings[`link${i}`],
          title: settings[`title${i}`],
          subTitle: settings[`sub-title${i}`]
        });
      }
      console.log("about return navItems", navItem);
      return navItem;
    }
  },


  @discourseComputed("router.currentRouteName")
  displayForRoute(currentRouteName) {
    const showOn = settings.show_on;
    if (showOn === "homepage&categories") {
      return currentRouteName === `discovery.${defaultHomepage()}` || currentRouteName.includes("categories");
    } else if (showOn === "top_menu") {
      return this.siteSettings.top_menu
        .split("|")
        .any((m) => `discovery.${m}` === currentRouteName);
    } else {
      // "all"
      return (
        currentRouteName !== "full-page-search" &&
        !currentRouteName.startsWith("admin.")
      );
    }
  },

  @discourseComputed("router.currentRouteName")
  isOnCategories(currentRouteName) {
    return currentRouteName.includes("categories");
  },

  shouldDisplay: bool("displayForRoute"),
  onCategories: bool("isOnCategories"),

  // Setting a class on <html> from a component is not great
  // but we need it for backwards compatibility
  @observes("shouldDisplay")
  displayChanged() {
    document.documentElement.classList.toggle(
      "display-card-nav",
      this.shouldDisplay
    );
  },

  didInsertElement() {
    this.displayChanged();
  },

  didDestroyElement() {
    document.documentElement.classList.remove("display-card-nav");
  },
});
