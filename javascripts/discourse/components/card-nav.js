import Component from "@ember/component";
import {
  inject as service
} from "@ember/service";
import {
  defaultHomepage
} from "discourse/lib/utilities";
import {
  bool
} from "@ember/object/computed";
import discourseComputed, {
  observes
} from "discourse-common/utils/decorators";

export default Component.extend({
  tagName: "",
  router: service(),
  onRouteChange: function() {
    this._super(...arguments);
  if (this.onCategories) {
    // const categoriesToShow = this.site.categories.map((c, i) => {
    //   return i > 7 ? {...c, showByDefault : "card-hidden"} : {...c, showByDefault : ""};
    // });
    this.set("categories", this.site.categories);
  } else {
    let navItem = [];
    for (let i = 1; i <= 4; i++) {
      navItem.push({
        link: settings[`link${i}`],
        title: settings[`title${i}`],
        subTitle: settings[`sub-title${i}`]
      });
    }
    this.set("categories", navItem);
  }
  },
  init() {
    this.onRouteChange();
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
  @observes("shouldDisplay")
  displayChanged() {
    document.documentElement.classList.toggle(
      "display-card-nav",
      this.shouldDisplay
    );
  },
  @observes("onCategories")
  routeChanged() {
    this.onRouteChange();
  },

  didInsertElement() {
    this.displayChanged();
  },

  didDestroyElement() {
    document.documentElement.classList.remove("display-card-nav");
  },
});