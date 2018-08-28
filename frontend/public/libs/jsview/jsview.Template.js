var jsview = {};

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


///============== TEMPLATE ==============

jsview.Template = function(options) {
	this._constructor(options);
};

/// TEMPLATE: STATIC FIELDS

jsview.Template.prototype.naming = {
	namespace: 'data',
	directiveNames: {
		'gen': 		'gen',
		'each': 	'each',
		'when': 	'when',
		'using': 	'using',
		'text': 	'text',
		'html': 	'html',
		'control': 	'control',
		'props':	'props'
	},
	attributePrefixes: {
		'at': 	'at-',
		'dt': 	'dt-',
		'on': 	'on-'
	},
	knownAttributeShortenings: {
		'style': 	'style',
		'class': 	'class',
		'value': 	'value',
		'checked': 	'checked',
		'selected': 'selected',
		'disabled': 'disabled',
		'href': 	'href',
		'src': 		'src',
		'width': 	'width',
		'height': 	'height'
	},
	knownEventShortenings: {
		'click': 	'click',
		'change': 	'change'
	}
};

jsview.Template.prototype.syntax = {
	macroStart: '{',
	macroEnd: '}'
};

/// TEMPLATE: CONSTRUCTOR

jsview.Template.prototype._constructor = function(options) {
	// if (!options){
	// 	throw new Error('Argument "options" missing');
	// }

	// if (!element){
	// 	throw new Error('Field "options.element" missing');
	// }

    options = options || {};
    var model = options.model || {};

	this._container = jsview.dom.getElement(options.element);
	this._model = options.model || {};
	this._html = this.html || options.html;

	this._handleActionDelegate = this._getHandleActionDelegate(options.controller);
	this._createControlDelegate = this._getCreateControlDelegate(options.controlTypes);
	this._controlContext = options.controlContext;

	this._prefix = (options.namespace || this.naming.namespace) + '-';
	this._fullDirectiveNames = this._getFullNames(this._prefix, this.naming.directiveNames);
	this._fullAttributePrefixes = this._getFullNames(this._prefix, this.naming.attributePrefixes);
	this._fullKnownAttributeShortenings = options.useShortNames ? this._getFullShortenings(this._prefix, this.naming.knownAttributeShortenings) : {};
	this._fullKnownEventShortenings = options.useShortNames ? this._getFullShortenings(this._prefix, this.naming.knownEventShortenings) : {};
	this._customAttributes = options.customAttributes || {};

	this._elementsData = [];
	this._removeQueue = [];
	this._controls = {};

	this._renderElementDelegate = this._delegate(this._renderElement);
	this._renderOutputAttributeDelegate = this._delegate(this._renderOutputAttribute);
	this._renderEventAttributeDelegate = this._delegate(this._renderEventAttribute);
	this._processControlParamAttributeDelegate = this._delegate(this._processControlParamAttribute);
	this._releaseElementDelegate = this._delegate(this._releaseElement);

	this._tokenizer = new jsview.TemplateExpressionTokenizer(this.syntax);
	this._eval = new jsview.TemplateExpressionEvaluator(this._model, this._tokenizer);

	this._deploy();
};

/// TEMPLATE: API

jsview.Template.prototype.render = function () {
	this._renderElements(this._container);
};

jsview.Template.prototype.getControl = function(name){
	return this._controls[name];
};

/// TEMPLATE: DEPLOY

jsview.Template.prototype._deploy = function(){
	if (!this._html){
		return;
	}

	var html = 	this._html.toString().
		replace(/^[^\/]+\/\*!?/, '').
		replace(/\*\/[^\/]+$/, '').
		replace(/^\s+|\s+$/g, '');


	jsview.dom.setHtml(this._container, html);
};

/// TEMPLATE: RENDER

jsview.Template.prototype._renderElement = function (element) {
	if (this._isGeneratedElement(element)){
		return;
	}

    this._renderUsings(element);

    if (this._renderEach(element)) {
		return;
	}

	this._renderElementCore(element);
};

jsview.Template.prototype._renderElementCore = function (element) {
	this._clearEventDelegates(element);

	this._renderOutputAttributes(element);
	this._renderHtmlOrText(element);

	if (this._renderControl(element)){
		this._renderEventAttributes(element);
	}
	else {
		this._renderEventAttributes(element);
		this._renderElements(element);
	}
};

jsview.Template.prototype._renderElements = function (container, selector) {
	jsview.dom.eachChild(container, selector || '*', this._renderElementDelegate);
};

/// TEMPLATE: RENDER USINGS

jsview.Template.prototype._renderUsings = function(element){
	var expr = jsview.dom.getAttributeValue(element, this._fullDirectiveNames.using);
	if (!expr){
		return;
	}

	this._eval.evalVariables(expr);
};

/// TEMPLATE: RENDER EACH

jsview.Template.prototype._renderEach = function(templateElement){
	var eachExpr = jsview.dom.getAttributeValue(templateElement, this._fullDirectiveNames.each);
	if (!eachExpr) {
		return false;
	}

	var eachParts = this._tokenizer.splitOrSelf(eachExpr, ';');

	if (eachParts.splice && eachParts.length > 0){
		this._renderEachOuter(templateElement, null, eachParts, 0);
	}
	else {
		this._renderEachInner(templateElement, null, eachExpr);
	}

	return true;
};

