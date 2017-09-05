CKEDITOR.plugins.add( 'conditionals', {

    requires: 'widget',
    icons: 'text-exp-icon,tr-exp-icon', // %REMOVE_LINE_CORE%
    hidpi: false, // %REMOVE_LINE_CORE%

    onLoad: function() {
        CKEDITOR.addCss(       
            '*[data-condition-expression]::before { content: \'{\'; background-color: yellow; border: 1px solid black; font-weight: bold; margin: 2px; }' +
            '*[data-condition-expression]::after { content: \'}\'; background-color: yellow; border: 1px solid black; font-weight: bold; margin: 2px; }'
        );
    },

    init: function(editor) {
        toolbarState = function () {
            var sel = editor.getSelection(),
                ranges = sel.getRanges(),
                selectionIsEmpty = sel.getType() == CKEDITOR.SELECTION_NONE || ( ranges.length == 1 && ranges[ 0 ].collapsed );

            var expression = new CKEDITOR.style({
                element: 'span',
                attributes : { 'data-condition-expression' : '' }
            });
            var expressionPresent = expression.checkActive(editor.elementPath(), editor);

            editor.getCommand('textCondition').setState( selectionIsEmpty ? CKEDITOR.TRISTATE_DISABLED : ( expressionPresent ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF ));
        }
    
        // I think this event is triggered when your caret changes parent element
        editor.on('selectionChange', function(e) {
            toolbarState();
        });
        editor.on('contentDom', function () {
            var editable = editor.editable(),
                mouseupTimeout;

            editable.attachListener( CKEDITOR.env.ie ? editable : editor.document.getDocumentElement(), 'mouseup', function() {
                mouseupTimeout = setTimeout(function() {
                    toolbarState();
                }, 0);
            });

            editor.on('destroy', function() {
                clearTimeout(mouseupTimeout);
            });

            editable.on('keyup', toolbarState);
        });

        editor.ui.addToolbarGroup('conditionals');

        editor.addCommand('textCondition', {
            startDisabled: true,

            allowedContent: 'span[data-condition-expression]',

            exec: function (editor) {
            }          
        });

        editor.addCommand('rowCondition', {
            startDisabled: true,

            allowedContent: 'tr[data-condition-expression]',

            exec: function (editor) {
            }          
        });

        editor.ui.addButton('TextCondition', {
            label: 'Conditional Text',
            command: 'textCondition',
            toolbar: 'conditionals,0',
            icon: 'text-exp-icon'
        });

        editor.ui.addButton('RowCondition', {
            label: 'Conditional Row',
            command: 'rowCondition',
            toolbar: 'conditionals,1',
            icon: 'tr-exp-icon'
        });   
    }
});
