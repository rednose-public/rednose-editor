﻿
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
			var lang = editor.lang.placeholder;

			// Register dialog.
			CKEDITOR.dialog.add( 'placeholder', this.path + 'dialogs/placeholder.js' );

			// Put ur init code here.
			editor.widgets.add( 'placeholder', {
                // Disable drag and drop as its current implementation is buggy.
                draggable: false,

                // Widget code.
				dialog: 'placeholder',
				pathName: lang.pathName,

				template: '<span></span>',

                upcast: function( element ) {
                    return element.name === 'span' && element.attributes['data-placeholder'];
                },

				downcast: function(element) {
                    element.children.length = 0;

                    element.add( new CKEDITOR.htmlParser.text( this.data.name ) );

				},

                allowedContent: 'span[!data-placeholder]',

				init: function() {
					// Note that placeholder markup characters are stripped for the name.
					//this.setData( 'name', this.element.getText().slice( 2, -2 ) );
                    this.setData( 'name', this.element.getAttribute('data-placeholder'));
				},

				data: function() {
					this.element.setText( '≪' + this.data.name + '≫' );
				}
			} );

			editor.ui.addButton && editor.ui.addButton( 'CreatePlaceholder', {
				label: lang.toolbar,
				command: 'placeholder',
				toolbar: 'insert,5',
				icon: 'placeholder'
			} );
		}
	} );

} )();