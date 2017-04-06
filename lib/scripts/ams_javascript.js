// get class list
function ams_get_classes(class_type, class_code, request, response)
{
	// data
	// 1. class_type = current cell
	// 2. class_code = if 1 is subclass_code, get class_code
	// 3. term to refine search
	jQuery.extend(request, {"class_type":class_type, "class_code":class_code});
	ams_get_class = $.ajax({
		url: "/ajax/inv_autocomplete/class/",
		type: "POST",
		dataType: "json",
		data: request,
		success: function(data){response(data)},
	}).responseText;
	return ams_get_class;
}
// get tag list
function ams_get_tags(request, response, sameclass)
{
	if (sameclass)
	{
		request.sameclass = sameclass;
	}
	ams_get_tag = $.ajax({
		url: "/ajax/inv_autocomplete/tag/",
		type: "POST",
		dataType: "json",
		data: request,
		success: function(data){response(data)},
	}).responseText;
	return ams_get_tag;
}
// get supply list
function ams_get_supplies(request, response)
{
	ams_get_supply = $.ajax({
		// url: "/asset/get_supply/",
		url: "/ajax/inv_autocomplete/supply/",
		type: "POST",
		dataType: "json",
		data: request,
		success: function(data){response(data)},
	}).responseText;
	return ams_get_supply;
}
// get unit list
function ams_get_location(location_type, location_code, request, response)
{
	jQuery.extend(request, {"location_type": location_type, "location_code":location_code});
	ams_get_unit = $.ajax({
		url: "/ajax/inv_autocomplete/location/",
		type: "POST",
		dataType: "json",
		data: request,
		success: function(data){response(data)},
	}).responseText;
	return ams_get_unit;
}
// get discipline list
function ams_get_discipline_list(request, response)
{
	ams_get_discipline = $.ajax({
		url: "/asset/get_discipline/",
		type: "POST",
		dataType: "json",
		data: request,
		success: function(data){response(data)},
	}).responseText;
	return ams_get_discipline;
}
// get inventory label list
function ams_get_label(request, response)
{
    $.ajax({
        url: '/ajax/inv_autocomplete/label/',
        type: 'POST',
        dataType: 'json',
        data: request,
        success: function(data){response(data);},
    });
}
// unified autocomplete getter
function ams_get_autocomplete(request, response, table)
{
    $.ajax({
        url: '/ajax/inv_autocomplete/'+table+'/',
        type: 'POST',
        dataType: 'JSON',
        data: request,
        success: function (data) { response(data) },
    });
}
// check class_id
function ams_chk_class(class_code, subclass_code) {
	class_id = jQuery.ajax({
		url: "/asset/get_classid/",
		type: "POST",
		dataType: "json",
		data: {"class_code":class_code, "subclass_code":subclass_code},
		success: function(data) { return data },
		async: false,
	}).responseText;
	return class_id;
}
// save all
function ams_save_all() {
	form = $("form#location, form#commissioning, form#pid, form#md, form,vd").serialize();
	// console.log(form);
}
// function to update/add/delete
function ams_database(request) {
	$.ajax({
		url: "/asset/update_asset/",
		type: "POST",
		data: request,
		success: function(data){}
	});
}
// load engineering data
function ams_load_eng_att(tbl_name, id, p) {
	p = (p) ? p : '';
	currentTag = $(tbl_name).getRowData(id);
	currentTag = ($.isEmptyObject(currentTag)) ? {"id":id} : currentTag;
	
	eng_attribute = $.ajax({
		url: "/ajax/inv_attribute/engineering/",
		type: "POST",
		dataType: "JSON",
		data: currentTag,
		async: false,
	}).responseText;
	eng_attribute = $.parseJSON(eng_attribute);
	
	if (tbl_name == 'eng_clone')
	{
		// asset_id 		"5"
		// engineering_id 	"36682"
		// label_id 		"69"
		// sort 			"1"
		// value 			"1/2""
		$i = eng_attribute.length;
		while ($i>0)
		{
			console.log(eng_attribute[$i]);
			$i--;
		}
	}
}
// save asset attribute data
function ams_save_attribute(elem, saveData) {
	// add loading image into input#text
	$("#"+elem).addClass("ams-saving-img");
	// run save data
	testing = $.ajax({
		url: "/ajax/set_inv_att/asset/",
		type: "POST",
		data: saveData,
		success: function (data) 
		{
			$("#"+elem).removeClass("ams-saving-img");
			$("#"+elem).addClass("ams-saved-img");
			setTimeout(function () {
				$("#"+elem).removeClass("ams-saved-img");
			}, 1000);
		},
		error: function (x)
		{
			// var a = jQuery.parseJSON(x.responseText);
			//a.data.err_id
			$("#"+elem).removeClass("ams-saving-img");
			$("#"+elem).addClass("ams-failed-img");
			setTimeout(function() {
				$("#"+elem).removeClass("ams-failed-img")
			}, 1000);
		}
	});
}
// Tool: Ditto (clone)
function ams_clone_selected() {
	src_id = $("#tag_src").val();
	dst_id = $("#tag_dst").val();
	cloneUrl = '/tools/ditto/engineering/'+src_id+'/'+dst_id+'/';
	// fn_openWindow(cloneUrl, 'clone', 800, 600, 'yes', 'center')
	open(cloneUrl, '_self');
}
// Open window function
function fn_openWindow( mypage , myname , w , h , scroll , pos ) {
   w = (w==null)?(screen.width):w;
   h = (h==null)?(screen.width):h;

   scroll = (scroll==null)?'yes':scroll; 
   pos = (pos==null)?'custom':pos;

   if( pos == "random" )
   { 
     LeftPosition = ( screen.width ) ? Math.floor(Math.random()*(screen.width-w)) : 100;
     TopPosition  = ( screen.height ) ? Math.floor(Math.random()*((screen.height-h)-75)):100;
   }
   if( pos == "center" )
   {
     LeftPosition = ( screen.width ) ? (screen.width-w)/2:100;
     TopPosition  = ( screen.height ) ? (screen.height-h)/2:100;
   }
   if( pos == "custom" )
   {
     LeftPosition = 0;
     TopPosition  = 0;
   }   
   else if( (pos!="center" && pos!="random") || pos==null )
   {
     LeftPosition=0;
     TopPosition=20;
   }
   settings='width='+w+',height='+h+',top='+TopPosition+',left='+LeftPosition+',scrollbars='+scroll+',location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=no';
   win=window.open(mypage,myname,settings);
   return win;

}
// Weeks formatting
function ams_weeks_format(cellValue, options, rowObject) {	
    var newVal = cellValue + " Wks"
    return newVal
}
function ams_weeks_unformat(cellValue, options,cell) {	
	var newVal =  cellValue.replace("Wks","");	
	return newVal
}