jsview.Template.prototype._renderEachOuter = function(templateElement, lastElement, eachParts, eachPartIndex){
	var eachExpr = eachParts[eachPartIndex];

	if (eachPartIndex == eachParts.length - 1){
		lastElement = this._renderEachInner(templateElement, lastElement, eachExpr);
		return lastElement;
	}

	var itemName = this._eval.evalEachName(eachExpr);
	var indexName = this._eval.evalEachIndex(eachExpr);
	var iterator = this._eval.evalEachSource(eachExpr);

	while (iterator.next()) {
		if (itemName) {
			this._eval.setVariable(itemName, iterator.value);
		}

		if (indexName) {
			this._eval.setVariable(indexName, iterator.index);
		}

		lastElement = this._renderEachOuter(templateElement, lastElement, eachParts, eachPartIndex + 1);
	}

	//if (itemName) {
	//	this._eval.resetVariable(itemName);
	//}
	//
	//if (indexName) {
	//	this._eval.resetVariable(indexName);
	//}

	iterator.release();

	return lastElement;
};

jsview.Template.prototype._renderEachInner = function(templateElement, lastElement, eachExpr){
	var whenExpr = jsview.dom.getAttributeValue(templateElement, this._fullDirectiveNames.when);

	var itemName = this._eval.evalEachName(eachExpr);
	var indexName = this._eval.evalEachIndex(eachExpr);
	var iterator = this._eval.evalEachSource(eachExpr);

	var currentElement = lastElement;

	while (iterator.next()) {
		if (itemName) {
			this._eval.setVariable(itemName, iterator.value);
		}

		if (indexName) {
			this._eval.setVariable(indexName, iterator.index);
		}

		this._renderUsings(templateElement);

		if (!whenExpr || this._eval.evalExpression(whenExpr)){
			currentElement = this._renderEachItem(templateElement, currentElement, iterator.value);
			lastElement = currentElement;
		}

		if (!currentElement) {
			break;
		}
	}

	//this._resetUsings(templateElement);

	//if (itemName) {
	//	this._eval.resetVariable(itemName);
	//}
	//
	//if (indexName) {
	//	this._eval.resetVariable(indexName);
	//}

	while (currentElement) {
		currentElement = this._renderEachItem(templateElement, currentElement, null);
	}

	iterator.release();
	this._releaseRemoveQueue();

	return lastElement;
};

jsview.Template.prototype._renderEachItem = function (templateElement, currentElement, value) {
	var newElement = null;

	if (!currentElement) {
		newElement = templateElement;
	}
	else {
		newElement = jsview.dom.getNextElement(currentElement);
		if (!this._isGeneratedElement(newElement)) {
			newElement = null;
		}
	}

	if (newElement) {
		if (value == null) {
			if (newElement != templateElement) {
				this._addToRemoveQueue(newElement);
			}
			else {
				this._renderElementCore(newElement);
			}
		}
		else {
			this._renderElementCore(newElement);
		}
	}
	else {
		if (value != null) {
			newElement = jsview.dom.cloneElement(templateElement);
			this._setGeneratedElement(newElement);

			jsview.dom.insertElementAfter(currentElement, newElement);
			this._renderElementCore(newElement);
		}
		else {

		}
	}

	return newElement;
};

/// TEMPLATE: RENDER HTML

jsview.Template.prototype._renderHtmlOrText = function (element) {
	var textExpr = jsview.dom.getAttributeValue(element, this._fullDirectiveNames.text);
	var htmlExpr = jsview.dom.getAttributeValue(element, this._fullDirectiveNames.html);

	if (!(htmlExpr || textExpr)){
		return;
	}

	var html = this._eval.evalMacroString(htmlExpr);
	var text = this._eval.evalMacroString(textExpr);

	if (html != null) {
		jsview.dom.setHtml(element, html);
	}
	else if (text != null) {
		jsview.dom.setText(element, text);
	}
	else {
		jsview.dom.setText(element, '');
	}
};

/// TEMPLATE: RENDER OUTPUT ATTRIBUTES

jsview.Template.prototype._renderOutputAttributes = function(element){
	jsview.dom.eachAttribute(element, this._renderOutputAttributeDelegate);
};

jsview.Template.prototype._renderOutputAttribute = function(element, name, expr){
	if (this._fullKnownAttributeShortenings[name]) {
		this._renderHtmlAttribute(element, this._fullKnownAttributeShortenings[name], expr);
	}
	else if (name.indexOf(this._fullAttributePrefixes.at, 0) == 0) {
		this._renderHtmlAttribute(element, this._tokenizer.substringAfter(name, this._fullAttributePrefixes.at), expr);
	}
	else if (name.indexOf(this._fullAttributePrefixes.dt, 0) == 0) {
		this._renderDataAttribute(element, this._tokenizer.substringAfter(name, this._fullAttributePrefixes.dt), expr);
	}
	else {
		this._renderCustomAttribute(element, name, expr);
	}
};

jsview.Template.prototype._renderHtmlAttribute = function(element, name, expr){
	switch (name){
		case 'style':
			this._renderHtmlStyleAttribute(element, name, expr);
			break;
		default:
			this._renderHtmlNotStyleAttribute(element, name, expr);
			break;
	}
};

jsview.Template.prototype._renderHtmlStyleAttribute = function(element, _, styleExpr){
	var curStyle = jsview.dom.getAttributeValue(element, 'style');
	var newStyle = this._mergeStyles(curStyle, styleExpr);

	if (newStyle) {
		jsview.dom.addAttribute(element, 'style', newStyle);
	}
};

