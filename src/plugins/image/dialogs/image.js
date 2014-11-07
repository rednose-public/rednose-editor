CKEDITOR.dialog.add( 'image', function( editor ) {
    var urlData;

    return {
        onLoad: function () {
            // Disable button on load
            var dialog = CKEDITOR.dialog.getCurrent();
            dialog.disableButton('ok');
            dialog.getButton('ok').getElement().addClass('disabled');
        },

        title: 'Upload Image',
        minWidth: 310,
        minHeight: 100,
        contents: [
            {
                id: 'info',
                elements: [
                    {
                        type: 'html',
                        label: 'Upload',
                        html: '<form id="upload"><input type="file" name="attachment" id="attachment"/></form>',
                        onLoad: function () {
                            var attachment = document.getElementById('attachment');

                            attachment.onchange = function () {
                                var file = attachment.files[0], reader = new FileReader();

                                if (!file) {
                                    return;
                                }

                                reader.onload = function () {
                                    var dialog = CKEDITOR.dialog.getCurrent();
                                    dialog.enableButton('ok');
                                    dialog.getButton('ok').getElement().removeClass('disabled');

                                    urlData = reader.result;
                                };

                                reader.readAsDataURL(file);
                            };
                        },
                        onShow: function () {
                            var form = document.getElementById('upload');
                            form.reset();
                        },
                        setup: function( widget ) {
                            urlData = widget.data.url;
                        },
                        commit: function( widget ) {
                            widget.setData('url', urlData);
                        }
                   }
                ]
            }
        ]
    };
} );