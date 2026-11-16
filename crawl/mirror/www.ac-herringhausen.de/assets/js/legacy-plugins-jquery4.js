// What the old jQuery plugins of the websites need of jQuery 3: jQuery 4 removed these utilities, the plugins (no
// longer maintained, no newer version without them) still call them. Defined as jQuery 3 did, loaded right after
// jquery-4.0.0.min.js (the asset groups of public/websites/index.php). Remove an entry together with its last plugin.
// hPage's own scripts do not use them.
// - jQuery.isFunction: jPicker 1.1.6 (colour picker of the design editor), jQuery Timepicker Addon 1.6.3 (contact form)
// - jQuery.trim: jQuery Timepicker Addon 1.6.3
// - jQuery.isArray: jquery.i18n.min.js ($.i18n._ with arguments)
// - jQuery.camelCase: Bootstrap 2 (bootstrap.min.js: the collapse of the design editor's dialogs)
// - jQuery('#') as an empty set instead of a syntax error (jQuery 3 and later): Bootstrap 2 looks up the target of a
//   dropdown or collapse link by its href, "#" for the menus of the design editor and the preview bar
(function($) {
    var init = $.fn.init;
    $.fn.init = function(selector, context, root) {
        return init.call(this, selector === '#' ? [] : selector, context, root);
    };
    $.fn.init.prototype = $.fn;

    if (!$.isFunction) {
        $.isFunction = function(obj) {
            return typeof obj === 'function' && typeof obj.nodeType !== 'number' && typeof obj.item !== 'function';
        };
    }

    if (!$.isArray) {
        $.isArray = Array.isArray;
    }

    if (!$.trim) {
        $.trim = function(text) {
            return text === null || text === undefined ? '' : String(text).replace(/^[\s﻿\xA0]+|[\s﻿\xA0]+$/g, '');
        };
    }

    if (!$.camelCase) {
        $.camelCase = function(string) {
            return string.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, function(all, letter) {
                return letter.toUpperCase();
            });
        };
    }
})(jQuery);