jsview.Template.prototype._renderHtmlNotStyleAttribute = function(element, name, expr){
	var value = this._eval.evalMacroString(expr);
	if (value == '' || value == null){
		jsview.dom.removeAttribute(element, name);
	}
	else {
		jsview.dom.addAttribute(element, name, value);
	}

	switch (name){
		case 'value':
		case 'checked':
		case 'selected':
		case 'disabled':
			element[name] = value;
			break;
	}
};

jsview.Template.prototype._renderDataAttribute = function(element, name, expr){
	var outputName = 'data-' + name;
	var value = this._eval.evalMacroString(expr);

	jsview.dom.addAttribute(element, outputName, value);
};

jsview.Template.prototype._renderCustomAttribute = function(element, name, expr){
	var info = this._customAttributes[name];
	if (!info){
		return;
	}

	var flag = this._eval.evalExpression(expr);
	if (flag) {
		jsview.dom.removeClass(element, info.falseClass);
		jsview.dom.addClass(element, info.trueClass);
	}
	else {
		jsview.dom.removeClass(element, info.trueClass);
		jsview.dom.addClass(element, info.falseClass);
	}
};

/// TEMPLATE: RENDER EVENT ATTRIBUTES

jsview.Template.prototype._renderEventAttributes = function(element){
	jsview.dom.eachAttribute(element, this._renderEventAttributeDelegate);
};

jsview.Template.prototype._renderEventAttribute = function(element, name, expr){
	var elementData = this._findElementData(element);
	if (!elementData){
		elementData = this._createElementData(element);
	}

	var eventName;
	if (this._fullKnownEventShortenings[name]) {
		eventName = this._fullKnownEventShortenings[name];
	}
	else if (name.indexOf(this._fullAttributePrefixes.on, 0) == 0) {
		eventName = this._tokenizer.substringAfter(name, this._fullAttributePrefixes.on)
	}

	if (!eventName) {
		return;
	}

	if (elementData.control) {
		this._renderControlEventAttribute(element, eventName, expr, elementData);
	}
	else {
		this._renderDomEventAttribute(element, eventName, expr, elementData);
	}
};

jsview.Template.prototype._renderDomEventAttribute = function(element, eventName, expr, elementData){
	elementData.domDelegates = elementData.domDelegates || {};

	var actionName = this._eval.evalActionName(expr);
	var params = this._eval.evalActionParams(expr, element);

	var handleAction = this._handleActionDelegate;
	var delegate = function(event){
		handleAction(actionName, params);

		event.cancelBubble = true;
		event.preventDefault();
		return false;
	};

	jsview.dom.addEventListener(element, eventName, delegate);
	elementData.domDelegates[eventName] = delegate;
};

jsview.Template.prototype._renderControlEventAttribute = function(element, eventName, expr, elementData){
	if (!elementData.control[eventName]){
		throw new Error('Event "' + eventName + '" not found in control "' + elementData.controlTypeName + '"');
	}

	elementData.controlDelegates = elementData.controlDelegates || {};

	var actionName = this._eval.evalActionName(expr);
	var params = this._eval.evalActionParams(expr);

	var handleAction = this._handleActionDelegate;
	var delegate = function() {
		handleAction(actionName, params);
	};

	elementData.controlDelegates[eventName] = delegate;
	elementData.control[eventName].call(elementData.control, delegate);
};

jsview.Template.prototype._clearEventDelegates = function (element) {
	var elementData = this._findElementData(element);
	if (!elementData) {
		return;
	}

	this._clearDomEventDelegates(element, elementData);
	this._clearControlEventDelegates(element, elementData);
};

jsview.Template.prototype._clearControlEventDelegates = function(element, elementData){
	if (!(elementData.controlDelegates && elementData.control)){
		return;
	}

	for (var eventName in elementData.controlDelegates) {
		if (elementData.control[eventName]) {
			elementData.control[eventName].call(elementData.control, null);
		}

		elementData.controlDelegates[eventName] = null;
	}
};

jsview.Template.prototype._clearDomEventDelegates = function(element, elementData){
	if (!elementData.domDelegates){
		return;
	}

	for (var eventName in elementData.domDelegates) {
		var oldDelegate = elementData.domDelegates[eventName];
		if (oldDelegate) {
			jsview.dom.removeEventListener(element, eventName, oldDelegate);
		}

		elementData.domDelegates[eventName] = null;
	}
};

/// TEMPLATE: RENDER CONTROLS

jsview.Template.prototype._renderControl = function(element){
	var expr = jsview.dom.getAttributeValue(element, this._fullDirectiveNames.control);
	if (!expr){
		return false;
	}

	var elementData = this._findElementData(element);
	if (!elementData){
		elementData = this._createElementData(element);
	}

	if (!elementData.control) {
		elementData.controlName = this._eval.evalControlName(expr);
		elementData.controlTypeName = this._eval.evalControlTypeName(expr);
		elementData.controlModel = {};
		elementData.control = this._createControlDelegate(elementData.controlTypeName, elementData.element, this._controlContext);

		this._controls[elementData.controlName] = elementData.control;
	}

	this._callControl(elementData);
	return true;
};

