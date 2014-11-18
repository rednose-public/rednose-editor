( function() {
    'use strict';

    CKEDITOR.plugins.add( 'marktitle', {
        requires: 'contextmenu',
        icons: 'marktitle', // %REMOVE_LINE_CORE%
        hidpi: true, // %REMOVE_LINE_CORE%

        onLoad: function() {
            CKEDITOR.addCss( 'span[data-titlemark] { border-bottom: 1px solid #316AC5; padding-bottom: 2px; }' );
        },

        init: function( editor ) {
            function setToolbarStates() {
                // Check if the selection is not empty.
                var sel = editor.getSelection(),
                    ranges = sel.getRanges(),
                    selectionIsEmpty = sel.getType() == CKEDITOR.SELECTION_NONE || ( ranges.length == 1 && ranges[ 0 ].collapsed );

                var style = new CKEDITOR.style({
                    element: 'span',
                    attributes : { 'data-titlemark' : 'true' }
                });

                var active = style.checkActive( editor.elementPath(), editor );

                editor.getCommand( 'markTitle' ).setState( selectionIsEmpty || active ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF );
            }

            editor.on( 'selectionChange', function( ) {
                setToolbarStates();
            } );

            editor.on( 'contentDom', function () {
                var editable = editor.editable();

                var mouseupTimeout;

                // Use editor.document instead of editable in non-IEs for observing mouseup
                // since editable won't fire the event if selection process started within
                // iframe and ended out of the editor (#9851).
                editable.attachListener( CKEDITOR.env.ie ? editable : editor.document.getDocumentElement(), 'mouseup', function() {
                    mouseupTimeout = setTimeout( function() {
                        setToolbarStates();
                    }, 0 );
                } );

                // Make sure that deferred mouseup callback isn't executed after editor instance
                // had been destroyed. This may happen when editor.destroy() is called in parallel
                // with mouseup event (i.e. a button with onclick callback) (#10219).
                editor.on( 'destroy', function() {
                    clearTimeout( mouseupTimeout );
                } );

                editable.on( 'keyup', setToolbarStates );
            } );

            editor.addCommand( 'markTitle', {
                startDisabled: true,

                allowedContent: 'span[data-titlemark]',

                exec: function (editor) {
                    var marks = editor.document.find('span[data-titlemark]');

                    for (var i = 0; i < marks.count(); i++) {
                        marks.getItem(i).remove(true);
                    }

                    editor.applyStyle(new CKEDITOR.style({
                        element: 'span',
                        attributes : { 'data-titlemark' : 'true' }
                    }));
                }
            } );

            editor.addCommand( 'removeTitleMark', {
                requiredContent: 'span[data-titlemark]',
                exec: function( editor ) {
                    var style = new CKEDITOR.style({
                        element: 'span',
                        attributes : { 'data-titlemark' : 'true' }
                    });

                    // The one on the cursor needs to be removed by the `style.remove` method to prevent errors for widgets.
                    style.remove(editor);

                    // Remove any leftover marks.
                    var marks = editor.document.find('span[data-titlemark]');

                    for (var i = 0; i < marks.count(); i++) {
                        marks.getItem(i).remove(true);
                    }
                }
            } );

            if ( editor.contextMenu ) {
                editor.addMenuGroup( 'marktitle', 10 );

                editor.addMenuItem( 'marktitle', {
                    label: 'Remove title mark',
                    command: 'removeTitleMark',
                    group: 'marktitle'
                } );
            }

            // If the "contextmenu" plugin is loaded, register the listeners.
            if ( editor.contextMenu ) {
                editor.contextMenu.addListener( function() {
                    var style = new CKEDITOR.style({
                        element: 'span',
                        attributes : { 'data-titlemark' : 'true' }
                    });

                    if (style.checkActive( editor.elementPath(), editor ))
                        return { marktitle: CKEDITOR.TRISTATE_OFF };
                } );
            }

            editor.ui.addButton && editor.ui.addButton( 'MarkTitle', {
                label: 'Mark as title',
                command: 'markTitle',
                toolbar: 'insert,5',
                icon: 'marktitle'
            } );
        }
    } );
} )();
