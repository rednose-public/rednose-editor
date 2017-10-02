CKEDITOR.dialog.add( 'image', function( editor ) {
    return {
        title: 'Image properties',
        minWidth: 310,
        minHeight: 100,
        contents: [
            {
                id: 'info',
                elements: [
                    {
                        id: 'alt_text',
                        type: 'text',
                        label: 'Alt text',
                        'default': '',
                        setup: function( widget ) {
                            this.setValue( widget.data.alt );

                        },
                        commit: function( widget ) {
                            widget.setData( 'alt', this.getValue() );
                        }
                    }
                ]
            }
        ]
    };
} );