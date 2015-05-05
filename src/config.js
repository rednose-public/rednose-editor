/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    config.dialog_backgroundCoverColor = 'black'; // Bootstrap integration

    // %REMOVE_START%
    config.skin = 'bootstrapck';
    config.plugins =
        'basicstyles,' +
        'clipboard,' +
        'contextmenu,' +
        'enterkey,' +
        'entities,' +
        'floatingspace,' +
        //'format,' +
        'htmlwriter,' +
        'image,' +
        'list,' +
        'magicline,' +
        'marktitle,' +
        'default_style,' +
        'noresize,' +
        'pastefromword,' +
        'pastetext,' +
        'placeholder,' +
        'quicktable,' +
        'sharedspace,' +
        'sourcearea,' +
        'stylescombo,' +
        'tab,' +
        'table,' +
        'tabletools,' +
        'toolbar,' +
        'undo,' +
        'wysiwygarea';
    // %REMOVE_END%
};

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
