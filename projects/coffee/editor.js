/* global ace */
/* global CoffeeScript */
/* global BigDecimal */
/* global $ */

// Basic setup

$('link[href="darktheme.css"]')[0].disabled = true;

var editor = ace.edit("editor");
editor.setTheme("ace/theme/textmate");
editor.getSession().setMode("ace/mode/coffee");
editor.setShowPrintMargin(false);

editor.setBehavioursEnabled(true);

editor.setOptions({
	enableBasicAutocompletion: true,
	enableLiveAutocompletion: false,
});

editor.$blockScrolling = Infinity;

if(window.localStorage.getItem("localCode")) editor.setValue(window.localStorage.getItem("localCode"));

editor.selection.clearSelection();

var code;
var selection;
var textColor = "#000";
var $console = document.getElementById("console");

// Options initialization ---------------------------------------------------------

// JS Evaluation Settings

var isJS = false;

if(window.localStorage.getItem("isJSCache")) isJS = window.localStorage.getItem("isJSCache");

if(window.localStorage.getItem("isJSCache") == "true") {
    $('#jsEval').prop("checked", true);
    editor.getSession().setMode("ace/mode/javascript");
    $('#title').html('Instant JS');
    isJS = true;

}

// Dark Theme Settings

var isDark = false;

if(window.localStorage.getItem("isDarkCache")) isDark = window.localStorage.getItem("isDarkCache");

if(window.localStorage.getItem("isDarkCache") == "true") {
    $('#dark').prop('checked', true);
    $('link[href="darktheme.css"]')[0].disabled = false;
    editor.setTheme("ace/theme/ambiance");
    textColor = "#FEFEFE";
}

// Word Wrap Settings

var isWrap = false;

if(window.localStorage.getItem("isWrapCache")) isWrap = window.localStorage.getItem("isWrapCache");

if(window.localStorage.getItem("isWrapCache") == "true") {
    $('#wrap').prop('checked', true);
    $('#console')[0].style.whiteSpace = "pre-wrap";
}

// UI Panel Settings

var showPanel = false;

if(window.localStorage.getItem("showPanelCache")) showPanel = window.localStorage.getItem("showPanelCache");

if(window.localStorage.getItem("showPanelCache") == "true") {
    $('#panel').prop('checked', true);
    $('#customPanel')[0].style.visibility = "visible";
    $('#customPanel')[0].style.opacity = "1";
}

// ---------- Checkbox Change Listeners -----------------

$('#jsEval').change(function() {
    if($(this).is(':checked')) {
        editor.getSession().setMode("ace/mode/javascript");
        isJS = true;

        $('#title').html('Instant JS');
    } else {
        editor.getSession().setMode("ace/mode/coffee");
        isJS = false;

        $('#title').html('Instant Coffee');
    }
    evaluate();
    window.localStorage.setItem("isJSCache", isJS);
});

$('#dark').change(function() {
    console.log("whoop");
    if($(this).is(':checked')) {
        $('link[href="darktheme.css"]')[0].disabled = false;
        editor.setTheme("ace/theme/ambiance");
        textColor = "#FEFEFE";
        isDark = true;
    } else {
        $('link[href="darktheme.css"]')[0].disabled = true;
        editor.setTheme("ace/theme/textmate");
        textColor = "#000";
        isDark = false;
    }
    evaluate();     // Seems unnecessary, but this updates text in console so it shows the correct color
    window.localStorage.setItem("isDarkCache", isDark);
});

$('#wrap').change(function() {
    console.log("hot dam");
    if($(this).is(':checked')) {
        $('#console')[0].style.whiteSpace = "pre-wrap";
        isWrap = true;
    } else {
        $('#console')[0].style.whiteSpace = "nowrap";
        isWrap = false;
    }
    window.localStorage.setItem("isWrapCache", isWrap);
});

$('#panel').change(function() {
    if($(this).is(':checked')) {
        $('#customPanel')[0].style.transitionDelay = "0s";
        $('#customPanel')[0].style.visibility = "visible";
        $('#customPanel')[0].style.opacity = "1";
        showPanel = true;
    } else {
        $('#customPanel')[0].style.transition = "visibility 0s 0.2s, opacity 0.2s";
        $('#customPanel')[0].style.visibility = "hidden";
        $('#customPanel')[0].style.opacity = "0";
        showPanel = false;
    }
    window.localStorage.setItem("showPanelCache", showPanel);
});

