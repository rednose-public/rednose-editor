CKEDITOR.plugins.add( 'image', {
    requires: 'widget',

    icons: 'image',

    init: function( editor ) {
        CKEDITOR.dialog.add( 'image', this.path + 'dialogs/image.js' );

        editor.widgets.add( 'image', {

            button: 'Insert an image',

            template:
                '<figure>' +
                    '<img src="">' +
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
                var img = this.element.findOne('img');
                var url = img && img.getAttribute('src');

                if (url) {
                    this.setData('url', url);
                }
            },

            data: function() {
                var img = this.element.findOne('img');

                if (this.data.url) {
                    img.setAttribute('src', this.data.url);
                }
            }
        } );
    }
} );