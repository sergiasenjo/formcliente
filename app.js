function $(id) {
    return document.getElementById(id);
}

var ns = (function (ns) {
    ns.SECTION_1 = "sectionAdd";
    ns.SECTION_2 = "sectionTable";
    ns.SECTION_3 = "sectionRemove";
    ns.VALUE = "Valor";
    ns.CLASS = "Clase";
    ns.ADD = "Añadir";
    ns.REMOVE = "Eliminar";
    ns.TABLE = "Tabla";
    ns.LIST = "Lista";
    ns.SECTION_IDS = [ns.SECTION_1, ns.SECTION_2, ns.SECTION_3];
    ns.ADDSECTION_INPUTS = [ns.VALUE, ns.CLASS];
    ns.AllObjects = new AllObjects;
    return ns;
}({}));

function AllObjects() {
    this.objects = [];
}

function TableObject(clase, valor) {
    this.clase = clase;
    this.valor = valor;
}

AllObjects.prototype.insertData = function(claseValue, valorValue) {
    this.objects.push(new TableObject(claseValue, valorValue));
}

AllObjects.prototype.removeData = function(items) {
    this.objects = items;
}

function addTag(tag, id) {
    tag = document.createElement(tag);
    tag.id = id;
    return tag;
}

function createOption(object) {
    var option = document.createElement("option");
    option.appendChild(document.createTextNode(object.valor));
    option.className = object.clase;
    return option;
}

function createSelect(id) {
    var select = document.createElement("select");
    select.id = id;
    return select;
}

function createSections() {
    var a;
    ns.SECTION_IDS.forEach(function (x) {
        document.body.appendChild(addTag("section", x));
    });
}

function elementsAddSection() {
    ns.ADDSECTION_INPUTS.forEach(function (x) {
        label = addTag("label", "label" + x);
        label.appendChild(document.createTextNode(x))
        $(ns.SECTION_1).appendChild(label);       
        $(ns.SECTION_1).appendChild(addTag("input", x));
    });
    $(ns.SECTION_1).appendChild(addTag("button", ns.ADD));
    $(ns.ADD).appendChild(document.createTextNode(ns.ADD));
}

function elementsRemoveSection() {
    $(ns.SECTION_3).appendChild(createSelect("select"));
    $(ns.SECTION_3).appendChild(addTag("button", ns.REMOVE));
    $(ns.REMOVE).appendChild(document.createTextNode(ns.REMOVE));
    $(ns.SECTION_3).appendChild(addTag("button", ns.TABLE));
    $(ns.TABLE).appendChild(document.createTextNode(ns.TABLE));
}

function createLi(item) {
    var li = document.createElement("li");
    li.className = item.clase;
    li.appendChild(document.createTextNode(item.valor));
    return li;
}

function createOption(item) {
    var option = document.createElement("option");
    option.value = item;
    option.appendChild(document.createTextNode(item));
    return option;
}

function reloadList() {
    if($(ns.SECTION_2).children.length !== 0) {
        Array.from($(ns.SECTION_2).children).forEach(function(x) { 
            x.remove();
        });
    }
    $(ns.SECTION_2).appendChild(addTag("ul", "list"));
    ns.AllObjects.objects.forEach(function(x) {
        $("list").appendChild(createLi(x));
    });
}

function reloadOptions() {
    if($("select").children.length !== 0) {
        Array.from($("select").children).forEach(function(x) { 
            x.remove();
        });
    }
    ns.AllObjects.objects.map(function(x) {
        return x.clase;
    }).filter(function(item, index, array) {
        return array.indexOf(item) === index;
    }).forEach(function(x) {
        $("select").appendChild(createOption(x));
    });
}

function addItem() {
    var claseValue = $(ns.CLASS).value,
        valorValue = $(ns.VALUE).value;

    ns.AllObjects.insertData(claseValue, valorValue); 
    reloadList();
    reloadOptions();
}

function removeItem() {
    var objects = ns.AllObjects.objects.filter(function(x) {
        return x.clase != $("select").value;
    });
    ns.AllObjects.removeData(objects);
    reloadList();
    reloadOptions();
}

function initListeners() {        
    $(ns.ADD).addEventListener("click", addItem, false);
    $(ns.REMOVE).addEventListener("click", removeItem, false);    
}

function createPage() {
    createSections();
    elementsAddSection();
    elementsRemoveSection();
    initListeners();
}

function init() {
    createPage();
}

window.onload = init;