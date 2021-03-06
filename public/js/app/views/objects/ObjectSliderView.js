define([
    'jquery',
    'underscore',
    'views/BaseView',
    'views/objects/ImageCropView',
    'plugins/ColorPicker',
    'plugins/Preloader',
    'models/objects/ObjectModel',
    'jquery-select2'
], function($, _, BaseView, ImageCropView, ColorPicker, Preloader, ObjectModel){

    var ObjectSliderView = BaseView.extend({
        templateName: "objectSliderTemplate",
        container: "#slider-block",
        colorPicker: null,
        preloader: null,
        imageCropView: null,
        bindValidation: true,

        initialize: function (options) {
            var isNew;

            this.model = new ObjectModel();
            this.objectCollection = options.objectCollection;

            this.listenTo(this.model, 'sync', function(model, data) {
                if (isNew) {
                    this.objectCollection.add(this.model);
                    this.model = new ObjectModel();
                }

            });
        },

        events: {
            'click #mobile-pug' : 'openPreloader',
            'click #tracker-pug' : 'closePreloader',
            'click .slider-close' : 'closeSlider',
            'click .btn02' : 'closeSlider',
            'click .btn01' : 'saveObject',
            'click .preview' : 'openColorPicker',
            'change #photo-upload' : 'onPhotoChange',
            'click #remove-photo-btn' : 'removePhoto'
        },

        bindEvents: function() {

            this.listenTo(this.imageCropView, 'popupIsClosed', function() {
                this.$el.find('#photo-upload').val('');
            });

            this.listenTo(this.imageCropView, 'croppingFinished', function(canvas) {
                if(canvas) {
                    var ctx = this.$el.find('#object-photo').get(0).getContext("2d");
                    ctx.drawImage(canvas, 0, 0);
                    this.$el.find('#remove-photo-btn').show();
                }
            });

            this.listenTo(this.colorPicker, 'mouseMoved', function(pixel, hexValue) {
                this.$el.find('.preview').css('background', "rgb("+pixel[0]+", "+pixel[1]+", "+pixel[2]+")");
                this.$el.find('#hexVal').val(hexValue);
            });

            this.listenTo(this.colorPicker, 'mouseOut', function(color) {
                if(color) {
                    this.$el.find('.preview').css('background', color);
                    this.$el.find('#hexVal').val(color);
                } else {
                    this.$el.find('.preview').removeAttr('style');
                    this.$el.find('#hexVal').val('');
                }
            });

            this.listenTo(this.colorPicker, 'addColor', function(color) {
                this.$el.find('.preview').css('background', color);
                this.$el.find('.preview').css('background', color);
                this.colorPicker.closePicker();
            });
        },

        openPreloader: function(){
            this.preloader.startPreloader();

        },

        closePreloader:function(){
            this.preloader.finishPreloader();
        },

        onPhotoChange: function(e) {
            var fileInput = this.$el.find(e.currentTarget);
            this.imageCropView.init(fileInput);
        },

        removePhoto: function(e) {
            var canvas = this.$el.find('#object-photo').get(0);
                ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.$el.find('#remove-photo-btn').hide();
        },

        openColorPicker: function(e) {
            if(this.colorPicker) {
                this.colorPicker.openPicker(e);
            }
        },

        closeSlider: function(e) {
            e.preventDefault();
            this.$el.find('#add-object').removeClass('open');
        },

        select2Init: function() {
            this.$el.find('.select').select2();
        },

        saveObject: function(e) {
            e.preventDefault();

            var emptyCanvas = this.$el.find('#empty-canvas').get(0).toDataURL(),
                photoCanvas = this.$el.find('#object-photo').get(0).toDataURL();

            this.model.set({
                'objectName': this.$el.find('input[name="objectName"]').val(),
                'application': this.$el.find('select[name="application"]').val(),
                'objectType': this.$el.find('select[name="objectType"]').val(),
                'pug': this.$el.find('input[name="pug"]').val(),
                'color': this.$el.find('input[name="color"]').val(),
                'photo': (emptyCanvas != photoCanvas) ? photoCanvas : null
            }).save();
        },

        render: function (router) {
            this.$el.html(_.template(this.getTemplate(), this.objectCollection.toJSON()));
            $(this.container).html(this.$el);
            this.imageCropView = router.showView(new ImageCropView());
            this.colorPicker = router.showView(new ColorPicker());
            this.preloader = router.showView(new Preloader());

            this.bindEvents();

            this.select2Init();
            return this;
        }
    });

    return ObjectSliderView;

});