/* Will store the two functions that are supposed to style upon validation
 * error or upon success
 */
var validationFeedBack = new Object();

/*
 * Main function to be instantiated. Pass it two functions:
 * 1. fn(HTMLElement,String)
 *    will be called if validation fails.
 * 2. fn(HTMLElement)
 *    will be called if validation succeeds
 */
function Validation(errorStyler,passStyler) {
	
	validationFeedBack.errorFeedbackFunc = errorStyler;
	validationFeedBack.passFeedbackFunc = passStyler;
	
	this.setup = function(){
		$("input[type='text'][validation]").each(function(idx){
			$(this).blur(
			  new Validation.validatorCallBack(Validation.returnValidator(this))
			);
		});
	}	
}

/*
 * "Static" method as it needs no reference to any sort of scope
 */
Validation.returnValidator = function(inspectedElement) {
	var identifier = $(inspectedElement).attr("validation")
	if (identifier == 'numeric')
	  return Validation.numericValidator;
	else if (identifier.substr(0,1) == '/') 
	  return Validation.regexValidator;
	else
	  return Validation.nullCallback;
}

Validation.validatorCallBack = function(validatorFunc) {
	var valFunc = validatorFunc;

	return function(eventObj){
		try {
			valFunc(this);
			validationFeedBack.passFeedbackFunc(this);
		} 
		catch (x) {
			validationFeedBack.errorFeedbackFunc(this,x);
		}
	}
}

/*
 * Here come the basic validator functions. For now we have a simple
 * numeric check and a regex check.
 */

Validation.numericValidator = function(inputElement) {
	if (isNaN(inputElement.value))
	  throw "Input is not a number";
}

Validation.regexValidator = function(inputElement){
	var regexstring = $(inputElement).attr("validation");
	var re = eval(regexstring);
	if (!re.test(inputElement.value)) 
		throw "Field failed to match pattern " + regexstring;
}

Validation.nullCallback = function(inputElement) {
	// Unrecognized validation
}
