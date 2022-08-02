import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import { and } from "@ember/object/computed";
import discourseComputed, { observes } from "discourse-common/utils/decorators";

export default Component.extend({
  router: service(),
  tagName: "",
  init() {
    this._super(...arguments);
    if (window.location.pathname.includes("categories")) {
      fetch('/categories.json')
      .then(res => res.json())
      .then(res => res.category_list.categories)
      .then(data => data.map(category => {
        return {
          url: `/c/${category.slug}/${category.id}`,
          name: category.name
        };
      }))
      .then(data => {
        this.set("categories", data);
      });
    }
  },

  @discourseComputed("router.currentRouteName")
  displayForRoute(currentRouteName) {
    const showOn = settings.show_on;
    if (showOn === "homepage&categories") {
      if (currentRouteName.includes("categories")) {
        console.log("hello")
        this.onCategories = true;
      }
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

  @discourseComputed("currentUser")
  displayForUser(currentUser) {
    const showFor = settings.show_for;
    if (showFor === "everyone") {
      return true;
    } else if (showFor === "logged_out" && !currentUser) {
      return true;
    } else if (showFor === "logged_in" && currentUser) {
      return true;
    }
    return false;
  },

  shouldDisplay: and("displayForUser", "displayForRoute"),
  onCategories: false,

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
