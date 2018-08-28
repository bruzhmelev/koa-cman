jsview = {};

jsview.dom = {};

/// COMPATIBILITY

jsview.dom._textContentSupported = function () {
return ('textContent' in document.body);
};

/// ATTRIBUTES

jsview.dom.eachAttribute = function(element, func, param){
	if (!(element && func)){
		return;
	}

	if (!element.attributes) {
		return;
	}

	for (var i = 0; i < element.attributes.length; i++){
		var attr = element.attributes.item(i);
		func(element, attr.nodeName, attr.value, param);
	}
};

jsview.dom.addAttribute = function (element, name, value) {
	var attr = this._findAttribute(element, name);
	if (!attr) {
		attr = document.createAttribute(name);
		element.setAttributeNode(attr);
	}

	attr.value = value;
	return value;
};

jsview.dom.removeAttribute = function (element, name) {
	element.removeAttribute(name);
};

jsview.dom.getAttributeValue = function (element, name) {
	var attr = this._findAttribute(element, name);
	return attr && attr.value;
};

jsview.dom.setAttributeValue = function (element, name, value) {
	var attr = this._findAttribute(element, name);
	if (attr) {
		attr.value = value;
		return value;
	}
	else {
		return null;
	}
};

jsview.dom._findAttribute = function (element, name) {
	if (!(element && element.attributes)) {
		return null;
	}

	for (var i = 0; i < element.attributes.length; i++) {
		var attr = element.attributes.item(i);
		if (attr.nodeName == name) {
			return attr;
		}
	}

	return null;
};

/// CLASSES

jsview.dom.getClasses = function (element) {
	if (!element.className) {
		return null;
	}

	return element.className.split(' ');
};

jsview.dom.hasClass = function (element, cls) {
	return this._matchClass(element, cls);
};

jsview.dom.addClass = function(element, cls){
	if (!(element && cls)) {
		return;
	}

	if (this.hasClass(element, cls)){
		return;
	}

	if (element.className) {
		element.className = element.className + ' ' + cls;
	}
	else {
		element.className = cls;
	}
};

jsview.dom.removeClass = function(element, cls){
	if (!(element && element.className && cls)) {
		return false;
	}

	var classes = element.className.split(' ');
	var index = classes.indexOf(cls);
	if (index >= 0){
		classes.splice(index, 1);
	}

	element.className = classes.join(' ');
};

/// STYLE

jsview.dom.getStyle = function(element){
	var style = window.getComputedStyle(element);
	return style;
};

/// CONTENT

jsview.dom.setText = function (element, text) {
if (!element) {
	return;
}

if (text === null){
	text = '';
}

if (this._textContentSupported()) {
	element.textContent = text;
}
else {
	element.innerText = text;
}
};

jsview.dom.setHtml = function(element, html){
if (!element) {
	return;
}

if (html === null){
	html = '';
}

element.innerHTML = html;
};

jsview.dom.getValue = function (element) {
	if (!element) {
		return null;
	}

	var tagName = element.tagName;
	var type = element.type;

	if (tagName == 'INPUT') {
		if (type == 'checkbox') {
			return element.checked;
		}
		else if (type == 'radio') {
			return element.value;
		}
		else {
			return element.value;
		}
	}
	else if (tagName == 'SELECT') {
		return element.value;
	}
	else if (tagName == 'OPTION') {
		return element.value;
	}
	else {
		return null;
	}
};

jsview.dom.setValue = function (element, value) {
if (!element) {
	return;
}

var tagName = element.tagName;
var type = element.type;

if (tagName == 'INPUT') {
	if (type == 'radio') {
		element.checked = (element.value == value);
	}
	else if (type == 'checkbox'){
		element.checked = value;
	}
	else {
		element.value = value;
	}
}
else if (tagName == 'SELECT') {
	element.value = value;
}
else if (tagName == 'OPTION') {
	element.selected = (element.value == value);
}
};