jsview.Template.prototype._callControl = function(elementData){
	if (!(elementData.control && elementData.control.render)) {
		return;
	}

	this._eval.evalVariables(
		jsview.dom.getAttributeValue(elementData.element, this._fullDirectiveNames.props),
		elementData.control
	);

	elementData.control.render.call(elementData.control);
};

jsview.Template.prototype._releaseControl = function(elementData){
	var controlName = elementData.controlName;
	var control = elementData.control;

	this._controls[controlName] = null;

	if (control && control.release){
		control.release.call(control);
	}
};

/// TEMPLATE: ELEMENT DATA

jsview.Template.prototype._createElementData = function(element){
	var data = {
		element: element,
		domDelegates: null,

		control: null,
		controlName: null,
		controlTypeName: null,
		controlParams: null,
		controlDelegates: null
	};

	this._elementsData.push(data);
	return data;
};

jsview.Template.prototype._removeElementData = function(elementData, elementDataIndex){
	elementData.element = null;
	delete elementData.element;

	elementData.delegates = null;
	elementData.control = null;

	elementData.controlParams = null;
	delete elementData.controlParams;

	this._elementsData.splice(elementDataIndex, 1);
};

jsview.Template.prototype._findElementData = function(element){
	for (var i = 0; i < this._elementsData.length; i++){
		var data = this._elementsData[i];
		if (data.element === element){
			return data;
		}
	}

	return null;
};

jsview.Template.prototype._findElementDataIndex = function(element){
	for (var i = 0; i < this._elementsData.length; i++){
		var data = this._elementsData[i];
		if (data.element === element){
			return i;
		}
	}

	return -1;
};

/// TEMPLATE: REMOVING

jsview.Template.prototype._addToRemoveQueue = function(element){
	this._removeQueue.push(element);
};

jsview.Template.prototype._releaseRemoveQueue = function () {
	for (var i = 0; i < this._removeQueue.length; i++) {
		var element = this._removeQueue[i];
		jsview.dom.eachDescendant(element, null, this._releaseElementDelegate);

		this._releaseElement(element);
		jsview.dom.removeElement(element);
	}

	this._removeQueue = [];
};

jsview.Template.prototype._releaseElement = function(element){
	var elementDataIndex = this._findElementDataIndex(element);
	if (elementDataIndex < 0){
		return;
	}

	var elementData = this._elementsData[elementDataIndex];

	this._removeElementEvents(elementData);
	this._releaseControl(elementData);
	this._removeElementData(elementData, elementDataIndex);
};

jsview.Template.prototype._removeElementEvents = function(elementData){
	var element = elementData.element;
	var delegates = elementData.delegates;

	for (var eventName in delegates){
		var delegate = delegates[eventName];
		if (delegate){
			jsview.dom.removeEventListener(element, eventName, delegate);
		}
	}
};

/// TEMPLATE: ELEMENT FLAGS

jsview.Template.prototype._setGeneratedElement = function(element){
	jsview.dom.removeAttribute(element, this._fullDirectiveNames.each);
	jsview.dom.removeAttribute(element, this._fullDirectiveNames.when);
	jsview.dom.removeAttribute(element, this._fullDirectiveNames.using);
	jsview.dom.addAttribute(element, this._fullDirectiveNames.gen, '1');
};

jsview.Template.prototype._isGeneratedElement = function(element){
	return jsview.dom.getAttributeValue(element, this._fullDirectiveNames.gen);
};

/// TEMPLATE: NAMING

jsview.Template.prototype._getFullNames = function(prefix, names){
	var result = {};
	for (var name in names){
		result[name] =  prefix + names[name];
	}
	return result;
};

jsview.Template.prototype._getFullShortenings = function(prefix, names){
	var result = {};
	for (var name in names){
		result[prefix + name] =  name;
	}
	return result;
};

/// TEMPLATE: DELEGATES

jsview.Template.prototype._getHandleActionDelegate = function(controller){
	if (!controller){
		return function(){
			return null;
		};
	}

	if (typeof(controller) === 'function'){
		return controller;
	}
	else {
		return function(actionName, params){
			return controller[actionName].apply(controller, params);
		};
	}
};

jsview.Template.prototype._getCreateControlDelegate = function(controlTypes){
	if (!controlTypes){
		return function(){
			return null;
		};
	}

	if (typeof(controlTypes) === 'function'){
		return controlTypes;
	}
	else {
		if (controlTypes.resolve){
			return function (controlTypeName, element, context) {
				var controlType = controlTypes.resolve(controlTypeName);
				return new controlType(element, context);
			};
		}
		else {
			return function (controlTypeName, element, context) {
				var controlType = controlTypes[controlTypeName];
				return new controlType(element, context);
			};
		}
	}
};

/// TEMPLATE: STYLES

jsview.Template.prototype._mergeStyles = function(style0, style1){
	var curParts = this._eval.evalMacroParts(style0, ';');
	var newParts = this._eval.evalMacroParts(style1, ';');

	if (!curParts){
		return newParts.join(';');
	}

	for (var i = 0; i < newParts.length; i++){
		var newPart = newParts[i];

		var cssName = this._tokenizer.substringBefore(newPart, ':');
		var cssValue = this._tokenizer.substringAfter(newPart, ':');
		var found = false;

		for (var k = 0; k < curParts.length; k++) {
			var curPart = curParts[i];
			var cssName1 = this._tokenizer.substringBefore(curPart, ':');

			if (cssName === cssName1) {
				found = true;
				curParts[i] = cssName + ':' + cssValue;
				break;
			}
		}

		if (!found){
			curParts.push(cssName + ':' + cssValue);
		}
	}

	return curParts.join(';');
};

