/**
 * ------------------------------------------------------------
 * Copyright (c) 2011 Artem Matevosyan
 * ------------------------------------------------------------
 *
 * @version $Revision: 82 $:
 * @author  $Author: kris $:
 * @date    $Date: 2010-07-10 08:36:02 +0200 (Sat, 10 Jul 2010) $:
 */


//=============================================================================
// User Interface
//=============================================================================








///////////////////////////////////////////////////////////////////////////////
// Function: ui_settingsDialog
// Usage: pop the ui and get user settings
// Input: exportInfo object containing our parameters
// Return: on ok, the dialog info is set to the exportInfo object
///////////////////////////////////////////////////////////////////////////////
function ui_settingsDialog() {

	var columns = [
		[0, 0, 40, 24],
		[0, 0, 150, 24],
		[0, 0, 110, 24]

	];

	var fields = {
		tags: new Object,
		stylesList: new Array()
	};
	

	windowMain = new Window("dialog", "Tag Cloud Generator");

	// General Settings
	with (windowMain) {
		// match our dialog background color to the host application
		var brush = graphics.newBrush ( graphics.BrushType.THEME_COLOR, "appDialogBackground" );
		graphics.backgroundColor = brush;
		graphics.disabledBackgroundColor = windowMain.graphics.backgroundColor;

		orientation = 'column';
		alignChildren = 'left';

		spacing = 5;
	}

	// Tags Field
	with (windowMain) {
		
		var grpTagsTitle = add("group");
		with (grpTagsTitle) {
			orientation = 'stack';
			alignment = 'fill';
			margins = [0,0,0,5];

			var stTitle = add("statictext", undefined, "Tags");
			stTitle.alignment = 'left';
			setFont( stTitle, { fontStyle: 'Bold' } );

			stComment = add("statictext", undefined,  "One tag per line. Ctrl+Enter for new line.");
			stComment.alignment = 'right';
			setFont( stComment, { fontSize: 11 } );
		}
		var defaultTags = settings.tags ? settings.tags : 'Enter tags here';
		fields.tags = add("edittext", [0,0,300, 100], defaultTags, {multiline: true, scrolling: true});
	}

	// Tags Styles Field
	with (windowMain) {

		// Title
		var grpTagsStylesTitle = add('group');
		with (grpTagsStylesTitle) {
			margins = [0, 10, 0, 0];
			stTitle = add("statictext", undefined, "Tags Styles");
			stTitle.graphics.font = ScriptUI.newFont(stTitle.graphics.font.name, 'Bold', stTitle.graphics.font.size);
		}


		// Table header
		var grpTagsStylesTableHeader = add('group');
		with (grpTagsStylesTableHeader) {

			margins = [0, 5, 0, 0];
			spacing = 0;
			orientation = 'row';
			alignChildren = 'fill';

			// Enabled
			add("statictext", [0,0, columns[0][2], 15], "On");

			// Font Size
			stFontSize = add("statictext", [0,0, columns[1][2], 15], "Font Size");
			setFont(stFontSize, { fontSize: 11 });

			// Color
			stColor = add("statictext", [0,0, columns[2][2], 15], "Color");
			setFont(stColor, { fontSize: 11 });

		}

		// Styles continer
		var grpTagsStylesContainer = add('group');
		with (grpTagsStylesContainer) {
			orientation = 'column';
			spacing = 0;
		}


		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		fields.stylesList.push(createNewStyle( grpTagsStylesContainer ));
		

	}

	// Buttons
	with (windowMain) {

		// Buttons continer
		var grpButtons = add('group');
		with (grpButtons) {

			orientation = 'row';
			alignment = 'center';
			spacing = 10;
			margins = [0, 20, 0, 15];
			
			// Cancel butten
			var btnCancel = add("button", undefined, "Cancel" );
			btnCancel.onClick = function() { 
				windowMain.close(cancelButtonID); 
			}

			// Generate button
			var btnGenerate = add("button", undefined, "Generate" );
			btnGenerate.onClick = function() {
				// if (!someField){
				// 	alert('error');
				// 	return;
				// }
				// Close window and go further
				windowMain.close(runButtonID);
			}

		}

	}

	// give the hosting app the focus before showing the dialog
	app.bringToFront();

	windowMain.center();

	var result = windowMain.show();
	
	if (cancelButtonID == result) {
		return result;  // close to quit
	}

	// Processing settings

	// Tags
	settings.tags = fields.tags.text;

	// Styles
	settings.styles = new Array();

	for (var i = 0; i < fields.stylesList.length; i++ ){

		var stylesFieldSet = fields.stylesList[i];

		if (!stylesFieldSet.cbEnabled.value) continue;

		var styleSettings = {
			fontSize: stylesFieldSet.etFontSize.text,
			color: stylesFieldSet.etColor.text
		};

		settings.styles.push(styleSettings);
	}

	return result;
	


	function createNewStyle( container ) {
		
		var currentFieldNum = fields.stylesList.length;
		var vFontSize = fields.stylesList ? defaultFontSizes[currentFieldNum] : defaultFontSizes[0];
		var vColor = '000000';
		var vEnabled = true;

		try {
			if ( settings.styles[currentFieldNum] ) {
				vFontSize = settings.styles[currentFieldNum].fontSize;
				vColor = settings.styles[currentFieldNum].color;
			}
		} catch(e) {}
		
		if ( settings.styles.length <= currentFieldNum ) {
			vEnabled = false
		}

		if ( !settings.styles.length ) {
			vEnabled = fields.stylesList.length < defaultNumberOfStyles ? true : false
		}


		var grpStyle = container.add("group");

		with (grpStyle)	{

			spacing = 0;
			orientation = 'row';
			alignChildren = 'fill';
			preferredSize.height = 10;

			// Enabled check box
			var cbEnabled = add("checkbox", columns[0]);
			cbEnabled.value = vEnabled;

			// Font Size
			with( grpFontSize = add('group', columns[1]) ){
				spacing = 0;
				var etFontSize = add("edittext", [0,0,100,20], vFontSize);
				add("statictext", undefined, "px");
			}

			// Color
			with( grpColor = add('group', columns[2]) ){
				spacing = 0;
				add("statictext", undefined, "#");
				var etColor = add("edittext", [0,0,100,20], vColor);
			}

		}

		return { cbEnabled: cbEnabled, etFontSize: etFontSize, etColor: etColor };
		
	}


	function setFont ( obj, props ) {
		
		// Get current properties from object
		if (!props.fontFace)		props.fontFace = obj.graphics.font.name;
		if (!props.fontStyle)		props.fontStyle = obj.graphics.font.style;
		if (!props.fontSize)		props.fontSize = obj.graphics.font.size;

		// Set font properties
		obj.graphics.font = ScriptUI.newFont(props.fontFace, props.fontStyle, props.fontSize);

	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: hideAllFileTypePanel
// Usage: hide all the panels in the common actions
// Input: <none>, windowMain is a global for this script
// Return: <none>, all panels are now hidden
///////////////////////////////////////////////////////////////////////////////
