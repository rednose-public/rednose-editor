
/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "placeholder" plugin.
 *
 */

'use strict';

( function() {
    CKEDITOR.plugins.add( 'placeholder', {
        requires: 'widget,dialog',
        lang: 'ar,bg,ca,cs,cy,da,de,el,en,en-gb,eo,es,et,eu,fa,fi,fr,fr-ca,gl,he,hr,hu,id,it,ja,km,ko,ku,lv,nb,nl,no,pl,pt,pt-br,ru,si,sk,sl,sq,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
        icons: 'placeholder', // %REMOVE_LINE_CORE%
        hidpi: true, // %REMOVE_LINE_CORE%

        init: function( editor ) {
            // Allow empty spans
            CKEDITOR.dtd.$removeEmpty.span = 0;

            // Add static placeholder styling
            CKEDITOR.addCss( 'span[data-type=static] { background-color: #e6e6e6; }' );

            // Add metadata reference field styling
            CKEDITOR.addCss( 'span[data-type=meta_reference] { background-color: #e6e6e6; }' );

            var lang = editor.lang.placeholder;

            // Register dialog.
            CKEDITOR.dialog.add( 'placeholder', this.path + 'dialogs/placeholder.js' );

            editor.widgets.add( 'placeholder', {
                // Disable drag and drop as its current implementation is buggy.
                draggable: false,

                // Widget code.
                dialog: 'placeholder',
                pathName: lang.pathName,

                allowedContent: 'span[!data-placeholder,!data-type,data-value,data-binding,data-collapsible,data-kind,data-pattern]',

                template: '<span></span>',

                upcast: function( element ) {
                    return element.name === 'span' && element.attributes['data-placeholder'];
                },

                downcast: function(element) {
                    element.children.length = 0;
                },

                init: function() {
                    // Note that placeholder markup characters are stripped for the name.
                    this.setData( 'name', this.element.getAttribute('data-placeholder'));
                    this.setData( 'type', this.element.getAttribute('data-type'));

                    this.setData( 'value', this.element.getAttribute('data-value') || null);
                    this.setData( 'binding', this.element.getAttribute('data-binding') || null);
                    this.setData( 'pattern', this.element.getAttribute('data-pattern') || null);
                    this.setData( 'kind', this.element.getAttribute('data-kind') || null);

                    this.setData( 'collapsible', this.element.hasAttribute('data-collapsible'));

                    this.on( 'contextMenu', function( evt ) {
                        evt.data.placeholder = CKEDITOR.TRISTATE_OFF;
                    } );
                },

                data: function() {
                    this.element.setAttribute( 'data-placeholder', this.data.name);
                    this.element.setAttribute( 'data-type', this.data.type);

                    if (this.data.value) {
                        this.element.setAttribute( 'data-value', this.data.value);
                    } else {
                        this.element.hasAttribute( 'data-value' ) && this.element.removeAttribute( 'data-value' );
                    }

                    if (this.data.binding) {
                        this.element.setAttribute( 'data-binding', this.data.binding);
                    } else {
                        this.element.hasAttribute( 'data-binding' ) && this.element.removeAttribute( 'data-binding' );
                    }

                    if (this.data.collapsible) {
                        this.element.setAttribute( 'data-collapsible', this.data.collapsible);
                    } else {
                        this.element.hasAttribute( 'data-collapsible' ) && this.element.removeAttribute( 'data-collapsible' );
                    }

                    if (this.data.pattern) {
                        this.element.setAttribute( 'data-pattern', this.data.pattern);
                    } else {
                        this.element.hasAttribute( 'data-pattern' ) && this.element.removeAttribute( 'data-pattern' );
                    }

                    if (this.data.kind) {
                        this.element.setAttribute( 'data-kind', this.data.kind);
                    } else {
                        this.element.hasAttribute( 'data-kind' ) && this.element.removeAttribute( 'data-kind' );
                    }

                    if (this.data.type && (this.data.type === 'static' || this.data.type === 'meta_reference')) {
                        this.element.setText( '[' + this.data.name + ']' );
                    } else {
                        this.element.setText( '≪' + this.data.name + '≫' );
                    }
                }
            } );

            // Register context menu option for editing widget.
            if ( editor.contextMenu ) {
                editor.addMenuGroup( 'placeholder', 10 );

                editor.addMenuItem( 'placeholder', {
                    label: 'Placeholder bewerken...',
                    command: 'placeholder',
                    group: 'placeholder'
                } );
            }

            editor.ui.addButton && editor.ui.addButton( 'CreatePlaceholder', {
                label: lang.toolbar,
                command: 'placeholder',
                toolbar: 'insert,5',
                icon: 'placeholder',
                click: function () {
                    var focused = editor.widgets.focused;

                    // Quickfix to force insert mode for buttons.
                    editor.widgets.focused = null;
                    editor.execCommand('placeholder');
                    editor.widgets.focused = focused;
                }
            } );
        }
    } );
} )();