/// TEMPLATE: HELPERS

jsview.Template.prototype._delegate = function(fn){
	var that = this;
	return (function(){return fn.apply(that, arguments)});
};

///============== EVALUATOR ==============

jsview.TemplateExpressionEvaluator = function(model, tokenizer){
	this._constructor(model, tokenizer);
};

/// EVALUATOR: CONSTRUCTOR

jsview.TemplateExpressionEvaluator.prototype._constructor = function(model, tokenizer){
	this._model = model;
	this._tokenizer = tokenizer;
	this._variables = {};
	this._remains = {};
};

/// EVALUATOR: VARIABLES

jsview.TemplateExpressionEvaluator.prototype.evalVariables = function(expr, buffer){
	if (!expr) {
		return;
	}

	var start = 0;
	var i = start, prev = start;
	var ch;
	var name;
	var value;

	while (i < expr.length) {
		ch = expr[i];
		name = '';

		if (ch == ';'){
			name = expr.substring(prev, i);
			value = this.evalVariable(name, buffer);
			prev = i + 1;
		}

		i++;
	}

	name = expr.substring(prev);
	this.evalVariable(name, buffer);
};

jsview.TemplateExpressionEvaluator.prototype.evalVariable = function(expr, buffer){
	if (!expr) {
		return;
	}

	var name = this._tokenizer.substringBeforeOrAll(expr, ':');
	var valueExpr = this._tokenizer.substringAfter(expr, ':');
	var value = this._evalExpression(valueExpr);

	this.setVariable(name, value);

	if (buffer) {
		buffer[name] = value;
	}
};

jsview.TemplateExpressionEvaluator.prototype.setVariable = function(name, value){
	this._variables[name] = value;
};

/// EVALUATOR: EACH

jsview.TemplateExpressionEvaluator.prototype.evalEachName = function(expr){
	var subexpr = this._tokenizer.substringBeforeOrAll(expr, ' in ');
	var name = this._tokenizer.substringBeforeOrAll(subexpr, ',');
	return name;
};

jsview.TemplateExpressionEvaluator.prototype.evalEachIndex = function(expr){
	var subexpr = this._tokenizer.substringBeforeOrAll(expr, ' in ');
	var index = this._tokenizer.substringAfter(subexpr, ',');
	return index;
};

jsview.TemplateExpressionEvaluator.prototype.evalEachSource = function(expr){
	var sourceExpr = this._tokenizer.substringAfter(expr, ' in ');

	var dividerPos = this._tokenizer.scanBeforeAny(sourceExpr, '%', 0, expr.length) || expr.length;
	var dividerExpr = this._tokenizer.trim(sourceExpr.substring(dividerPos + 1));
	var rangeExpr = this._tokenizer.trim(sourceExpr.substring(0, dividerPos));

	var rangePos = this._tokenizer.scanBeforeText(rangeExpr, '..', 0, expr.length) || expr.length;
	var startExpr = this._tokenizer.trim(rangeExpr.substring(0, rangePos));
	var endExpr = this._tokenizer.trim(rangeExpr.substring(rangePos + 2, dividerPos));

	var start = this.evalExpression(startExpr);
	var end = this.evalExpression(endExpr);
	var divider = this.evalExpression(dividerExpr);

	var iterator = null;

	if (end != null){
		iterator = new jsview.TemplateRangeIterator(start, end);
	}
	else if (start && start.length != null) {
		iterator = new jsview.TemplateArrayIterator(start);
	}
	else {
		iterator = new jsview.TemplateObjectIterator(start);
	}

	if (dividerExpr){
		iterator = new jsview.TemplateChunkIterator(iterator, divider);
	}

	return iterator;
};

/// EVALUATOR: CONTROLS

jsview.TemplateExpressionEvaluator.prototype.evalControlName = function(expr){
	if (!expr){
		return null;
	}

	var pos = this._tokenizer.scanBeforeAny(expr, ':', 0, expr.length);
	if (pos){
		var nameExpr = expr.substring(0, pos);
		var name = this.evalMacroString(nameExpr);

		return name;
	}
	else {
		return null;
	}
};

jsview.TemplateExpressionEvaluator.prototype.evalControlTypeName = function(expr){
	if (!expr){
		return null;
	}

	var pos = this._tokenizer.scanBeforeAny(expr, ':', 0, expr.length);
	if (pos){
		return this.evalMacroString(expr.substring(pos + 1));
	}
	else {
		return this.evalMacroString(expr);
	}
};

/// EVALUATOR: ACTIONS

jsview.TemplateExpressionEvaluator.prototype.evalActionName = function(expr) {
	if (!expr) {
		return null;
	}

	return this._tokenizer.substringBeforeOrAll(expr, '(');
};

jsview.TemplateExpressionEvaluator.prototype.evalActionParams = function(expr) {
	if (!expr) {
		return null;
	}

	var paramsExpr = this._tokenizer.substringBefore(this._tokenizer.substringAfter(expr, '('), ')');
	var params = this._evalList(paramsExpr);
	return params;
};

/// EVALUATOR: MACRO

jsview.TemplateExpressionEvaluator.prototype.evalMacroString = function(expr){
	return this._evalMacroString(expr);
};

