CKEDITOR.plugins.add( 'conditionals', {

    icons: 'text-exp-icon,tr-exp-icon,tr-exp-remove-icon,text-exp-remove-icon', // %REMOVE_LINE_CORE%
    hidpi: false, // %REMOVE_LINE_CORE%

    onLoad: function() {
        CKEDITOR.addCss(
            '*[data-condition-id]::after { content: \'}\'; background-color: yellow; border: 1px dashed black; font-weight: bold; margin: 1px; padding: 1px; }' +
            '*[data-condition-id] br[type="_moz"]{ display: none; }'
        );
        
        for (var i = 0; i < 999; i++) {
            CKEDITOR.addCss(
                '*[data-condition-id="' + i + '"]::before { content: \'{ ' + i +': \'; background-color: yellow; border: 1px dashed black; font-weight: bold; margin: 1px; padding: 1px; }'
            );
        }
    },

    init: function(editor) {
        var self = this;               

        findSelectedConditions = function () {
            var sel = editor.getSelection(),
                ranges = sel.getRanges();                            

            console.log(ranges);
//            var parentNodes = ranges[0].cloneContents(),
//                ids = [];

            //parentNodes = parentNodes.getChildren().$;

            // Ranges contain
            /*(parentNodes.forEach(function(item) {
                //console.log(item.querySelectorAll('[data-condition-id]'));
                /*var node = ranges[0].endContainer.$;

                

                while (node.parentNode) {
                    if (node.hasAttribute && node.hasAttribute('data-condition-id')) {
                        ids.push(node.getAttribute('data-condition-id'))
                    }

                    nod*e = node.parentNode;
                }
            });
*/
            return ids;
        }

        toolbarState = function () {
            var sel = editor.getSelection(),
                ranges = sel.getRanges(),
                selectionIsEmpty = sel.getType() == CKEDITOR.SELECTION_NONE || ( ranges.length == 1 && ranges[0].collapsed );            

            var caretInsideCondition = function() {
                if (selectionIsEmpty === true) {
                    var node = ranges[0].endContainer.$;
                    
                    while (node.parentNode) {
                        if (node.hasAttribute && node.hasAttribute('data-condition-id')) {
                            return true;
                        }

                        node = node.parentNode;
                    }
                }
                
                return false;
            }

            editor.getCommand('textCondition').setState(
                selectionIsEmpty === true ? (caretInsideCondition() === true ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_DISABLED) : CKEDITOR.TRISTATE_OFF
            );            
            editor.getCommand('removeTextCondition').setState(findSelectedConditions().length > 0 ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
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
            allowedContent: 'span[data-condition-id]',

            exec: function (editor) {                
                CKEDITOR.fire('textCondition', { editor: editor, callback: self._callback });
            }
        });

        editor.addCommand('removeTextCondition', {
            startDisabled: true,
            allowedContent: 'span[data-condition-id]',

            exec: function (editor) {                
            }
        });

        editor.addCommand('rowCondition', {
            startDisabled: true,
            allowedContent: 'tr[data-condition-id]',

            exec: function (editor) {
                CKEDITOR.fire('textCondition', { editor: editor, callback: self._callback });
            }
        });

        editor.ui.addButton('TextCondition', {
            label: 'Conditional Text',
            command: 'textCondition',
            toolbar: 'conditionals,0',
            icon: 'text-exp-icon'
        });

        editor.ui.addButton('RemoveTextCondition', {
            label: 'Remove Text Conditional',
            command: 'removeTextCondition',
            toolbar: 'conditionals,1',
            icon: 'text-exp-remove-icon'
        });
        
        editor.ui.addButton('RowCondition', {
            label: 'Conditional Row',
            command: 'rowCondition',
            toolbar: 'conditionals,2',
            icon: 'tr-exp-icon'
        });

        editor.ui.addButton('RemoveRowCondition', {
            label: 'Remove Row Conditional',
            command: 'removeRowCondition',
            toolbar: 'conditionals,3',
            icon: 'tr-exp-remove-icon'
        });
    },

    _callback: function(expressionId) {
        editor.applyStyle(new CKEDITOR.style({
            element: 'span',
            attributes : { 'data-condition-id' : expressionId }
        }));
    }
});
