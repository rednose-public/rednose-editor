
CKEDITOR.plugins.add( 'conditionals', {

    icons: 'text-exp-icon,tr-exp-icon,tr-exp-remove-icon,text-exp-remove-icon', // %REMOVE_LINE_CORE%
    hidpi: false, // %REMOVE_LINE_CORE%

    onLoad: function() {
        CKEDITOR.addCss(
            'span[data-condition-id]::before { content: \'{\'; background-color: yellow; border: 1px dashed black; color: black; font-weight: bold; margin: 1px; padding: 1px; }' +
            'span[data-condition-id]::after  { content: \'}\'; background-color: yellow; border: 1px dashed black; color: black; font-weight: bold; margin: 1px; padding: 1px; }' +
            'span[data-condition-id] br[type="_moz"]{ display: none; }' +
            'tr[data-condition-id] td:first-child:before { content: \' { ^ } \'; background-color: yellow; border: 1px dashed black; color: black; font-weight: bold; margin: 1px; padding: 1px; }'
        );
    },

    init: function(editor) {
        var self = this;

        var findSelectedConditions = function () {
            var sel = editor.getSelection(),
                buffer = [],
                ranges = sel.getRanges();                         

            if (ranges.length > 0) {
                range = ranges[0];

                var ancestor = range.getCommonAncestor(),
                    boundary = range.getBoundaryNodes();

                var nodes = getNodesBetween(ancestor.$, boundary.startNode.$, boundary.endNode.$);

                for (var i in nodes) {
                    if (nodes[i].nodeType !== 3 && nodes[i].tagName.toUpperCase() !== 'TR' && nodes[i].hasAttribute('data-condition-id')) {
                        buffer.push(nodes[i]);
                    }
                }
                
                if (boundary.startNode.$.parentNode.hasAttribute('data-condition-id') === true && boundary.startNode.$.parentNode.tagName.toUpperCase() !== 'TR') {
                    buffer.push(boundary.startNode.$.parentNode);
                }
            }

            return buffer;
        };

        var getNodesBetween = function(rootNode, startNode, endNode) {
            var reachedStartNode = false,
                reachedEndNode = false,
                buffer = [];

            getNodes = function(node) {
                if (node === startNode) {
                    reachedStartNode = true;
                } else if (node === endNode) {
                    reachedEndNode = true;
                } else {
                    if (reachedStartNode === true && reachedEndNode === false) {
                        buffer.push(node);
                    }

                    for (var i = 0, len = node.childNodes.length; (reachedEndNode === false && i < len); ++i) {
                        getNodes(node.childNodes[i]);
                    }
                }
            }

            getNodes(rootNode);

            return buffer;
        };

        var parentCondition = function(selectionIsEmpty, ranges) {
            if (selectionIsEmpty === true && ranges.length > 0) {
                var node = ranges[0].endContainer.$;

                while (node.parentNode) {
                    if (node.hasAttribute && node.hasAttribute('data-condition-id') && node.tagName.toUpperCase() === 'SPAN') {
                        return node;
                    }

                    node = node.parentNode;
                }
            }

            return false;
        };

        var findConditionNode = function () {
            var sel = editor.getSelection(),
                ranges = sel.getRanges(),
                affectedCondition = parentCondition(true, ranges);

            return affectedCondition;
        };

        var findRow = function () {
            var sel = editor.getSelection(),
                ranges = sel.getRanges();
                
            if (ranges.length > 0) {
                var node = ranges[0].endContainer.$;

                while (node.parentNode) {
                    if (node.nodeType !== 3 && node.tagName.toUpperCase() === 'TR') {
                        return node;
                    }
                    
                    node = node.parentNode;
                }
            }
            
            return null;
        };

        var toolbarState = function () {
            var sel = editor.getSelection(),
                ranges = sel.getRanges(),
                selectionIsEmpty = sel.getType() == CKEDITOR.SELECTION_NONE || ( ranges.length == 1 && ranges[0].collapsed );            

            var rowState = function () {
                if (selectionIsEmpty === true && ranges.length > 0) {
                    parentNode = ranges[0].startContainer.$;

                    while (parentNode) {
                        if (parentNode.tagName && parentNode.tagName.toUpperCase() === 'TR') {
                            if (parentNode.hasAttribute('data-condition-id')) {
                                return CKEDITOR.TRISTATE_ON
                            }
                        
                            return CKEDITOR.TRISTATE_OFF;
                        }
                        
                        parentNode = parentNode.parentNode;
                    }
                }
                
                return CKEDITOR.TRISTATE_DISABLED;
            };

            editor.getCommand('rowCondition').setState(rowState());
            editor.getCommand('removeRowCondition').setState(rowState() === CKEDITOR.TRISTATE_ON ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);

            editor.getCommand('textCondition').setState(
                selectionIsEmpty === true ? (parentCondition(selectionIsEmpty, ranges) !== false ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_DISABLED) : CKEDITOR.TRISTATE_OFF
            );            
            editor.getCommand('removeTextCondition').setState(findSelectedConditions().length > 0 ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
        };

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
                }, 10);
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
                var state = editor.getCommand('textCondition').state,
                    conditionNode = findConditionNode();

                if (state === CKEDITOR.TRISTATE_ON) {
                    if (!conditionNode) {
                        return;
                    }
                    
                    CKEDITOR.fire('modifyTextCondition', {
                        editor: editor,
                        node: conditionNode,
                        callback: function (expressionId, node) {
                            _modifyCondition(expressionId, node)
                             
                            toolbarState();
                        }
                    });
                } else {
                    CKEDITOR.fire('createTextCondition', {
                        editor: editor,
                        node: conditionNode,
                        callback: function (expressionId) {
                            _createCondition(expressionId);
                             
                            toolbarState();
                        }
                    });
                }
            }
        });

        editor.addCommand('removeTextCondition', {
            startDisabled: true,
            allowedContent: 'span[data-condition-id]',

            exec: function (editor) {
                var conditionNodes = findSelectedConditions();

                for (var i in conditionNodes) {
                    var node = new CKEDITOR.dom.node(conditionNodes[i]);

                    node.remove(true);
                }
            }
        });

        editor.addCommand('rowCondition', {
            startDisabled: true,
            allowedContent: 'tr[data-condition-id]',

            exec: function (editor) {
                var state = editor.getCommand('rowCondition').state,
                    rowNode = findRow();

                if (!rowNode) {
                    return;
                }

                if (state === CKEDITOR.TRISTATE_ON) {
                    CKEDITOR.fire('modifyRowCondition', {
                        editor: editor,
                        node: rowNode,
                        callback: function (expressionId, node) {
                            _modifyRowCondition(expressionId, node);
                            
                            toolbarState();
                        }
                    });
                } else {
                    CKEDITOR.fire('createRowCondition', {
                        editor: editor,
                        node: rowNode,
                        callback: function (expressionId, node) {
                            _createRowCondition(expressionId, node);
                            
                            toolbarState();
                        }
                    });
                }
            }
        });
        
        editor.addCommand('removeRowCondition', {
            startDisabled: true,
            allowedContent: 'tr[data-condition-id]',

            exec: function (editor) {
                var rowNode = findRow();
                
                if (rowNode) {
                    rowNode.removeAttribute('data-condition-id');
                    toolbarState();
                }
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
      
        var _modifyCondition = function(expressionId, node) {
            var affectedCondition = node;
            
            affectedCondition.setAttribute('data-condition-id', expressionId);
        };

        var _createCondition = function(expressionId) {
            editor.applyStyle(new CKEDITOR.style({
                element: 'span',
                attributes : { 'data-condition-id' : expressionId }
            }));
        };
        
        var _modifyRowCondition = function (expressionId, node) {
            var rowNode = node;

            if (rowNode) {
                rowNode.setAttribute('data-condition-id', expressionId);
            }
        };

        var _createRowCondition = function(expressionId, node) {
            var rowNode = node;

            if (rowNode) {
                rowNode.setAttribute('data-condition-id', expressionId);
            }
        }
    },
});
