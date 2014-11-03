CKEDITOR.plugins.add( 'image', {
    requires: 'widget',

    icons: 'image',

    init: function( editor ) {
        CKEDITOR.dialog.add( 'image', this.path + 'dialogs/image.js' );

        editor.widgets.add( 'image', {

            button: 'Create a simple box',

            template:
                '<figure>' +
                    '<img src="http://verantwoordingsonderzoek.rekenkamer.nl/sites/default/files/images/2012-ienm-bi-begroting-grafiek.png">' +
                '</figure>',

            allowedContent:
                'figure;' +
                'img[!src];',

            requiredContent: 'figure',

            dialog: 'image',

            upcast: function( element ) {
                return element.name == 'figure';
            },

            init: function() {
                var width = this.element.getStyle( 'width' );
                if ( width )
                    this.setData( 'width', width );
                if ( this.element.hasClass( 'align-left' ) )
                    this.setData( 'align', 'left' );
                if ( this.element.hasClass( 'align-right' ) )
                    this.setData( 'align', 'right' );
                if ( this.element.hasClass( 'align-center' ) )
                    this.setData( 'align', 'center' );
            },

            data: function() {

                if ( this.data.width == '' )
                    this.element.removeStyle( 'width' );
                else
                    this.element.setStyle( 'width', this.data.width );

                this.element.removeClass( 'align-left' );
                this.element.removeClass( 'align-right' );
                this.element.removeClass( 'align-center' );
                if ( this.data.align )
                    this.element.addClass( 'align-' + this.data.align );
            }
        } );
    }
} );