(function (window, $, _, views) {
    "use strict";

    views.SubMenuView = views.BaseView.extend({
        templateName: "subMenuTemplate",
        container: "ul.sub-menu",
        initialize: function () {

        },

        events: {
            'click li' : 'initClass'
        },

        initClass: function (e){
            this.$el.children('li').removeClass('active');
        },

        render: function () {
            this.$el.html(_.template(this.getTemplate()));
            $(this.container).html(this.$el);
            return this;
        }
    });
})(window, window.$, window._, window.App.views);