jsview.TemplateExpressionEvaluator.prototype._evalMacroString = function(expr){
	if (!expr){
		return null;
	}

	var ch;
	var macroStart = -1;
	var macroEnd = -1;
	var macro;
	var value;
	var result = '';

	for (var i = 0; i < expr.length; i++){
		ch = expr[i];

		switch (ch){
			case this._tokenizer.syntax.macroStart:
				result += expr.substring((macroEnd || -1) + 1, i);
				macroStart = i;
				macroEnd = null;
				break;

			case this._tokenizer.syntax.macroEnd:
				macroEnd = i;
				macroStart = macroStart + 1;
				macro = expr.substring(macroStart, macroEnd);
				value = this._evalExpression(macro);
				if (value == null){
					value = '';
				}
				result += value;
				break;
		}
	}

	result += expr.substring(macroEnd + 1, expr.length);
	return result;
};

jsview.TemplateExpressionEvaluator.prototype.evalMacroParts = function(expr, delimiter){
	if (!expr) {
		return;
	}

	var start = 0;
	var i = start, prev = start;
	var ch;
	var token;
	var parts = [];

	while (i < expr.length) {
		ch = expr[i];
		token = '';

		if (ch == delimiter){
			token = expr.substring(prev, i);
			parts.push(this._evalMacroString(token));

			prev = i + 1;
		}

		i++;
	}

	token = expr.substring(prev);
	parts.push(this._evalMacroString(token));

	return parts;
};

/// EVALUATOR: EXPRESSIONS

jsview.TemplateExpressionEvaluator.prototype.evalExpression = function (expr) {
	return this._evalExpression(expr);
};

jsview.TemplateExpressionEvaluator.prototype._evalExpression = function (expr) {
	if (!expr) {
		return null;
	}

	var start = 0;
	var length = expr.length;

	if (expr[start] == '(' && expr[length - 1] == ')'){
		start = 1;
		length = length - 1;
	}

	var leftEnd = this._tokenizer.scanBeforeAny(expr, '=!><%?', start, length) || length;
	var opEnd = this._tokenizer.scanWhile(expr, '=!><%', leftEnd, length) || length;
	var rightEnd = this._tokenizer.scanBeforeAny(expr, '?', opEnd, length) || length;
	var trueEnd = this._tokenizer.scanBeforeAny(expr, ':', rightEnd, length) || length;
	var falseEnd = length;

	var leftExpr = expr.substring(start, leftEnd);
	var op = expr.substring(leftEnd, opEnd);
	var rightExpr = expr.substring(opEnd, rightEnd);
	var trueExpr = expr.substring(rightEnd + 1, trueEnd);
	var falseExpr = expr.substring(trueEnd + 1, falseEnd);

	var leftVal = this._evalToken(leftExpr);
	var rightVal = this._evalToken(rightExpr);
	var trueVal = this._evalExpression(trueExpr);
	var falseVal = this._evalExpression(falseExpr);

	var comparison = this._compareValues(leftVal, rightVal, op);
	var result;

	if (trueExpr || falseExpr){
		if (rightExpr){ //a==b?c:d
			result = comparison ? trueVal : falseVal;
		}
		else { //a?c:d
			result = comparison ? trueVal : falseVal;
		}
	}
	else {
		if (rightExpr){ //a==b
			result = comparison ? true : false;
		}
		else { //a
			result = leftVal;
		}
	}

	return result;
};

jsview.TemplateExpressionEvaluator.prototype._evalToken = function (token) {
	if (token == null) {
		return null;
	}

	token = this._tokenizer.trim(token);

	if (token.length == 0){
		return null;
	}
	else if (token == 'true'){
		return true;
	}
	else if (token == 'false'){
		return false;
	}
	else if (token == 'null'){
		return null;
	}
	else if (token[0] == '\'' && token[token.length - 1] == '\''){
		return token.substring(1, token.length - 1);
	}
	else if (token[0] == '"' && token[token.length - 1] == '"'){
		return token.substring(1, token.length - 1);
	}
	else if (token[0] == '[' && token[token.length - 1] == ']'){
		return this._evalList(token.substring(1, token.length - 1));
	}
	else {
		return this._evalNumberOrPath(token);
	}
};

jsview.TemplateExpressionEvaluator.prototype._evalNumberOrPath = function(expr){
	var result = parseInt(expr);
	if (isNaN(result)){
		return this._evalPath(expr);
	}
	else {
		return result;
	}
};

jsview.TemplateExpressionEvaluator.prototype._evalPath = function(path){
	if (!path) {
		return null;
	}

	var start = 0;
	var i = start, prev = start;
	var ch;
	var memberName, indexExpr, index;
	var funcName, paramsExpr, params;
	var result = null;

	while (i < path.length) {
		ch = path[i];

		if (ch == '.'){
			memberName = path.substring(prev, i);
			result = this._evalMember(memberName, result);

			prev = i + 1;
		}
		else if (ch == '['){
			memberName = path.substring(prev, i);
			result = this._evalMember(memberName, result);
			indexExpr = '';

			for (var k = path.length - 1; k > i; k--){
				ch = path[k];
				if (ch == ']'){
					indexExpr = path.substring(i + 1, k);
					break;
				}
			}

			if (!indexExpr){
				throw new Error('Bad expression "' + path + '" in template');
			}

			index = this._evalExpression(indexExpr);
			result = this._evalMember(index, result);

			i = k;
			prev = i + 1;
		}
		else if (ch == ']'){
			throw new Error('Bad expression "' + path + '" in template');
		}
		else if (ch == '('){
			funcName = path.substring(prev, i);
			paramsExpr = '';

			for (var j = path.length - 1; j > i; j--){
				ch = path[j];
				if (ch == ')'){
					paramsExpr = path.substring(i + 1, j);
					break;
				}
			}

			params = this._evalList(paramsExpr);
			result = this._evalCall(result, funcName, params);

			i = j;
			prev = i + 1;
		}
		else if (ch == ')'){
			throw new Error('Bad expression "' + path + '" in template');
		}

		i++;
	}

	memberName = path.substring(prev, path.length);
	result = this._evalMember(memberName, result);

	return result;
};

