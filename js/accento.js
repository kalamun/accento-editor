"use strict";

(function () {
    
	// init
	var textareas = document.getElementsByClassName( 'accento-editor' );
	
	for( var i=0; textareas[i]; i++ )
	{
		textareas[i].editor = new accento_editor( textareas[i] );
	}
	
}());


function accento_editor( textarea )
{
	// textarea is already defined
	var container = null, // div that contains both iframe and textarea
		iframe = null, // reference to iframe
		idocument = null; // reference to iframe document
	
	function init()
	{
		// create container
		container = document.createElement('div');
		container.className = 'accento-container';
		textarea.parentNode.insertBefore( container, textarea );
		container.appendChild( textarea );

		// create iframe
		iframe = document.createElement('iframe');
		iframe.className = 'accento-richeditor';
		iframe.addEventListener( "load", on_iframe_loaded );
		container.appendChild( iframe );
		
	}
	init();

	/* iframe: on loading */
	function on_iframe_loaded()
	{
		idocument = iframe.contentWindow.document;
		
		
		// activate design mode
		idocument.designMode = "on";

		// populate iframe
		idocument.open();
		idocument.write('<!DOCTYPE html><html charset=UTF-8"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body>' + textarea.value + '</body></html>');
		idocument.close();
		
		// add style
		add_style( "css/accento-iframe-style.css" );
		
		iframe.contentDocument.execCommand( "styleWithCSS", false, false );

		//try{ iframe.contentDocument.execCommand('enableInlineTableEditing',null,false); } catch(e){ }
		//try{ iframe.contentDocument.execCommand('enableObjectResizing',null,true); } catch(e){ }
		//try{ iframe.contentDocument.execCommand('insertBrOnReturn',null,false); } catch(e){ }

		if(iframe.contentWindow.addEventListener)
		{
			//idocument.body.addEventListener('paste',iframeOnPaste,false);
			//iframe.contentWindow.addEventListener('focus',kOnFocus,true);
			iframe.contentWindow.addEventListener( 'keydown', on_iframe_keydown, true );
			iframe.contentWindow.addEventListener( 'keyup', on_iframe_keyup, true );
			iframe.contentWindow.addEventListener('mousedown',on_iframe_mousedown,true);
		}

	}
	
	/* iframe: on document loaded */
	function on_idocument_loaded()
	{
		resize_to_fit_content();
	}
	
	/* iframe: on keydown*/
	function on_iframe_keydown()
	{
	}
	
	/* iframe: on keyup*/
	function on_iframe_keyup()
	{
		resize_to_fit_content();
		show_options();
		iframe_to_textarea();
	}
	
	/* iframe: on mouse down */
	function on_iframe_mousedown()
	{
		
	}
	
	/* iframe: add a css style */
	function add_style( url )
	{
		var style = idocument.createElement( 'link' );
		style.setAttribute( "rel", 'stylesheet' );
		style.setAttribute( "type", 'text/css' );
		style.setAttribute( "href", url );
		style.addEventListener( "load", on_idocument_loaded, true );
		idocument.head.appendChild( style );
	}
	
	/* iframe: resize iframe to contents */
	function resize_to_fit_content()
	{
		iframe.style.height = idocument.body.scrollHeight + 'px';
		textarea.style.height = iframe.style.height;
	}
	
	/* iframe: show options based on selection */
	function show_options()
	{
		var options = [];
		show_baloon( options );
	}
	
	/* sync iframe to textarea */
	function iframe_to_textarea()
	{
		var html = idocument.body.innerHTML;
		html = html.replace( /<br>\n?/gi, "<br>\n" );
		textarea.value = html;
	}
	
	/* sync textarea to iframe */
	function textarea_to_iframe()
	{
		idocument.body.innerHTML = textarea.value;
	}
	
	/* baloon */
	function show_baloon( options )
	{
		
	}
}