/// BOX

jsview.dom.getLeft = function(element){
	return element.offsetLeft;
};

jsview.dom.getTop = function(element){
	return element.offsetTop;
};

jsview.dom.getWidth = function(element){
	return element.offsetWidth;
};

jsview.dom.getHeight = function(element){
	return element.offsetHeight;
};

jsview.dom.setLeft = function(element, value){
	element.style.left = value + 'px';
};

jsview.dom.setTop = function(element, value){
	element.style.top = value + 'px';
};

jsview.dom.setWidth = function(element, value){
	element.style.width = value + 'px';
};

jsview.dom.setHeight = function(element, value){
	element.style.height = value + 'px';
};

jsview.dom.getLeftOf = function(element, ofElement){
	ofElement = ofElement || document.body;

	var left = 0;
	var parent = element;

	while (parent && parent != ofElement){
		left += parent.offsetLeft;
		parent = parent.parentNode;
	}

	return left;
};

jsview.dom.getTopOf = function(element, ofElement){
	ofElement = ofElement || document.body;

	var top = 0;
	var parent = element;

	while (parent && parent != ofElement){
		top += parent.offsetTop;
		parent = parent.parentNode;
	}

	return top;
};

/// EVENTS

jsview.dom.addEventListener = function (element, event, handler) {
	if (!(element && event && handler)) {
		return;
	}

	element.addEventListener(event, handler);
};

jsview.dom.removeEventListener = function (element, event, handler) {
	if (!(element && event && handler)) {
		return;
	}
	element.removeEventListener(event, handler);
};

/// EACH

jsview.dom.eachChild = function(element, selector, func, param){
	if (!(element && func)){
		return;
	}

	var matcher = this._getMatchFunction(selector);
	var name = this._getNameFromSelector(selector);

	this._eachChild(element, matcher, name, func, param);
};

jsview.dom._eachChild = function(element, matcher, name, func, param){
	if (!element.children){
		return;
	}

	for (var i = 0; i < element.children.length; i++){
		var child = element.children[i];
		if (!matcher || matcher(child, name)){
			func(child, i, param);
		}
	}
};

jsview.dom.eachDescendant = function(element, selector, func, param){
	if (!(element && func)){
		return;
	}

	var matcher = this._getMatchFunction(selector);
	var name = this._getNameFromSelector(selector);
	this._eachDescendant(element, matcher, name, func, param, 0);
};

jsview.dom._eachDescendant = function(element, matcher, name, func, param, level){
	if (!element.children){
		return;
	}

	for (var i = 0; i < element.children.length; i++){
		var child = element.children[i];
		var deep = true;

		if (!matcher || matcher(child, name)){
			deep = func(child, i, param);
		}

		if (deep == true || deep == null){
			this._eachDescendant(child, matcher, name, func, param, level + 1);
		}
	}
};

/// FIND SINGLE

jsview.dom.getElement = function(selector){
	if (!selector){
		return null;
	}

	var element = null;

	if (typeof(selector) === 'string'){
		if (selector[0] === '#') {
			element = document.getElementById(selector.substring(1));
		}
		else {
			element = jsview.dom.findDescendant(document.body, selector);
		}
	}
	else if (selector.jquery){
		element = selector[0];
	}
	else { //if element is dom node
		element = selector;
	}

	return element;
};

jsview.dom.findChild = function (parent, selector, func, param) {
if (!parent) {
	return null;
}

var matcher = this._getMatchFunction(selector);
var name = this._getNameFromSelector(selector);

return this._findChildNth(parent, matcher, name, null, func, param);
};

jsview.dom.findChildNth = function (parent, selector, position, func, param) {
	if (!parent) {
		return null;
	}

	var matcher = this._getMatchFunction(selector);
	var name = this._getNameFromSelector(selector);

	return this._findChildNth(parent, matcher, name, position, func, param);
};

