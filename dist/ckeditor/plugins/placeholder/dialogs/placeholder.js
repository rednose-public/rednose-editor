/*
 Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add("placeholder",function(b){var c=b.lang.placeholder,b=b.lang.common.generalTab,d=/^[^\[\]\<\>]+$/;return{title:c.title,minWidth:300,minHeight:80,contents:[{id:"info",label:b,title:b,elements:[{id:"placeholderKind",type:"select",label:"Type",items:[["Dynamic"],["Static"]],required:!0,validate:CKEDITOR.dialog.validate.regex(d,c.invalidName),setup:function(a){this.setValue(a.data.placeholderKind)},commit:function(a){a.setData("placeholderKind",this.getValue())}},{id:"name",type:"text",
style:"width: 100%;",label:c.name,"default":"",required:!0,validate:CKEDITOR.dialog.validate.regex(d,c.invalidName),setup:function(a){this.setValue(a.data.name)},commit:function(a){a.setData("name",this.getValue())}}]}]}});