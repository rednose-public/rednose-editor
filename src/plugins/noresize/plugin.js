CKEDITOR.plugins.add( 'noresize', {
    init: function() {
        CKEDITOR.on( 'dialogDefinition', function( evt ) {
            evt.data.definition.resizable = CKEDITOR.DIALOG_RESIZE_NONE;
        });
    }
} );