jsview.TemplateExpressionEvaluator.prototype._evalMember = function(name, parent){
	var result;

	if (name === null || name === ''){
		result = parent;
	}
	else {
		var index = +name;
		if (isNaN(index)) {
			if (parent != null) {
				result = parent[name];
			}
			else {
				result = this._variables[name];
				if (result == null) {
					result = this._model[name];
				}
			}
		}
		else {
			result = parent[index];
		}
	}

	return result;
};

jsview.TemplateExpressionEvaluator.prototype._evalList = function(expr){
	if (!expr){
		return null;
	}

	var length = expr.length;
	var end = 0;
	var prev = 0;
	var token;
	var value;
	var values = [];

	do {
		end = this._tokenizer.scanBeforeAny(expr, ',', prev, length) || length;
		token = this._tokenizer.trim(expr.substring(prev, end));
		prev = end + 1;

		value = this._evalExpression(token);
		values.push(value);
	} while (end < length);

	return values;
};

jsview.TemplateExpressionEvaluator.prototype._evalCall = function(obj, funcName, params){
	obj = obj || this._model;

	var fn = obj[funcName];
	if (!fn){
		throw new Error('Unknown function "' + funcName + '" in template');
	}

	return fn.apply(obj, params);
};

/// EVALUATOR: COMPARISON

jsview.TemplateExpressionEvaluator.prototype._compareValues = function(v0, v1, op){
	op = this._tokenizer.trim(op);

	switch (op){
		case '=<':
			return v0 == v1 - 1;
		case '==':
			return v0 == v1;
		case '!=':
			return v0 != v1;
		case '>':
			return v0 > v1;
		case '<':
			return v0 < v1;
		case '>=':
			return v0 >= v1;
		case '<=':
			return v0 <= v1;
		default:
			return v0;
	}
};

///============== TOKENIZER ==============

jsview.TemplateExpressionTokenizer = function(syntax){
	this.syntax = syntax;
};

jsview.TemplateExpressionTokenizer.prototype.splitOrSelf = function(expr, delimiter){
	if (!expr) {
		return;
	}

	var start = 0;
	var i = start, prev = start;
	var ch;
	var token;

	var result = null;

	while (i < expr.length) {
		ch = expr[i];
		token = '';

		if (ch == delimiter){
			token = expr.substring(prev, i);
			result = result || [];
			result.push(token);

			prev = i + 1;
		}

		i++;
	}

	token = expr.substring(prev);

	if (result){
		result = result || [];
		result.push(token);

		return result;
	}
	else {
		return token;
	}
};

jsview.TemplateExpressionTokenizer.prototype.substringBefore = function(str, substr){
	if (!str){
		return null;
	}

	if (!substr){
		return null;
	}

	var pos = str.indexOf(substr);
	if (pos >= 0){
		return this.trim(str.substring(0, pos));
	}
	else {
		return null;
	}
};

jsview.TemplateExpressionTokenizer.prototype.substringBeforeOrAll = function(str, substr){
	if (!str){
		return null;
	}

	if (!substr){
		return str;
	}

	var pos = str.indexOf(substr);
	if (pos >= 0){
		return this.trim(str.substring(0, pos));
	}
	else {
		return this.trim(str);
	}
};

jsview.TemplateExpressionTokenizer.prototype.substringAfter = function(str, substr){
	if (!str){
		return null;
	}

	if (!substr){
		return null;
	}

	var pos = str.indexOf(substr);
	if (pos >= 0){
		return this.trim(str.substring(pos + substr.length));
	}
	else {
		return null;
	}
};

jsview.TemplateExpressionTokenizer.prototype.substringAfterOrAll = function(str, substr){
	if (!str){
		return null;
	}

	if (!substr){
		return str;
	}

	var pos = str.indexOf(substr);
	if (pos >= 0){
		return this.trim(str.substring(pos + substr.length));
	}
	else {
		return this.trim(str);
	}
};

jsview.TemplateExpressionTokenizer.prototype.scanWhile = function(expr, chars, start, length){
	var endPos = 0;
	var ch;

	for (var i = start; i < length; i++){
		ch = expr[i];
		if (chars.indexOf(ch) < 0){
			endPos = i;
			break;
		}
	}

	return endPos;
};

