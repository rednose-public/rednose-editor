/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    // %REMOVE_START%
    config.skin = 'bootstrapck';
    config.plugins =
        'basicstyles,' +
        'clipboard,' +
        'contextmenu,' +
        'enterkey,' +
        'entities,' +
        'floatingspace,' +
        'format,' +
        'image,' +
        'link,' +
        'list,' +
        'magicline,' +
        'pastefromword,' +
        'pastetext,' +
        //'sourcearea,' +
        //'stylescombo,' +
        'tab,' +
        'table,' +
        'tabletools,' +
        'toolbar,' +
        'undo,' +
        'wysiwygarea';
    // %REMOVE_END%
};

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
