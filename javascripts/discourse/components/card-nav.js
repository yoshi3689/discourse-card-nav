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
  // every time the url changes
  onRouteChange:  (component) => {
    component._super(...arguments);
    // if you are on the categories page
  if (component.onCategories) {
    // get rid of muted categories from the list
    const categoriesToShow = component.site.categories.filter(c => !c.isMuted)
    .map((c, i) => {
      let parentCategory = c.parentCategory ? `${c.parentCategory.slug}/` : "";
      return i > 8 ? {...c, showByDefault : "card-hidden", category_url: `/c/${parentCategory}/${c.slug}/${c.id}`} : {...c, showByDefault : "", category_url: `/c/${parentCategory}${c.slug}/${c.id}`};
    });
    // get rid of the uncategorized from the list 
    categoriesToShow.shift();
    component.set("categories", categoriesToShow);
    // if you are on the other pages
  } else {
    let navItem = [];
    for (let i = 1; i <= 4; i++) {
      navItem.push({
        link: settings[`link${i}`],
        title: settings[`title${i}`],
        subTitle: settings[`sub-title${i}`]
      });
    }
    component.set("categories", navItem);
  }
  },
  // every time the component is built(includes page refresh)
  init () {
    this._super(...arguments);
    if (this.onCategories) {
      const categoriesToShow = this.site.categories.filter(c => !c.isMuted)
      .map((c, i) => {
        let parentCategory = c.parentCategory ? `${c.parentCategory}/` : "";
        return i > 8 ? {...c, showByDefault : "card-hidden", category_url: `/c/${parentCategory}${c.slug}/${c.id}`} : {...c, showByDefault : "", category_url: `/c/${parentCategory}${c.slug}/${c.id}`};
      });
      categoriesToShow.shift();
      this.set("categories", categoriesToShow);
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
  // determine if the component should show or not based on the current route
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
  // determine if you are on the categories page or not
  @discourseComputed("router.currentRouteName")
  isOnCategories(currentRouteName) {
    return currentRouteName.includes("categories");
  },
  // determine if the component should show or not
  @observes("shouldDisplay")
  displayChanged() {
    document.documentElement.classList.toggle(
      "display-card-nav",
      this.shouldDisplay
    );
  },
  shouldDisplay: bool("displayForRoute"),
  onCategories: bool("isOnCategories"),
  @observes("onCategories")
  routeChanged() {
    this.onRouteChange(this);
  },

  didInsertElement() {
    this.displayChanged();
  },

  didDestroyElement() {
    document.documentElement.classList.remove("display-card-nav");
  },
});