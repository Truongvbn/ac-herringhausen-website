untermenu_status = new Array();
buffer = '';

isDefined = function(variable){ 
	return this[variable] !== undefined;
};

function submenu(submenu_name) {
	var submenu_items = document.querySelectorAll('.'+submenu_name);
		
	for(var k=0; k < submenu_items.length; k++ ) {
		if (submenu_items[k].style.display == 'none') {
			submenu_items[k].style.display='';
		}
		else {
			submenu_items[k].style.display='none';
		}
	}
	
	return true;
}

function create_request_object()
{
	if(navigator.appName == "Microsoft Internet Explorer")
	{
		Obj = new ActiveXObject("Microsoft.XMLHTTP");
	}else{
		Obj = new XMLHttpRequest();
	}
 
	return Obj;
}
 
function news_rating_show() {
  var i = 1;
 
	while (i <= news_rating_max_value) {
		var news_rating_span = document.getElementById('news_rating_span');
		news_rating_span.innerHTML = news_rating_span.innerHTML + '<img id = "news_rating_'+i+'" src="/images/news/rating/off.gif" OnMouseOut="news_rating_off();" OnMouseOver="news_rating_on('+i+');" OnClick="news_rating_send('+i+');">';
		i++;
	}
 
	var i = 1;
 
	while (i <= news_rating_start_value) {
		document.getElementById('news_rating_'+i).src = '/images/news/rating/on.gif';
		i++;
	}
}
 
function news_rating_off() {
	var i = 1;
 
	while (i <= news_rating_max_value) {
		document.getElementById('news_rating_'+i).src = '/images/news/rating/off.gif';
		i++;
	}
}
 
function news_rating_on(points) {
	var i = 1;
 
	while (i <= points) {
		document.getElementById('news_rating_'+i).src = '/images/news/rating/on.gif';
		i++;
	}
}
 
function news_rating_send(points) {
	var obj = create_request_object();
 
	obj.open('GET', '/news_rating.php?newsId='+news_rating_id+'&rating='+points);

	obj.onreadystatechange = function() {
		if(obj.readyState == 4 && obj.status == 200) {
      news_rating_no_mouseout2 = 1;
		
			var data = eval('('+ obj.responseText +')');
			
			document.getElementById('news_rating_show_points').style.display = 'none';
			
			document.getElementById('news_rating_span').innerHTML = data['message'];
			
			news_rating_start_value = data['new_rating_rounded'];
			
			document.getElementById('news_rating_show_points').innerHTML = data['new_rating_text'];
			
			window.setTimeout("document.getElementById('news_rating_span').innerHTML = ''; news_rating_show(); news_rating_no_mouseout2 = 0; document.getElementById('news_rating_show_points').style.display = 'inline';", 3000);
		}
	};
	obj.send(null);
}

function add_load_event(func) {
      var oldonload = window.onload;
      if (typeof window.onload != 'function') {
        window.onload = func;
      } else {
        window.onload = function() {
          if (oldonload) {
            oldonload();
          }
          func();
        }
      }
}

function newsletterbox_action(newsletterBoxId, action, email) {
	var obj = create_request_object();
 
	obj.open('POST', '/_newsletter_ajax.html');
	obj.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	
	obj.onreadystatechange = function() {
		if(obj.readyState == 4 && obj.status == 200) {
			var response_color = '';
			var response_id = '';
			var response = eval('('+ obj.responseText +')');
			
			if (response['response_type'] == 'err') {
				response_color = 'red';
				response_id = 'responseError';
			}
			else {
				response_color = 'green';
                        response_id = 'responseSuccess';
			}
			
			document.getElementById('newsletterBoxMsg_'+newsletterBoxId).innerHTML = '<span id="'+response_id+'"><font color="'+response_color+'">'+response['response_text']+'</font></span><br /><br />';
		}
	};
	obj.send('action='+action+'&email='+email);
}
