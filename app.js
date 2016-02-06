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
    ns.GREEN = "green";
    ns.RED = "red";
    ns.SECTION_IDS = [ns.SECTION_1, ns.SECTION_2, ns.SECTION_3];
    ns.ADDSECTION_INPUTS = [ns.VALUE, ns.CLASS];
    ns.AllObjects = new AllObjects;
    return ns;
}({}));

function AllObjects() {
    this.objects = [];
}

function OneObject(clase, valor) {
    this.clase = clase;
    this.valor = valor;
}

AllObjects.prototype.insertData = function(claseValue, valorValue) {
    this.objects.push(new OneObject(claseValue, valorValue));
}

AllObjects.prototype.removeData = function() {
    this.objects = ns.AllObjects.objects.filter(function(x) {
        return x.clase != $("select").value;
    });
}

AllObjects.prototype.arrayUnique = function (attribute) {
    return this.objects.map(function (x) {
        return (attribute === ns.CLASS) ? x.clase : x.valor;      
    }).filter(function (element, index, array) {
        return array.indexOf(element) === index;
    });
};

AllObjects.prototype.numObjects = function (clase, valor) {
    var num = this.objects.reduce(function (x, y) {
        return (y.clase === clase && y.valor === valor) ? x + 1 : x;
    }, 0);
    return num;
};

function deleteChilds(section) {
    Array.from(section.children).forEach(function(x){
        x.remove();
    })
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

function reloadTable() {
    deleteChilds($("sectionTable"));
    var table = addTag("table", ""),
        tr = addTag("tr", ""),
        td = addTag("td", ""),
        numobj;
        tr.appendChild(td);
        table.appendChild(tr);
        ns.AllObjects.arrayUnique(ns.CLASS).forEach(function (x) {
            td = addTag("td", "");
            td.appendChild(document.createTextNode(x));
            tr.appendChild(td);
        });
        ns.AllObjects.arrayUnique(ns.VALUE).forEach(function (v) {
            tr = addTag("tr", "");
            td = addTag("td", "");
            td.appendChild(document.createTextNode(v));
            tr.appendChild(td);
            ns.AllObjects.arrayUnique(ns.CLASS).forEach(function (c) {
                td = addTag("td", "");
                numobj = ns.AllObjects.numObjects(c, v);
                td.appendChild(document.createTextNode(numobj));
                if (numobj < 2) {
                    td.style.color = ns.GREEN;
                }else if (numobj > 2) {
                    td.style.color = ns.RED;
                }
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        $("sectionTable").appendChild(table);    
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
    deleteChilds($(ns.SECTION_2));
    $(ns.SECTION_2).appendChild(addTag("ul", "list"));
    ns.AllObjects.objects.forEach(function(x) {
        $("list").appendChild(createLi(x));
    });
}

function reloadOptions() {
    deleteChilds($("select"));
    ns.AllObjects.arrayUnique(ns.CLASS).forEach(function(x) {
        $("select").appendChild(createOption(x));
    });
}

function update() {
    ($(ns.TABLE).textContent === ns.TABLE) ? reloadList() : reloadTable();
}

function addItem() {
    var claseValue = $(ns.CLASS).value,
        valorValue = $(ns.VALUE).value;

    ns.AllObjects.insertData(claseValue, valorValue); 
    reloadList();
    reloadOptions();
}

function removeItem() {    
    ns.AllObjects.removeData();
    reloadList();
    reloadOptions();
}

function changeContent() {
    $(ns.TABLE).textContent = ($(ns.TABLE).textContent === ns.TABLE) ? ns.LIST : ns.TABLE;
    update();
}

function createSections() {
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

function initListeners() {  
    var config = { attributes: false, childList: true, characterData: false };
    observer = new MutationObserver(update);
    observer.observe($("select"), config);

    $(ns.ADD).addEventListener("click", addItem, false);
    $(ns.REMOVE).addEventListener("click", removeItem, false);
    $(ns.TABLE).addEventListener("click", changeContent, false);   
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