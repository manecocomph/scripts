
jQuery.fn.extend({
    refreshSuggest: function() {
        let options = $(this).attr("options");
        let curVal = $(this).val();
        if (options && curVal) {
            let optionsHtml = "";
            let optionList = options.split(",");
            let matchedCount = 0;
            for (let option of optionList) {
                if (option.indexOf(curVal) > -1) {
                    optionsHtml += `<li><input name='_suggest' val='${option}' value='${option}' readonly/></li>`;
                    if (matchedCount++ > 10) {
                        break;
                    }
                }
            };
            let suggestDiv = this.prev("div[name='_suggest']");
            suggestDiv.find("ol[name='_suggest']").html(optionsHtml);

            suggestDiv.find("input[name='_suggest']").keyup(event => {
                const key = event.keyCode;
                let cur = $(event.target);
                if (40 === key) {//down array
                    cur.css("backgroundColor", "");
                    let next = cur.parent().next().find("input");
                    if (0 === next.length) {
                        next = cur.parent().parent().find("input").first();
                    }
                    next.css('backgroundColor', 'lightgray');
                    next.focus();
                } else if (38 === key) {//up array
                    cur.css("backgroundColor", "");
                    let prev = cur.parent().prev().find("input");
                    if (0 === prev.length) {
                        prev = cur.parent().parent().find("input").last();
                    }
                    prev.css('backgroundColor', 'lightgray');
                    prev.focus();
                } else if (13 === key) {//carriage ret
                    $(this).val(cur.val());
                    suggestDiv.find("ol").html("");
                    $(this).focus();
                }

            });

            suggestDiv.find("input[name='_suggest']").click(event => {
                let cur = $(event.target);
                $(this).val(cur.val());
                suggestDiv.find("ol").html("");
                $(this).focus();
            });
        }
    },
    addSuggest: function() {
        let suggestDiv = this.prev("div[name='_suggest']");
        if (!suggestDiv || "_suggest" !== $(suggestDiv).attr("name")) {
            $("<div name='_suggest' style='position:relative;display:inline-block;'><ol name='_suggest' style='z-index:100;position:absolute;top:1em;padding-left:1em;'></ol></div>" ).insertBefore(this);
            suggestDiv = this.prev("div[name='_suggest']");
        }

        this.keyup(event => {
            const key = event.keyCode;
            let suggestDiv = this.prev("div[name='_suggest']");
            if (13 === key) {//carriage ret
                if (suggestDiv.find("input").length < 1) {
                    return;
                }
                let first = suggestDiv.find("input");
                if (first) {
                    this.val(first.val());
                }
                suggestDiv.find("ol").html("");
            } else if (40 === key) {// down array
                if (suggestDiv.find("input").length < 1) {
                    return;
                }
                let first = suggestDiv.find("input").first();
                if (first) {
                    first.css('backgroundColor', 'lightgray');
                    first.focus();
                }
            } else if (38 === key) {// up array
                if (suggestDiv.find("input").length < 1) {
                    return;
                }
                let last = suggestDiv.find("input").last();
                if (last) {
                    last.css('backgroundColor', 'lightgray');
                    last.focus();
                }
            } else {
                this.refreshSuggest();
            }
        });
        this.refreshSuggest();
    }
});