// JQuery builtin listeners

$(document).ready(function() {
    $('.panelCollapse').click(function() {
        console.log("clicky");
        $('#panel').bootstrapToggle('off');
        $('#customPanel')[0].style.transition = "visibility 0s 0.2s, opacity 0.2s";
        $('#customPanel')[0].style.visibility = "hidden";
        $('#customPanel')[0].style.opacity = "0";
    });

    $('#save').click(function() { save() });
    $('#add').click(function() { add() });
});

// Saving Stuff

var saveArray = [];

if(window.localStorage.getItem("saveArray")) saveArray = JSON.parse(window.localStorage.getItem("saveArray"));

function save() {
    console.log("saving");
    code = editor.getValue();
    var name = $("#saveName").val();
    if(isJS == true) {
        saveArray.push("// "+name+"\n"+code);
    } else {
        saveArray.push("# "+name+"\n"+code);
    }
    window.localStorage.setItem("saveArray", JSON.stringify(saveArray));
    updateSavedPrograms();
}

function del(program) {
    saveArray.splice(program, 1);
    window.localStorage.setItem("saveArray", JSON.stringify(saveArray));
    updateSavedPrograms();
}

function updateSavedPrograms() {
    $("#savedTableContainer").html("<table class='table table-border' id='savedTable'>");
    for(var i = 0; i < saveArray.length; i++) {
        $("#savedTable").append("<tr> <td class='small lessImportant'>"+saveArray[i].split("\n")[0]+"</td> <td> <div class='btn-group pullRight'> <div class='btn btn-danger pullRight' onclick='del("+i+")'>Delete</div> <div class='btn btn-primary load' data-dismiss='modal' onclick='loadProgram("+i+")'> Load </div> </div> </td> </tr>");
    }
}

function loadProgram(program) {
    editor.setValue(saveArray[program]);
    editor.selection.clearSelection();
    if(saveArray[program].substr(1,1) == "/") {
        $('#jsEval')
    }
    evaluate();
}

// Custom Framework Stuff

var frameworks = [];

if(window.localStorage.getItem("frameworks")) frameworks = JSON.parse(window.localStorage.getItem("frameworks"));

function add() {
    var url = $("#cdnUrl").val();
    $("head").append("<script src="+url+"></script>");
    frameworks.push(url);
    window.localStorage.setItem("frameworks", JSON.stringify(frameworks));
    updateFrameworks();
}

function deleteCDN(index) {
    console.log("removing");
    var newHead = $("head").html().replace("<script src=\""+frameworks[index]+"\"></script>", "");
    $("head").html(newHead);
    frameworks.splice(index, 1);
    window.localStorage.setItem("frameworks", JSON.stringify(frameworks));
    updateFrameworks();
    location.reload();
}

function updateFrameworks(firstLoad) {
    $("#cdnContainer").html("<table class='table table-border' id='cdnTable'>");
    for(var i = 0; i < frameworks.length; i++) {
        $("#cdnTable").append("<tr> <td class='small lessImportant'>"+frameworks[i]+"</td> <td> <div onclick='deleteCDN("+i+");'> <span class='glyphicon glyphicon-remove clickable pullRight makeRed'></span> </div>");
        if(firstLoad) {
            $("head").append("<script src="+frameworks[i]+"></script>");
        }
    }
    evaluate();
}

// ---------------------------------------------------------------------------------------------------------------

editor.getSession().selection.on('changeSelection', function(e) {
    if(!editor.selection.isEmpty()) {
        selection = editor.session.getTextRange(editor.getSelectionRange());
        code = editor.getValue();

        if(!~code.indexOf("return") && !isJS) {
            code = code+"\nout "+selection;
        }

        clear();
        try {
            if(isJS == true) { eval(code); } else { CoffeeScript.eval(code); }
            $console.style.color = textColor;
            $console.style.backgroundColor = "#FFF";
            $console.style.opacity = "1";
        } catch (e) {
            out(e);
            $console.style.color = "#F00";
            $console.style.backgroundColor = "#EEE";
            $console.style.opacity = "0.7";
        }
        code = editor.getValue();
    } else {
        clear();
        try {
            if(isJS == true) { eval(code); } else { CoffeeScript.eval(code); }
            $console.style.color = textColor;
            $console.style.backgroundColor = "#FFF";
            $console.style.opacity = "1";
        } catch (e) {
            out(e);
            $console.style.color = "#F00";
            $console.style.backgroundColor = "#EEE";
            $console.style.opacity = "0.7";
        }
    }
});