jsview.TemplateExpressionTokenizer.prototype.scanBeforeAny = function(expr, chars, start, length){
	var singleQuoted = false;
	var doubleQuoted = false;

	var roundBrackets = 0;
	var squareBrackets = 0;
	var curlyBrackets = 0;

	var endPos = 0;
	var ch;

	for (var i = start; i < length; i++){
		ch = expr[i];
		switch (ch){
			case '\'':
				if (!doubleQuoted){
					singleQuoted = !singleQuoted;
				}
				break;

			case '"':
				if (!singleQuoted){
					doubleQuoted = !doubleQuoted;
				}
				break;

			case '(':
				if (!singleQuoted && !doubleQuoted) {
					roundBrackets++;
				}
				break;

			case ')':
				if (!singleQuoted && !doubleQuoted) {
					roundBrackets--;
				}
				break;

			case '[':
				if (!singleQuoted && !doubleQuoted) {
					squareBrackets++;
				}
				break;

			case ']':
				if (!singleQuoted && !doubleQuoted) {
					squareBrackets--;
				}
				break;

			case '{':
				if (!singleQuoted && !doubleQuoted) {
					curlyBrackets++;
				}
				break;

			case '}':
				if (!singleQuoted && !doubleQuoted) {
					curlyBrackets--;
				}
				break;

			default:
				if (chars.indexOf(ch) >= 0 && !singleQuoted && !doubleQuoted && !roundBrackets && !squareBrackets && !curlyBrackets){
					endPos = i;
				}
				break;
		}

		if (endPos > 0){
			break;
		}
	}

	return endPos;
};

jsview.TemplateExpressionTokenizer.prototype.scanBeforeText = function(expr, text, start, length){
	var singleQuoted = false;
	var doubleQuoted = false;

	var roundBrackets = 0;
	var squareBrackets = 0;
	var curlyBrackets = 0;

	var endPos = 0;
	var ch;

	if (!text){
		return endPos;
	}

	var text0 = text[0];
	var text_ = text.substring(1);

	for (var i = start; i < length; i++){
		ch = expr[i];
		switch (ch){
			case '\'':
				if (!doubleQuoted){
					singleQuoted = !singleQuoted;
				}
				break;

			case '"':
				if (!singleQuoted){
					doubleQuoted = !doubleQuoted;
				}
				break;

			case '(':
				if (!singleQuoted && !doubleQuoted) {
					roundBrackets++;
				}
				break;

			case ')':
				if (!singleQuoted && !doubleQuoted) {
					roundBrackets--;
				}
				break;

			case '[':
				if (!singleQuoted && !doubleQuoted) {
					squareBrackets++;
				}
				break;

			case ']':
				if (!singleQuoted && !doubleQuoted) {
					squareBrackets--;
				}
				break;

			case '{':
				if (!singleQuoted && !doubleQuoted) {
					curlyBrackets++;
				}
				break;

			case '}':
				if (!singleQuoted && !doubleQuoted) {
					curlyBrackets--;
				}
				break;

			default:
				if (text0 === ch && !singleQuoted && !doubleQuoted && !roundBrackets && !squareBrackets && !curlyBrackets){
					if (expr.substring(i + 1, text_.length) == text_){
						endPos = i;
					}
				}
				break;
		}

		if (endPos > 0){
			break;
		}
	}

	return endPos;
};

jsview.TemplateExpressionTokenizer.prototype.trim = function(str){
	if (!str){
		return '';
	}

	if (str.trim){
		str = str.trim();
	}
	else {
		str = str.replace(/^\s+|\s+$/g, '');
	}

	return str;
};

///============== ITERATORS ==============

/// ITERATORS: OBJECT

jsview.TemplateObjectIterator = function(obj) {
	this._obj = obj;
	this._keys = obj && Object.keys(obj);
	this.position = -1;
};

jsview.TemplateObjectIterator.prototype.next = function () {
	if (!this._obj) {
		return false;
	}

	this.position++;
	this.index = this._keys[this.position];
	this.value = this._obj[this.index];

	return this.position < this._keys.length;
};

jsview.TemplateObjectIterator.prototype.release = function () {
	this._obj = null;
	this._keys = null;
};

/// ITERATORS: ARRAY

jsview.TemplateArrayIterator = function (array) {
	this._array = array;
	this.position = -1;
};

jsview.TemplateArrayIterator.prototype.next = function () {
	if (!this._array) {
		return false;
	}

	this.position++;
	this.index = this.position;
	this.value = this._array[this.position];

	return this.position < this._array.length;
};

jsview.TemplateArrayIterator.prototype.release = function () {
	this._array = null;
};

/// ITERATORS: RANGE

jsview.TemplateRangeIterator = function (start, end) {
	this.start = start;
	this.end = end;
	this.position = -1;
};

jsview.TemplateRangeIterator.prototype.next = function () {
	this.position++;
	this.index = this.position;
	this.value = this.start + this.position;

	return this.value <= this.end;
};

jsview.TemplateRangeIterator.prototype.release = function () {
};

/// ITERATORS: CHUNK

jsview.TemplateChunkIterator = function (iterator, chunkSize) {
	this._iterator = iterator;
	this._chunkSize = chunkSize;
};

jsview.TemplateChunkIterator.prototype.next = function () {
	if (!this._iterator) {
		return false;
	}

	var chunk = [];

	for (var i = 0; i < this._chunkSize; i++){
		if (this._iterator.next()){
			chunk.push(this._iterator.value);
		}
		else {
			break;
		}
	}

	this.value = chunk;
	return this.value.length > 0;
};

jsview.TemplateChunkIterator.prototype.release = function () {
	this._iterator.release();
	this._iterator = null;
};

///============== END ==============
