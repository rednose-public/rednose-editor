CKEDITOR.plugins.add( 'default_style', {
    init: function(ed) {
        CKEDITOR.on('instanceReady', function (evt) {
            var defaultStyle = null;

            if (ed.config.default_paragraph_style) {
                defaultStyle = ed.config.default_paragraph_style;

                evt.editor.on('change', function (e) {
                    var newParagraph = e.editor.getSelection().getStartElement();

                    // New list-item(s)
                    if (newParagraph.$.parentNode.tagName.toLowerCase() === 'ol' || newParagraph.$.parentNode.tagName.toLowerCase() === 'ul') {
                        var range = e.editor.getSelection().getRanges();

                        var listItems = newParagraph.getParent().find('li');

                        for (var i = 0; i < listItems.count(); i++) {
                            var element = listItems.getItem(i);
                            
                            element.removeAttribute('class');
                            
                            if (element.find('p').count() === 0 && listItems.count() === 1) { // Single new item
                                var wrapper = range[0].fixBlock(true, 'p');
                            
                                wrapper.addClass(defaultStyle);                            

                                e.editor.getSelection().selectRanges(range);
                            } else if (element.find('p').count() === 0 && listItems.count() > 1) { // Multiple new items
                                element.setHtml('<p class="' + defaultStyle + '">' + element.getHtml() + '</p>')
                            }                           
                        }                        
                    }
                    
                    // New paragraph
                    if (newParagraph.$.tagName.toLowerCase() === 'p') {
                        if (!newParagraph.getAttribute('class')) {
                            newParagraph.addClass(defaultStyle);
                        }
                    }
               });
            }
        });
    }
});

