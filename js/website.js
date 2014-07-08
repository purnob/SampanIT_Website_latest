(function ($, window, document, undefined) {

    "use strict";

    // ie8
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
             for (var i = (start || 0), j = this.length; i < j; i++) {
                 if (this[i] === obj) { return i; }
             }
             return -1;
        };
    }

    var demos = ['juicy-projects', 'lightbox-gallery', 'meet-the-team', 'full-screen', 'masonry', 'blog-posts'],
        url = document.URL.split('#')[0],
        query = url.split('?q=')[1];

    query = ( demos.indexOf(query) !== -1 )? query : 'juicy-projects';

    // remove class active
    $('.wb-nav').find('a').removeClass('active');

    // find the right element to add class active
    $('.wb-nav-' + query).addClass('active');

    $('.helpMode').helpMode({
        // show the elements when the plugin initialization have been triggered
        showDefault: true,

        // delay before showing the plugin
        delayShow: 500,

        // delay before hiding the plugin
        delayHide: 0,

        // change the direction of animation by mouse position
        followCursor: false
    });

    // confy init
    $.confy.init({
        itemCls: '.cfy-item',

        startOpen: true,

        callback: function (options) {

            $('#grid-container').cubeportfolio('destroy', function () {

                $('#grid-container').cubeportfolio('init', options);

                $('#filters-container').find('.cbp-filter-item').removeClass('cbp-filter-item-active').eq(0).addClass('cbp-filter-item-active');

                $('.cbp-l-filters-dropdownHeader').text('Sort Gallery');

                $('#grid-container').cubeportfolio('showCounter', $('#filters-container').find('.cbp-filter-item'));

            });

        },

        loadingStart: function () {
            $('.cfy-wrap').addClass('cfy-wrap-loading');
        },

        loadingEnd: function () {
            $('.cfy-wrap').removeClass('cfy-wrap-loading');
        },

        dependencies: function (options) {
            if (options.displayType == 'default') {
                $('input[data-option="displayTypeSpeed"]').closest('.cfy-section').slideUp();
                $('.helpMode').helpMode('show');
                $('.dependeciesTypeSpeed').helpMode('hide');
            } else {
                $('input[data-option="displayTypeSpeed"]').closest('.cfy-section').slideDown();
                $('.helpMode').helpMode('show');
            }
        },

        hide: function () {
            $('.helpMode').helpMode('hide');
        },

        show: function () {
            $('.helpMode').helpMode('show');
        },

        // get settings from cubeportfolio
        settings: $.extend({}, $.data(document.getElementById('grid-container'), 'cubeportfolio').options)
    });


    $(document).on('scroll.wb', function(event) {
        event.preventDefault();

        $('.cfy-wrap').height( $('body').height() );

    });


    // helper
    var introHelp = {

        init: function (options) {

            if (query !== 'juicy-projects') return;

            this.isActive = false;
            this.stop = false;
            this.options = options;

            this.options.startEvent.call(this);

        },

        main: function (callback) {

            if ( this.stop || this.checkLocalStorage() ) return;

            if ($.isFunction(callback)) {
                callback.call(this);
            }

            this.isActive = true;

            this.el = this.options.element.call(this);

            this._createMarkup();

        },


        checkLocalStorage: function () {

            var localstrg;

            localStorage.introHelp = localStorage.introHelp || 'null';

            localstrg = JSON.parse(localStorage.introHelp) || {};

            if (localstrg[this.options.localId]) {
                return true;
            }

            localstrg[this.options.localId] = "true";
            localStorage.introHelp = JSON.stringify(localstrg);

            return false;

        },

        destroy: function () {

            this.stop = true;

            this.checkLocalStorage();

            if ( !this.isActive ) return;

            this._destroyMarkup();

        },

        _createMarkup: function () {

            var t = this,
                dimBody = document.body.getBoundingClientRect(),
                dimEl = t.el[0].getBoundingClientRect(), top, right, bottom, left, width, height;

            top = dimEl.top + t.options.gap.top;
            right = dimEl.right + t.options.gap.right;
            bottom = dimEl.bottom + t.options.gap.bottom;
            left = dimEl.left + t.options.gap.left;
            width = dimEl.width + ( -t.options.gap.left ) + t.options.gap.right;
            height = dimEl.height + ( -t.options.gap.top ) + t.options.gap.bottom;

            t.overlayTop = $('<div/>', {
                'class': 'intro-overlay',
            }).css({
                top: 0,
                left: 0,
                width: '100%',
                height: top
            }).appendTo(document.body);

            t.overlayRight = $('<div/>', {
                'class': 'intro-overlay'
            }).css({
                top: top,
                left: right,
                width: dimBody.width - right,
                height: height
            }).appendTo(document.body);

            t.overlayBottom = $('<div/>', {
                'class': 'intro-overlay'
            }).css({
                top: bottom,
                left: 0,
                width: '100%',
                height: dimBody.height - bottom
            }).appendTo(document.body);

            t.overlayLeft = $('<div/>', {
                'class': 'intro-overlay'
            }).css({
                top: top,
                left: 0,
                width: left,
                height: height
            }).appendTo(document.body);


            // create message
            t.messageBlock = $('<div/>', {
                html: this.options.message,
                'class': 'intro-message'
            }).appendTo(document.body);

            if (this.options.messagePosition == 'rc') {

                left = left + width + 20;
                top = bottom - (height / 2) - this.messageBlock.outerHeight() / 2;

            } else if (this.options.messagePosition == 'tc') {

                left = left + width / 2  - this.messageBlock.outerWidth() / 2;
                top = top - this.messageBlock.outerHeight() - 20;

            }

            this.messageBlock.css({
                left: left,
                top: top
            }).addClass('intro-message-' + this.options.messagePosition);
        },

        _destroyMarkup: function () {
            var t = this;

            t.overlayTop.remove();
            t.overlayRight.remove();
            t.overlayBottom.remove();
            t.overlayLeft.remove();
            t.messageBlock.remove();
        },

    };

    var intro1 = Object.create(introHelp);
    intro1.init({
        localId: 'filters-animation',
        element: function () {
            return $('.cfy-section').eq(0);
        },
        messagePosition: 'rc',
        gap: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        message: 'To change animations for filters click on the options from the left panel',
        startEvent: function () {

            var t = this;

            setTimeout(function () {

                if ( $('.cfy-toggle').hasClass('cfy-toggle-close') ) return;

                t.main(function(){
                    $(window).scrollTop(0);
                });

            }, 30000);
        }
    });

    var intro2 = Object.create(introHelp);
    intro2.init({
        localId: 'click-filters-animation',
        element: function () {
            return $('#filters-container');
        },
        message: 'To see the effect of your change click on the items below',
        messagePosition: 'tc',
        gap: {
            top: 0,
            left: -10,
            right: -721,
            bottom: 10
        },
        startEvent: function () {

            var t = this;

            $('.cfy-item[data-option="animationType"]').on('click.introHelp', function (event) {

                intro1.destroy();
                t.main();

                $('.cbp-filter-item').on('click.introHelp', function (event) {
                    intro2.destroy();

                    $('.cbp-filter-item').off('click.introHelp');
                });

                $('.cfy-item[data-option="animationType"]').off('click.introHelp');

            });
        }
    });


    var intro3 = Object.create(introHelp);
    intro3.init({
        localId: 'intro-captions-panel',
        element: function () {

            if ( $('.cbp').find('.cbp-wrapper-front').length ) {
                return $('.cbp-wrapper-front').find('.cbp-item').not('.cbp-item-hidden').eq(0).find('.cbp-caption');
            } else {
                return $('.cbp-item').not('.cbp-item-hidden').eq(0).find('.cbp-caption');
            }

        },
        message: 'To see the effect of your change mouseover the item below',
        messagePosition: 'tc',
        gap: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        startEvent: function () {

            var t = this;

            $('.cfy-item[data-option="caption"]').on('click.introHelp', function (event) {

                event.preventDefault();

                intro1.destroy();
                t.main();

                $('.cbp-item').on('mouseenter.introHelp', function (event) {
                    intro3.destroy();

                    $('.cbp-item').off('mouseenter.introHelp');
                });

                $('.cfy-item[data-option="caption"]').off('click.introHelp');

            });
        }
    });


    // var intro4 = Object.create(introHelp);
    // intro4.init({
    //     localId: 'intro-singlePage-panel',
    //     element: function () {

    //         if ( $('.cbp').find('.cbp-wrapper-front').length ) {
    //             return $('.cbp-wrapper-front').find('.cbp-item').not('.cbp-item-hidden').eq(0).find('.cbp-l-caption-buttonLeft');
    //         } else {
    //             return $('.cbp-item').not('.cbp-item-hidden').eq(0).find('.cbp-l-caption-buttonLeft');
    //         }

    //     },
    //     message: 'Click on the item below to see singlePage feature.',
    //     messagePosition: 'tc',
    //     gap: {
    //         top: -5,
    //         left: -5,
    //         right: 5,
    //         bottom: 5
    //     },
    //     startEvent: function () {

    //         var t = this;

    //         setTimeout(function () {

    //             if ( $('.cfy-toggle').hasClass('cfy-toggle-close') ) return;

    //             intro1.destroy();

    //             t.main(function(){
    //                 $(window).scrollTop(0);
    //             });

    //         }, 60000);

    //         $('.cbp-l-caption-buttonLeft').one('click.introHelp', function(event) {

    //             intro4.destroy();

    //         });

    //     }
    // });

})(jQuery, window, document);
