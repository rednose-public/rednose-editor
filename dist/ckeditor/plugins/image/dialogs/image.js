﻿CKEDITOR.dialog.add("image",function(){return{title:"Image properties",minWidth:310,minHeight:100,contents:[{id:"info",elements:[{id:"alt_text",type:"text",label:"Alt text","default":"",setup:function(a){this.setValue(a.data.alt)},commit:function(a){a.setData("alt",this.getValue())}}]}]}});