CKEDITOR.dialog.add( 'image', function( editor ) {
    var testField;

    return {
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
                        onChange: function () {
                            testField.setValue(this.getValue());
                        },
                        setup: function( widget ) {
                            this.setValue( widget.data.url );
                        },
                        commit: function( widget ) {
                            widget.setData( 'url', this.getValue() );
                        }
                    },
                    {
                        id: 'test',
                        type: 'text',
                        label: 'Test',
                        //width: '50px',
                        onLoad: function () {
                            testField = this;
                        }
                    },
                    {
                        id: 'file',
                        type: 'file',
                        label: 'Upload',
                        onChange: function () {
                            //console.log(this.getValue());
                            console.log(this);
                        }
                    },
                    {
                        type: 'html',
                        html: '<input type="file" name="attachment" id="attachment"/>',
                        onLoad: function () {
                            var attachment = document.getElementById('attachment');

                            attachment.onchange = function () {
                                var file = attachment.files[0], reader = new FileReader();

                                reader.onload = function () {
                                    console.log(reader.result);
                                };

                                reader.readAsDataURL(file);
                            };

                            //$("#attachment").change(function(event) {
                            //    $.each(event.target.files, function(index, file) {
                            //        var reader = new FileReader();
                            //        reader.onload = function(event) {
                            //            object = {};
                            //            object.filename = file.name;
                            //            object.data = event.target.result;
                            //            files.push(object);
                            //        };
                            //        reader.readAsDataURL(file);
                            //    });
                            //});
                            //var document = this._.dialog.getElement().getDocument();
                            //// document = CKEDITOR.dom.document
                            //var element = document.getById( 'attachment' );
                            //if ( element )
                            //    console.log( element.getHtml() );
                        }
                    },
                    {
                        id: 'align',
                        type: 'select',
                        label: 'Align',
                        items: [
                            [ editor.lang.common.notSet, '' ],
                            [ editor.lang.common.alignLeft, 'left' ],
                            [ editor.lang.common.alignRight, 'right' ],
                            [ editor.lang.common.alignCenter, 'center' ]
                        ],
                        setup: function( widget ) {
                            this.setValue( widget.data.align );
                        },
                        commit: function( widget ) {
                            widget.setData( 'align', this.getValue() );
                        }
                    },
                    {
                        id: 'width',
                        type: 'text',
                        label: 'Width',
                        width: '50px',
                        setup: function( widget ) {
                            this.setValue( widget.data.width );
                        },
                        commit: function( widget ) {
                            widget.setData( 'width', this.getValue() );
                        }
                    }
                ]
            }
        ]
    };
} );