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
		idocument = null, // reference to iframe document
		widget_menu = null, // reference to widget lateral menu
		baloon_menu = null, // reference to baloon over-text menu
		highlight = null; // reference to the div that highlights parent elements on null selections
	
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
			//iframe.contentWindow.addEventListener('mousedown',on_iframe_mousedown,true);
			iframe.contentWindow.addEventListener( 'mouseup', on_iframe_mouseup, true);
			iframe.contentWindow.addEventListener( 'blur', on_iframe_blur, true);
		}

	}
	
	/* iframe: on document loaded */
	function on_idocument_loaded()
	{
		resize_to_fit_content();
	}
	
	/* iframe: on keydown*/
	function on_iframe_keydown( e )
	{
		// transform quotes into l and r quotes
		if( "'" == e.key || '"' == e.key ) e.preventDefault();
		else return true;
		
		var sel = iframe.contentWindow.getSelection();
		var range = sel.getRangeAt(0);
		var last_char = range.endContainer.textContent.substring( range.endContainer.textContent.length - 1 );
		var match = last_char.match( /[^\s]/ );

		if( "'" == e.key )
		{
			if( match && match[0] )
				var key = idocument.createTextNode( "’" );
			else
				var key = idocument.createTextNode( "‘" );
			
		} else if( '"' == e.key ) {
			if( match && match[0] )
				var key = idocument.createTextNode( "”" );
			else
				var key = idocument.createTextNode( "“" );
		}
		
		range.insertNode( key );
		range.setStartAfter( key );
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
	
	/* iframe: on mouse up */
	function on_iframe_mouseup()
	{
		show_options();
	}
	
	/* iframe: on mouse down */
	function on_iframe_blur()
	{
		hide_widget_menu();
		hide_baloon_menu();
		hide_highlight();
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
	
	/* iframe: get cursor / selection position and size */
	function get_selection()
	{
		var selection = {};
		
		var sel = iframe.contentWindow.getSelection();
		var range = sel.getRangeAt(0);
		
		selection.start_container = range.startContainer,
		selection.start_offset = range.startOffset,
		selection.end_container = range.endContainer,
		selection.end_offset = range.endOffset;
		selection.position = range.getBoundingClientRect();
		selection.parent_node = range.commonAncestorContainer;
		
		// in case of empty element, try to get position of the parent one
		if( selection.position.top == 0 )
		{
			range.setStartBefore(range.startContainer);
			range.setEndAfter(range.endContainer);
			
			selection.position = range.getBoundingClientRect();
			selection.parent_node = range.commonAncestorContainer;
			
			range.setStart( selection.start_container, selection.start_offset);
			range.setEnd( selection.end_container, selection.end_offset);
		}
		
		return selection;
	}
	
	/* iframe: resize iframe to contents */
	function resize_to_fit_content()
	{
		iframe.style.height = idocument.body.scrollHeight + 'px';
		textarea.style.height = iframe.style.height;
	}
	
	/* iframe: get selection parent nodes, as objects or as tagNames */
	function get_parents( output )
	{
		if( !output ) var output = "object";
		
		var parents = [];
		var selection = get_selection();
		while( selection.parent_node.parentNode && selection.parent_node.parentNode.tagName != "BODY" )
		{
			selection.parent_node = selection.parent_node.parentNode;
			if( "object" == output )
				parents.push( selection.parent_node );
			else if( "tagName" == output )
				parents.push( selection.parent_node.tagName );
		}
		return parents;
	}
	
	/* iframe: show options based on selection */
	function show_options()
	{
		show_baloon_menu();
		show_widget_menu();
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
	function show_baloon_menu()
	{
		if( !baloon_menu )
		{
			baloon_menu = document.createElement( 'div' );
			baloon_menu.className = 'baloon-menu';
			baloon_menu.innerHTML = "<strong>b</strong><em>i</em><u>u</u>";
			container.appendChild( baloon_menu );
		}

		if( !highlight )
		{
			highlight = document.createElement( 'div' );
			highlight.className = 'highlight';
			container.appendChild( highlight );
		}

		var selection = get_selection();
		var top = 0,
			left = 0,
			highlight_top = 0,
			highlight_left = 0,
			highlight_width = 0,
			highlight_height = 0;
		var parents = get_parents( "tagName" );
		
		// if something selected, show text options
		if( selection.start_container != selection.end_container || selection.start_offset != selection.end_offset )
		{
			top = selection.position.top;
			left = selection.position.left + selection.position.width / 2;
			hide_highlight();
			
		// or if parent node is one of these: em, i, strong, b, u, blockquote, h\d, a, ul, ol, li, show options for that element
		} else if( parents.indexOf("EM") >= 0 ) {
			var sel = iframe.contentWindow.getSelection();
			var range = sel.getRangeAt(0);
			
			range.setStartBefore(selection.start_container);
			range.setEndAfter(selection.end_container);

			top = range.getBoundingClientRect().top;
			left = range.getBoundingClientRect().left + range.getBoundingClientRect().width / 2;
			highlight_top = top;
			highlight_left = range.getBoundingClientRect().left;
			highlight_width = range.getBoundingClientRect().width;
			highlight_height = range.getBoundingClientRect().height;

			range.setStart( selection.start_container, selection.start_offset);
			range.setEnd( selection.end_container, selection.end_offset);
			
		// else do nothing
		} else {
			hide_baloon_menu();
			hide_highlight();
			return false;
		}
		
		baloon_menu.style.top = top + 'px';
		baloon_menu.style.left = left + 'px';
		baloon_menu.className = baloon_menu.className.replace( ' hidden', '' );
		
		highlight.style.top = highlight_top + 'px';
		highlight.style.left = highlight_left + 'px';
		highlight.style.width = highlight_width + 'px';
		highlight.style.height = highlight_height + 'px';
		highlight.className = highlight.className.replace( ' hidden', '' );
	}
	
	function hide_baloon_menu()
	{
		if( !baloon_menu ) return true;
		
		baloon_menu.className = baloon_menu.className.replace( ' hidden', '' );
		baloon_menu.className += ' hidden';
	}
	
	function hide_highlight()
	{
		if( !highlight ) return true;
		
		highlight.className = highlight.className.replace( ' hidden', '' );
		highlight.className += ' hidden';
	}
	
	/* widgets */
	function show_widget_menu()
	{
		if( !widget_menu )
		{
			widget_menu = document.createElement( 'div' );
			widget_menu.className = 'widget-menu';
			container.appendChild( widget_menu );
		}
		
		var selection = get_selection();

		widget_menu.style.top = selection.position.top + selection.position.height / 2;
	}
	
	function hide_widget_menu()
	{
		if( !widget_menu ) return true;
		
		widget_menu.parentNode.removeChild( widget_menu );
		widget_menu = null;
	}
	
}