/**
 * ------------------------------------------------------------
 * Copyright (c) 2011 Artem Matevosyan
 * ------------------------------------------------------------
 *
 * @version $Revision: $:
 * @author  $Author: $:
 * @date    $Date: $:
 */

#target photoshop

//=============================================================================
// Tag Cloud Generator
//=============================================================================

//@include 'include/globals.js'
//@include 'include/stdlib.js'
//@include 'include/ui.js'
//@include 'include/text.js'
//@include 'include/div.js'
//@include 'include/randomItem.js'
//@include 'include/scriptSettings.js'

// Dispatch
main();


///////////////////////////////////////////////////////////////////////////////
// Function:	main
// Usage:		starting script rotine 
// Input:		none
// Return:		none
///////////////////////////////////////////////////////////////////////////////
function main(){

	if ( app.documents.length <= 0 ) {
		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
			alert("Document must be opened");
		}
		return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}

	docRef = app.activeDocument;
	
	// Set default settings
	main_initSettings();
	
	var result = ui_settingsDialog();

	main_saveSettings();

	//Show the dialog and quit if canceled
	if ( result == cancelButtonID ) return main_cancel();
	
	main_generateTagCloud();

}


// main_generateTagCloud
function main_generateTagCloud() {
	
	var contents = settings.tags;
	var tags = contents.split("\n");
	contents = tags.join(" ");

	var layerName = "Tag Cloud";
	var font = "ArialMT";

//alert(Text.hexToRGBColor('AB0954'))

	var styles = new Array();
	for (var i = 0; i < settings.styles.length; i++ ){
		var style = settings.styles[i];
		//var styleObject = new TextStyle(font, style.fontSize, Text.toRGBColor(113, 172, 245));
		var styleObject = new TextStyle(font, style.fontSize, Text.hexToRGBColor(style.color));
		styles.push(styleObject);
	}

	var ranges = new TextStyleRanges();
	var currentPosition = 0;

	for ( var i = 0; i < tags.length; i++ ) {
		var tag = tags[i];
		var start = currentPosition;
		var stop = currentPosition + tag.length + 1; // space
		ranges.add(new TextStyleRange(start, stop, styles.randomItem() ));
		currentPosition = stop;
	}

	var opts = new TextOptions(contents);
	opts.layerName = layerName;
	opts.width = 400;
	opts.height = 400;
	opts.ranges = ranges;

	var tmpLayer = docRef.artLayers.add();
	
	var layer = Text.addNewTextLayer(docRef, opts);
	Text.modifyTextLayer( docRef, opts, layer );

	tmpLayer.remove()
}


function main_cancel() {
	return 'cancel';
}

// Set default settings
function main_initSettings() {
	settings = { 
		tags: '',
		styles: []
	};
	
	var savedSettings = getSavedScriptSettings(main_getRegistryID());
	if (savedSettings) {
		settings = savedSettings;
	}
}

function main_saveSettings() {
	saveScriptSettings( settings, main_getRegistryID() );
}

function main_getRegistryID(){
	var RegistryID = SCRIPT_REGISTRY_ID;
	var docuementID = '';
	try {
		var docuementID = docRef.path + docRef.name;
	} catch (e) {
		// document wasn't yet saved
	}
	return RegistryID + docuementID;
}