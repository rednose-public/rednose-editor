CKEDITOR.plugins.add( 'insert_tab', {

    requires: 'widget',
    icons: 'insert_tab', // %REMOVE_LINE_CORE%
    hidpi: false, // %REMOVE_LINE_CORE%

    init: function(editor) {
        var tabItems = [];

        // Allow empty spans
        CKEDITOR.dtd.$removeEmpty.span = 0;

        // Fire the change event to force the  width calculation.
        CKEDITOR.on('instanceReady', function  () {
            editor.fire('change');
        });

        CKEDITOR.addCss('span.tab { color: #a1a1a1; !important }');

        // Calculate the tab element width
        editor.on('change', function () {
            if (tabItems.length > 0) {
                var done = false,
                    loopCount = 0;

                // Has a width property changed?
                for (var i in tabItems) {
                    var p = tabItems[i].getAscendant('p');
                    if (p && tabItems[i].data('style') !== p.getAttribute('class')) {
                        tabItems[i].setAttribute('style', '');

                        tabItems[i].data('original-width', tabItems[i].getSize('width'));
                        tabItems[i].data('style', tabItems[i].getAscendant('p').getAttribute('class'))
                    }
                }

                while (!done) {
                    done = true;

                    loopCount++;

                    for (var i in tabItems) {
                        var rect       = tabItems[i].getClientRect(),
                            leftBuffer = 0,
                            column     = 0,
                            right      = 0,
                            width      = 0;

                        // Use the original width
                        rect.width = tabItems[i].data('original-width');

                        while (rect.left > leftBuffer - 1) {
                            leftBuffer += parseFloat(rect.width);

                            column++;

                            // Mjuh nevermind...
                            if (column > 99) {
                                return;
                            }
                        }

                        right = rect.width * column;
                        width = right - rect.left;

                        if (tabItems[i].getAttribute('style') !== 'width: ' + width + 'px') {
                            done = false;
                        }

                        tabItems[i].setAttribute('style', 'width: ' + width + 'px');
                    }

                    // Crash protection.
                    if (loopCount > 999) {
                        done = true;
                    }
                }
            }
        });

        editor.widgets.add( 'createTab', {
            // Disable drag and drop as its current implementation is buggy.
            draggable: false,

            allowedContent: 'span[class,data-tab]',

            template: '<span></span>',
            
            upcast: function( element ) {
                return element.name === 'span' && element.attributes['data-tab'];
            },

            downcast: function(element) {
                element.children.length = 0;

                tabItems = [];
            },

            init: function () {
                this.element.setAttribute('class', 'tab');
                this.element.setAttribute('data-tab', 'true');
                this.element.setHtml('&not;');

                // Bind this plugin to the TAB key.
                editor.on('key', function(e) {
                    if (e.data.keyCode == 9) {
                        editor.execCommand('createTab');

                        e.cancel();
                    }
                });

                // Clean the output before the data is persisted.
                editor.on('getData', function (e) {
                    var data = e.data.dataValue;
                        data = data.replace(/<[^<>]*(data-tab)[^<>]*><[\/]span>/ig, '<span data-tab="true"></span>'); 
                    
                    // Hmpf..
                    e.data.dataValue = data;
                });

                tabItems.push(this.element);
            },

            data: function () {
                this.element.setAttribute('data-tab', 'true');
            }
        });

        // Add button
        editor.ui.addButton && editor.ui.addButton('CreateTab', {
            label: 'Insert tab',
            command: 'createTab',
            toolbar: 'insert,5',
            icon: 'insert_tab',
            click: function () {
                var focused = editor.widgets.focused;

                // Quickfix to force insert mode for buttons.
                editor.widgets.focused = null;
                editor.execCommand('createTab');
                editor.widgets.focused = focused;
            }
        });
    }
});
