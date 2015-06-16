CKEDITOR.plugins.add( 'insert_tab', {

    requires: 'widget',
    icons: 'insertTab',
    hidpi: false,

    init: function(editor) {
        // Allow empty spans
        CKEDITOR.dtd.$removeEmpty.span = 0;

        CKEDITOR.addCss('span.tab { color: #a1a1a1; !important }');

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
            },
            
            init: function () {
                this.element.setAttribute('class', 'tab');
                this.element.setAttribute('data-tab', 'true');
                this.element.setHtml('&not;');
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
            icon: 'insertTab',
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