editor.getSession().on('change', evaluate);

document.addEventListener("keypress", function(e) {
    setTimeout(function() {
        if(e.key == "(") {
            editor.insert(")");
            editor.selection.moveCursorBy(0, -1);
        }
        if(e.key == "{") {
            editor.insert("}");
            editor.selection.moveCursorBy(0, -1);
        }
        if(e.key == "[") {
            editor.insert("]");
            editor.selection.moveCursorBy(0, -1);
        }
        if(e.key == "\"") {
            editor.insert("\"");
            editor.selection.moveCursorBy(0, -1);
        }
        if(e.key == "'") {
            editor.insert("'");
            editor.selection.moveCursorBy(0, -1);
        }
    });
});

document.getElementById("bean").addEventListener("click", function(e) {
    console.log("BEAN!");
    document.getElementById("bean").style.color = "#"+Math.floor(Math.random()*16*16*16).toString(16);
    editor.setValue(codeSamples[Math.floor(Math.random()*codeSamples.length)]);
    editor.selection.clearSelection();
});

// Custom functions -----------------------

function out(string) {
    $console.innerHTML += string+"<br>";
}

function clear() {
    $("#customPanel").html('<span class="glyphicon glyphicon-remove panelCollapse"></span> <div class="centered title"> <i>' + CustomPanel.title + '</i> </div> <hr>');
    $console.innerHTML = "";
}

function show(variable) {
    out(JSON.stringify(variable, undefined, 3));
}

function rand(arg) {
    if(typeof arg == "number") {
        return Math.floor(Math.random()*arg);
    }
    if(typeof arg == "string") {
        return arg.charAt(rand(arg.length));
    }
    return arg[rand(arg.length)];
}

// Conversion stuff.

var units = {
    km: new BigDecimal("1"),
    m: new BigDecimal("0.001"),
    cm: new BigDecimal("0.00001"),
    nm: new BigDecimal("0.000000000001"),

    mi: new BigDecimal("0.621371"),
    nautMi: new BigDecimal("0.539957"),    // Nautical Mile
    ft: new BigDecimal("0.00032808398"),    // This one is correct, everything else should be inverted

    ER: new BigDecimal("6371"),   // Earth Radius
    LD: new BigDecimal("384402"),     // Lunar Distance
    AU: new BigDecimal("149597870.7"),    // Astronomical Unit (Whatever that is)
    ly: new BigDecimal("9460730472580.8"),  // Lightyear
    pc: new BigDecimal("30856775814671.9"),     // Parsec

    planck: new BigDecimal("1.61605e-38"),      // Planck Length
    qcd: new BigDecimal("2.103e-19"),       // Quantum Chromodynamics Unit (That's a thing, I guess)

    bs: new BigDecimal("0.000000000005"),    // Beard-seconds
    ff: new BigDecimal("0.11"),         // Football Fields
    hair: new BigDecimal("0.000000000080"),      // Hair (approximated)
};

var u = units;

function convert(from, to) {
    return units[from].divide(units[to]);
}

function formatNumber(value) {   // http://stackoverflow.com/questions/5731193/how-to-format-numbers-using-javascript - This looked terrible so I just copied it and adjusted
    var valString = value.toString();
    if(valString.indexOf('.') < 3 && ~valString.indexOf('.')) {
        return 'formatNumber should not be used on small numbers.';
    }
    var s = ''+(Math.floor(value)), d = value % 1, i = s.length, r = '';
    while ( (i -= 3) > 0 ) { r = ',' + s.substr(i, 3) + r; }
      return s.substr(0, i + 3) + r +
        (d ? '.' + Math.round(d * Math.pow(10, 2)) : '');
}

// Derivatives AKA Regex Land
var derivative = function (eq, x, round) {
    var incrementedEquation = eq.replace(/x/g, ("("+(x+0.00000000000001)+")")).replace("y=", "");
    var regularEquation = eq.replace(/x/g, "("+(x)+")").replace("y=", "");
    return math.round(((math.eval(incrementedEquation)-math.eval(regularEquation))*100000000000000), round || 6);
}

