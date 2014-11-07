CKEDITOR.plugins.add( 'image', {
    requires: 'widget',

    icons: 'image',

    afterInit: function (editor) {
        editor.ui.add( 'Image', CKEDITOR.UI_BUTTON, {
            label: 'Afbeelding invoegen',
            command: 'image',
            modes: {wysiwyg: 1},
            editorFocus: 0,
            toolbar: 'insert,30',
            click: function () {
                var form = document.getElementById('cke_upload_form');
                form.reset();

                var attachment = document.getElementById('cke_upload_input');
                attachment.click();

                attachment.onchange = function () {
                    var file = attachment.files[0], reader = new FileReader();

                    if (!file) {
                        return;
                    }

                    reader.onload = function () {
                        editor.insertHtml('<figure><img src ="' + reader.result + '"/></figure>');
                    };

                    reader.readAsDataURL(file);
                };
            }
        });

        function create(htmlStr) {
            var frag = document.createDocumentFragment(),
                temp = document.createElement('div');
            temp.innerHTML = htmlStr;
            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }
            return frag;
        }

        if (!document.getElementById('cke_upload_form')) {
            var fragment = create('<form style="display: none;" id="cke_upload_form"><input id="cke_upload_input" type="file" accept="image/*"/></form>');
            document.body.insertBefore(fragment, document.body.childNodes[0]);
        }
    },

    init: function( editor ) {
        CKEDITOR.dialog.add( 'image', this.path + 'dialogs/image.js' );

        editor.widgets.add( 'image', {
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

                this.on( 'contextMenu', function( evt ) {
                    evt.data.image = CKEDITOR.TRISTATE_OFF;
                } );

            },

            data: function() {
                var img = this.element.findOne('img');

                if (this.data.url) {
                    img.setAttribute('src', this.data.url);
                }
            }
        } );

        // Register context menu option for editing widget.
        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'image', 10 );

            editor.addMenuItem( 'image', {
                label: 'Eigenschappen afbeelding',
                command: 'image',
                group: 'image'
            } );
        }

        editor.ui.addButton && editor.ui.addButton( 'Image', {
            label: 'Afbeelding invoegen',
            command: 'image',
            toolbar: 'insert,10'
        } );
    }
} );