// Inventory Page, update description preview
function ams_inventory_description(tbl1, tbl2) {
	var currentClass = $(tbl2).jqGrid('getRowData', $(inventory).jqGrid('getGridParam', 'selrow'));
	currentClass = (currentClass) ? currentClass : '';
	var data = $(tbl1).jqGrid('getGridParam', 'data');
	
	var total = data.length;
	var family		= (currentClass.family) ? currentClass.family : '';
	var group 		= (currentClass.group) ? currentClass.group : '';
	var subgroup 	= (currentClass.subgroup) ? currentClass.subgroup : '';
	var str = ''
	
	if (family || group || subgroup){
		str = family+' - '+group+' - '+subgroup+' : ';
	}

	var val, unit, suffix
	
	for (x = 0 ; x < total; ++x) {
		if (data[x].for_description == '1')
		{
			val = (data[x].value) ? data[x].value : 'Not Available';
			unit = (data[x].unit) ? ' '+data[x].unit : '';
			append = (data[x].append) ? ' '+data[x].append : '';

			suffix = (x < total-1) ? ', ' : '' 
			str = str+val+unit+append+suffix;
		}
	}
	$("input#inventory_description").val(str);
}
//Inventory page, update aramis item number based on primary key (unique)
//TODO : append from settings
//as for now hard code
function ams_inventory_aramis_item_number(tbl2) {
	var currentClass = $(tbl2).jqGrid('getRowData', $(inventory).jqGrid('getGridParam', 'selrow'));
	currentClass = (currentClass) ? currentClass : '';	

	var aramis_item_number		= (currentClass.inventory_id) ? currentClass.inventory_id : '';
	$("input#aramis_item_number").val("IPP-"+aramis_item_number);
}
function ams_pmjob_loadWindow(tbl, pid, id) {
	console.log("Z",tbl,pid,id);
	$.ajax({
		url: '/ajax/inventory/jobplan_desc/'+pid+'/'+id+'/',
		type: 'POST',
		success: function (data){
			if(data.rows){
				$.each(data.rows[0], function (key, value){
					if (key === 'maintenance_group' && value == 0){ value=''}
					$(tbl+"-"+key).val(value);
				})
			}
		}
	})
	$(tbl).jqGrid('setGridParam', {url: '/ajax/inventory/jobplan_operation/'+pid+'/'+id+'/'}).trigger('reloadGrid');
	
}
// Additional functions on document ready
$(document).ready(function($) {

	// bind enter into input[type=select] to work like tab
	textboxes = $(".ams-entry").bind('keypress', function(e){
		if (e.keyCode == 13)
		{
			currentBox = textboxes.index(this);
			if (textboxes[currentBox + 1] != null)
			{
				nextBox = textboxes[currentBox + 1]
				nextBox.focus();
				if (nextBox.nodeName != "SELECT")
				{
					nextBox.select();
				}
			}
			// console.log(textboxes[currentBox + 1]);
		}
	});

	// bind onchange to each input field for update
	$(".ams-entry").bind('change', function () {
		if (this.type == "checkbox")
		{
			value = $("input#"+this.id+":checked").val();
			if (value !== undefined)
			{
				value = 1;
			}
			else
			{
				value = 0;
			}
			field = this.id;
			// saveData = field+"="+value;
			// saveData = new Array(field, value);
			saveData = {"asset_id":asset_attribute.asset_id , "field":field, "value":value}; 
		}
		else
		{
			field = $(this).attr('name');
			value = $(this).val();
			// saveData = new Array(field, value)
			saveData = {"asset_id":asset_attribute.asset_id , "field":field, "value":value};
		}

		// save command here
		ams_save_attribute(this.id, saveData);
	});

	// bind onchange to clone tool
	// $("input#tag_dest").bind('focusout', function () {
	// 	destTag = $(this).val();
	// 	ams_load_eng_att('eng_clone', destTag, "_dest");
	// });
    // $j("#dropmenu ul").css({display: "none"}); // Opera Fix 
    $("#nav li").hover(function(){ 
    		$(this).find('ul:first').css({visibility: "visible",display: "none"}).show(268); 
    	},function(){ 
    		$(this).find('ul:first').css({visibility: "hidden"}); 
	});
	
	$("#jobplan-tabs").tabs();
});