var quadraticDerivative = function(eq, x, round) {
    // y=ax^2+bx+c
    eq = eq.replace("y=", "");

    var a = eq.charAt(eq.indexOf("x^2")-1);
    if(a == "*") a = eq.charAt(eq.indexOf("x^2")-2);
    if(!/[0-9]/g.test(a)) out(eq+" must be in standard form. a is invalid.");

    if(eq.charAt(eq.indexOf(a)-1) == "-") a = "-"+a;

    var b = eq.charAt(/[\+-][0-9]x(^\^|$)/g.exec(eq).index-1);
    if(b == "*") b = eq.charAt(/[\+-][0-9]x(^\^|$)/g.exec(eq).index-2);
    if(!/[0-9]/g.test(b) && b) out(eq+" must be in standard form. b is invalid.");

    b = parseFloat(b);

    if(~eq.charAt(/[\+-][0-9]x(^\^|$)/g.exec(eq)[0].indexOf("-"))) {
        return math.eval((2*a)*x+b);
    } else {
        return math.eval((2*a)*x-b);
    }
}

// UI Editor

var CustomPanel = {};

CustomPanel.title = "Custom Panel";

CustomPanel.help = ` -= Custom Panel Help =-
Custom Panel is a panel available
to you to create a UI for your program.
There are several different properties:

.addButton(title, type, callback) -
Creates a button with the text 'title',
the type 'type' (primary, default,
success, info, warning, danger, link),
the id title+'Btn' and the callback
function 'callback'.

.addInput(type, placeholder, id) -
Creates an input field of type type,
placeholder text (if applicable) of
placeholder, and an id of id.

.space() -
Adds vertical space between units.

.addHTML(html) -
Creates a custom unit based on what
is passed to it. Any HTML can be passed
to this function to create a unit.`;

CustomPanel.addButton = function(title, type, callback) {
    var button = $("<div>")
        .attr("id", title + "Btn")
        .addClass("btn btn-" + type)
        .text(title)
        .click(callback);

    $("#customPanel").append(button);
};

CustomPanel.addInput = function(type, placeholder, id) {
    var input = $("<input>")
        .attr("id", id)
        .prop("type", type)
        .prop("placeholder", placeholder)
        .removeAttr("data-toggle")
        .addClass("form-control");

    $("#customPanel").append(input);
};

CustomPanel.space = function() {
    $("#customPanel").append("<br>");
}

CustomPanel.addHTML = function(html) {
    var customDiv = $("<div>")
        .html(html);

    $("#customPanel").append(customDiv);
}

// Greetings ------------------------------

var codeSamples = [
`out i for i in [1..10]`,

`a = [1..10]
show a`,

`fib = (n) ->
    [x, y] = [0, 1]
    while x < n
        [x, y] = [y, x+y]
        out x
    return ""

fib 1000`,

`out "Potatoes."`,

`out "NO POTATOES!"
clear()
out "Potatoes."`,

`out "If you don't like the undefined at the bottom, add an empty string to the end of the script."
""`,


`out rand "potatoes for everyone"
out "If you want to re-evaluate your code without changing it, press (ctrl/cmd)-enter"`,

`# Instant Coffee features a convertion/unit library.

out u.ly # Shortcut for full keyword, same as units.ly
out units.planck # Full syntax

out convert('km', 'nm')
`,
];

// Key combos

editor.commands.addCommand({
    name: "eval",
    bindKey: {win: "ctrl-enter", mac: "cmd-enter"},
    exec: evaluate
})

// Super fun stuff

function evaluate() {

    code = editor.getValue();

    clear();
    try {
        if(~code.indexOf("return")) {
            if(isJS == true) {
                out(eval(code));
            } else {
                out(CoffeeScript.eval(code));
            }
        } else {
            if(isJS == true) {
                out("<span class='text-muted'>"+eval(code)+"</span>");
            } else {
                out("<span class='text-muted'>"+CoffeeScript.eval(code)+"</span>");
            }
        }
        $console.style.color = textColor;
        $console.style.backgroundColor = "#FFF";
        $console.style.opacity = "1";
    } catch (e) {
        out(e+" at "+e.lineNumber);
        $console.style.color = "#F00";
        $console.style.backgroundColor = "#EEE";
        $console.style.opacity = "0.7";
    }
    $(".customPanelTitle").text(CustomPanel.title);
    window.localStorage.setItem("localCode", code || "");
}

// Runs script on load (theoretically)

evaluate();
updateSavedPrograms();
updateFrameworks(true);
