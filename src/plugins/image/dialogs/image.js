CKEDITOR.dialog.add( 'image', function( editor ) {
    var urlField;

    return {
        //onLoad: function () {
        //    var dialog = CKEDITOR.dialog.getCurrent();
        //    dialog.disableButton('ok');
        //},

        title: 'Edit Image',
        minWidth: 310,
        minHeight: 100,
        contents: [
            {
                id: 'info',
                elements: [
                    {
                        id: 'url',
                        type: 'text',
                        label: 'URL',
                        //width: '50px',
                        onLoad: function () {
                            urlField = this;
                        },
                        commit: function( widget ) {
                            widget.setData( 'url', this.getValue() );
                        }
                    },
                    {
                        type: 'html',
                        label: 'Upload',
                        html: '<input type="file" name="attachment" id="attachment"/>',
                        onLoad: function () {
                            var attachment = document.getElementById('attachment');

                            attachment.onchange = function () {
                                var file = attachment.files[0], reader = new FileReader();

                                reader.onload = function () {
                                    //var dialog = CKEDITOR.dialog.getCurrent();
                                    //dialog.enableButton('ok');

                                    urlField.setValue(reader.result);
                                };

                                reader.readAsDataURL(file);
                            };
                        }
                   }
                ]
            }
        ]
    };
} );