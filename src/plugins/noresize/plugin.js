CKEDITOR.plugins.add( 'noresize', {
    init: function() {
        CKEDITOR.on( 'dialogDefinition', function( evt ) {
            evt.data.definition.resizable = CKEDITOR.DIALOG_RESIZE_NONE;
        });

        CKEDITOR.on('instanceReady', function (evt) {
            // Override, don't focus widgets after insertion.
            evt.editor.widgets.finalizeCreation = function (container) {
                // @param {CKEDITOR.dom.element}
                function isDomWidgetWrapper( element ) {
                    return element.type == CKEDITOR.NODE_ELEMENT && element.hasAttribute( 'data-cke-widget-wrapper' );
                }

                var wrapper = container.getFirst();
                if ( wrapper && isDomWidgetWrapper( wrapper ) ) {
                    this.editor.insertElement( wrapper );

                    var widget = this.getByElement( wrapper );
                    // Fire postponed #ready event.
                    widget.ready = true;
                    widget.fire( 'ready' );
                }
            };
        });
    }
} );