CKEDITOR.plugins.add( 'default_style', {
    init: function(ed) {
        CKEDITOR.on('instanceReady', function (evt) {
            var defaultStyle = null;

            if (ed.config.default_paragraph_style) {
                defaultStyle = ed.config.default_paragraph_style;

                evt.editor.on('change', function (e) {
                    var newParagraph = e.editor.getSelection().getStartElement();

                    if (newParagraph.$.tagName.toLowerCase() !== 'p') {
                        return;
                    }
                    
                    if (
                        newParagraph.$.parentNode.tagName.toLowerCase() === 'td' ||
                        newParagraph.$.parentNode.tagName.toLowerCase() === 'th') {
                        return;
                    }

                    if (!newParagraph.getAttribute('class')) {                        
                        newParagraph.addClass(defaultStyle);
                    }
               });
            }
        });
    }
});
