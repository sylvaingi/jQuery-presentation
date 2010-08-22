jQuery(window).load(function(){

    jQuery(".code").keydown(function(e){
        if (this.setSelectionRange) {
            var start = this.selectionStart, val = this.value;

            if (e.keyCode == 13) {
              var match = val.substring(0, start).match(/(^|\n)([ \t]*)([^\n]*)$/);
              if (match) {
                var spaces = match[2], length = spaces.length + 1;
                this.value = val.substring(0, start) + "\n" + spaces + val.substr(this.selectionEnd);
                this.setSelectionRange(start + length, start + length);
                e.stopImmediatePropagation();
                e.preventDefault();
              }
              this.rows=this.value.split('\n').length+1;
            }
            else {
              if (e.keyCode == 8) {
                if (val.substring(start - 2, start) == "  ") {
                  this.value = val.substring(0, start - 2) + val.substr(this.selectionEnd);
                  this.setSelectionRange(start - 2, start - 2);
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              }
              else 
                if (e.keyCode == 9) {
                  this.value = val.substring(0, start) + "  " + val.substr(this.selectionEnd);
                  this.setSelectionRange(start + 2, start + 2);
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
            }
            this.rows=this.value.split('\n').length;
        }
    }).keyup(function(e){
        e.stopImmediatePropagation();
    }).keypress(function(e){
        e.stopImmediatePropagation();
    });
    
    jQuery("pre").click(function(e){
        var $this = $(this);
        if ($this.parent().data("dragged")) {
            $this.parent().data("dragged", false);
            return false;
        }
        $this.hide().next("textarea.code").show().focus().parent("div.code-example").css({
            "background-color": "white"
        });
    });
    
    jQuery("textarea.code").blur(function(){
        $(this).hide().prev("pre").html($(this).val()).chili().show().parent("div.code-example").css({
            "background-color": ""
        });
    });
    
    
    jQuery("pre").each(function(index, element){
        var $this = $(this), code = $this.html().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/(^|\n) /g, "$1").replace(/ ($|\n)/g, "$1");
        
        $this.html(code);
        
        $this.next("textarea.code").val(code).css({
            "width": $this.innerWidth() + "px"
        }).attr("rows",code.split("\n").length);
        
        $this.chili();
        
    });
    
    $("div.code-example").draggable({
        containment: "parent",
        stop: function(e){
            $(e.target).data("dragged", true);
        }
    });
    
    jQuery("button.live-test").click(function(){
        try {
            (new Function(jQuery("#code-" + this.id).val()))();
        } 
        catch (e) {
            alert(e.message);
        }
        return false;
    });
    
});