jsview.dom._findChildNth = function(parent, matcher, name, position, func, param){
	var found = null;
	var foundCount = 0;

	var isLastPosition = position == -1;
	position = position == null ? 1 : position + 1;

	for (var i = 0; i < parent.children.length; i++){
		var child = parent.children[i];

		if ((!matcher || matcher(child, name)) && (!func || func(child, i, param))){
			found = child;
			foundCount++;

			if (position == foundCount){
				break;
			}
		}
	}

	if (!(position == foundCount || isLastPosition)){
		found = null;
	}

	return found;
};

jsview.dom.findDescendant = function (parent, selector, func, param) {
	if (!parent) {
		return null;
	}

	var matcher = this._getMatchFunction(selector);
	var name = this._getNameFromSelector(selector);

	return this._findDescendant(parent, matcher, name, func, param);
};

jsview.dom._findDescendant = function(parent, matcher, name, func, param){
	var found = null;

	for (var i = 0; i < parent.children.length; i++){
		var child = parent.children[i];

		if ((!matcher || matcher(child, name)) && (!func || func(child, i, param))){
			found = child;
			break;
		}
		else {
			found = this._findDescendant(child, matcher, name, func, param);
			if (found != null){
				break;
			}
		}
	}

	return found;
};

jsview.dom._getMatchFunction = function(selector){
	if (!selector) {
		return null;
	}
	else if (selector == '*'){
		return null;
	}
	else if (selector[0] == '#') {
		return this._matchId;
	}
	else if (selector[0] == '.') {
		return this._matchClass;
	}
	else {
		return this._matchTag;
	}
};

jsview.dom._getNameFromSelector = function(selector){
	if (!selector) {
		return null;
	}
	else if (selector == '*'){
		return null;
	}
	else if (selector[0] == '#') {
		return selector.substring(1);
	}
	else if (selector[0] == '.') {
		return selector.substring(1);
	}
	else {
		return selector.toUpperCase();
	}
};

jsview.dom._matchTag = function(element, tag){
	return element.tagName == tag;
};

jsview.dom._matchId = function(element, id){
	return element.id == id;
};

jsview.dom._matchClass = function (element, cls) {
	if (!(element && element.className && cls)) {
		return false;
	}

	return (element.className + ' ').indexOf(cls + ' ') >= 0;
};

/// FIND MANY

jsview.dom.findChildren = function (parent, selector, func, param) {
	var result = [];

	jsview.dom.eachChild(parent, selector, function(element, index, param) {
		if (func){
			if (func(element, index, param)) {
				result.push(element);
			}
		}
		else {
			result.push(element);
		}
	}, param);

	return result;
};

jsview.dom.findDescendants = function (parent, selector, func, param) {
	var result = [];

	jsview.dom.eachDescendant(parent, selector, function(element, index, param) {
		if (func){
			if (func(element, index, param)) {
				result.push(element);
			}
		}
		else {
			result.push(element);
		}
	}, param);

	return result;
};

/// DOM TREE

jsview.dom.getParent = function (element) {
	return element.parentNode;
};

jsview.dom.getNextElement = function(after){
	var nextSibling = after.nextSibling;
	while(nextSibling && nextSibling.nodeType != 1) { //nodeType != element
		nextSibling = nextSibling.nextSibling
	}
	return nextSibling;
};

jsview.dom.createElement = function(tag){
	return document.createElement(tag);
};

jsview.dom.removeElement = function (element) {
	if (element.parentNode) {
		element.parentNode.removeChild(element);
		return true;
	}
	else {
		return false;
	}
};

jsview.dom.cloneElement = function (element) {
	return element.cloneNode(true);
};

jsview.dom.appendElement = function (into, element) {
	into.appendChild(element);
};

jsview.dom.insertElementBefore = function (before, element) {
	before.parentNode.insertBefore(element, before);
};

jsview.dom.insertElementAfter = function (after, element) {
	after.parentNode.insertBefore(element, after.nextSibling);
};


