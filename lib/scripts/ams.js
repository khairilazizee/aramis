/**
 * AMS grid auto-resize
 */

function ams_resize(tbl_name, offsetW, offsetH, container) {
	var debug = false;
	// Refresh Elastic
    // Elastic.refresh();

	// default offset to 0
	var offsetW = (offsetW==undefined) ? 0 : offsetW;
	var offsetH = (offsetH==undefined) ? 0 : offsetH;

	// get container size
	var cont = (container) ? container+"-resize" : tbl_name+"-resize";

	var contWidth  = $(cont).width();
	var contHeight = $(cont).height();

	contWidth = contWidth - 5 - offsetW;
	contHeight = contHeight - 100 - offsetH;

	// move pager into grid
	$(tbl_name).setGridWidth(contWidth);
	$(tbl_name).setGridHeight(contHeight);

	if (debug) {
		console.log(offsetW, offsetH, cont, contWidth, contHeight, $(cont).width(), $(cont).height())
	}
}

// ------------------------------------------------------------------------

/**
 * AMS Autocomplete when entering value
 */

function ams_autocomplete(tbl_name, id, name, length) {
	// id = 4_class_code
	// name = class_code
	// elem = input#4_class_code 

	// console.log(tbl_name, id, name, length);
	// #invData newData__label label undefined undefined
	// default legth
	l = (length) ? length : 0;
	// get current row
	var row_id = id.replace(/_.+/, '');

	setTimeout(function () {
	//console.log(name);
	var initial_value = '';
		switch(name) {
			case 'unit':
				var clearNext = true;		
			break;
			
			case 'system':
				// get unit's value
				var unit_val = $("#"+row_id+"_unit").val();
				var addRequest = { unit:unit_val };
			break;
			
			case 'class_code':
				var clearNext = true;
			break;
			
			case 'subclass_code':
				// get class_code val
				var classCode_val = $("#"+row_id+"_class_code").val();
				var addRequest = { class_code:classCode_val };
			break;
			
			case 'tpl_unit':
				var clearNext = false;
				var addRequest = {};
			break;
			
			case 'family':
				var clearNext = true;
			break;
			
			case 'group':
				var familyCode = $("#"+row_id+"_family").val();
				var addRequest = { family:familyCode };
				var clearNext = true;
			break;
			
			case 'subgroup':
				var familyCode 	= $("#"+row_id+"_family").val();
				var groupCode	= $("#"+row_id+"_group").val();
				var addRequest = { family:familyCode, group:groupCode }
			break;
			
			case 'label':
			
			break;

			case 'craft':
			case 'material':
			case 'tool':

			break;
		}
		
		$("#"+id, tbl_name).autocomplete({
		// $(id, tbl_name).autocomplete({
			source: function (request, response) {
				$.extend(request, addRequest);
				$.ajax({
					url: '/ajax/inv_autocomplete/'+name+'/',
					type: 'POST',
					dataType: 'JSON',
					data: request,
					success: function (data) { response(data) },
				});
			},
			change: function (event, ui) {
				if (clearNext)
				{
					if(name == 'unit' || name == 'class_code')
					{
						//latest value
						var latest_value = $("#"+row_id+"_"+name).val();
						//console.log('latest'+latest_value);						
						if(latest_value != initial_value)
						{
							$(this).parent().next().children().val('');
						}
					}
					else
					{
						$(this).parent().next().children().val('');
					}
					
				}
				//save again using .ams-change
				$(this).trigger("change");
				// if ($.isFunction(afterChange))
			},
			create : function (event, ui)
			{
				
				switch(name) {
					case 'unit':						
						var unit_val = $("#"+row_id+"_unit").val();
						initial_value = unit_val;
						//console.log('initial'+ initial_value);				
					break;
					case 'class_code':
						var unit_val = $("#"+row_id+"_class_code").val();
						initial_value = unit_val;
						//console.log('initial'+ initial_value);
					break;
				}
				
			},
			minLength: l,
			position: {
				my: 'left bottom',
				at: 'left top',
				collision: 'flip flip',
			}
		});
		
	}, 100);

}

// ------------------------------------------------------------------------

/**
 * AMS jqGrid addRow function
 */

function ams_jqgrid_addRowData(tbl_name, id, data, position, srcrow) {
	jQuery(tbl_name).jqGrid("addRowData", id, data, position, srcrow);
}

// ------------------------------------------------------------------------

/**
 * AMS jqGrid editRow function
 */

function ams_jqgrid_editRow(tbl_name, id, oper, param) {
	console.log(param);
	operation = { "oper":oper };
	extraparam = (param) ? $.extend(param, operation) : operation;
	$(tbl_name).jqGrid(
		"editRow", // method name
		id, // row id
		true, // keys enter and esc
		'', // oneditfunc
		'', // successfunc
		'', // url
		extraparam, // extra param
		function (id, res) { ams_jqgrid_afterSaveRow(tbl_name, id, res, param) }, // aftersavefunc
		function (id, res, stat) { ams_jqrid_errorFunc(tbl_name, id, res, stat, oper, extraparam); }, // errorfunc
		'' // afterrestorefunc
	);
	// debugging
	// console.log("FIRED ams_jqgrid_editRow !!");
}


// -----------------------------------------------------------------------ams_-

/**
 * AMS jqGrid Error handling
 */

function ams_jqrid_errorFunc(tbl_name, id, res, stat, oper, param) {
	error_msg = $.parseJSON(res.responseText);
	$("#ams-dialog").dialog({
		modal: true,
		title: "Error $#@!",
		minWidth: 500,
		open: function (event, ui)
		{
			$('body').css('overflow','hidden');
			$('.ui-widget-overlay').css('width','100%');
			$(this).load("/error/index/"+error_msg.err_id);
		},
		close: function(event, ui)
		{
			$('body').css('overflow', 'auto');
			switch(error_msg.err_id) {
				
				// invalid unit & system combination
				case 9001:
					$('#'+id+"_unit").select();
				break;
				// duplicate tag
				case 1062:
					$('#'+id+"_tag").select();
				break;
			}
		}
	});
}

// ------------------------------------------------------------------------

/**
 * AMS jqGrid delRow function
 */

function ams_jqgrid_delRow(tbl_name, id, param) {
	$(tbl_name).jqGrid('delGridRow', id);
}

function ams_jqgrid_delOperationDetailRow(tbl_name, id, param) {
	$(tbl_name).jqGrid('delGridRow', id, {
			afterComplete: function()
			{
				$(craft).jqGrid('clearGridData');
				$(material).jqGrid('clearGridData');
				$(tools).jqGrid('clearGridData');
				$(description).jqGrid('clearGridData');
				$(quality_element).jqGrid('clearGridData');
				
				$(craft).trigger("reloadGrid");
				$(material).trigger("reloadGrid");
				$(tools).trigger("reloadGrid");
				$(description).trigger("reloadGrid");
				$(quality_element).trigger("reloadGrid");
				return true;
			}
		}
	);
}

function ams_jqgrid_delJobplanTemplateRow(tbl_name, id, param) {
	$(tbl_name).jqGrid('delGridRow', id, {
			afterComplete: function()
			{
				
				$(jobplanoperation).jqGrid('clearGridData');
				$(jobplanoperation).trigger("reloadGrid");

				$(craft).jqGrid('clearGridData');
				$(material).jqGrid('clearGridData');
				$(tools).jqGrid('clearGridData');
				$(description).jqGrid('clearGridData');
				$(quality_element).jqGrid('clearGridData');

				$(craft).trigger("reloadGrid");
				$(material).trigger("reloadGrid");
				$(tools).trigger("reloadGrid");
				$(description).trigger("reloadGrid");
				$(quality_element).trigger("reloadGrid");
				return true;
			}
		}
	);
}

// ------------------------------------------------------------------------

/**
 * AMS jqGrid afterSaveRow event function
 */

function ams_jqgrid_afterSaveRow(tbl_name, id, response, param) {
	// parse server response into json format
	update = $.parseJSON(response.responseText);
	// update row data
	jQuery(tbl_name).jqGrid('setRowData', id, update);
	// change tr id to current id instead if newData_ prefix
	jQuery("tr#"+id).attr("id", update.id);
	// set the new row as selection (for asset list to load attribute)
	jQuery(tbl_name).jqGrid('setSelection', update.id);
	console.log(tbl_name);
	switch(tbl_name) {
		
		case '#asset':
			ams_load_attribute(tbl_name, param['project_id'], '', 1);
		break;
		
		case '#jobplanoperation':
		case '#tbljobplanoperation':
			$(craft).trigger("reloadGrid");
	    	$(material).trigger("reloadGrid");
	    	$(tools).trigger("reloadGrid");
	    	$(description).trigger("reloadGrid");
		break;

		case '#tblcraft':
			ams_load_attribute(tbl_name, param['project_id'], '', 1);
		break;
	}
}

// ------------------------------------------------------------------------

/**
 * AMS asset page, load asset attribute onSelectRow
 */

function ams_load_attribute(tbl_name, project_id, id, p, s) {

	// clear current value
    $.each($('.ams-entry'), function (key, val) 
    { 
        $(this).val('');
        $(this).attr("checked", false);
    });
    
	if (!p) { p = '' }
	if (!s) { s = '' }
	
	// console.log(tbl_name, id, p);
	// turn on overlay
	$(".ams-overlay"+p).fadeToggle(400, "linear");
	
	// get current row data
	// currentTag = $(tbl_name).getRowData(id);
	//     if ($.isEmptyObject(currentTag))
	//     {
	//         currentTag.id = id;
	//     }
	
	// retrieve currentTag attributes
	asset_attribute = $.ajax({
		url: "/ajax/inv_attribute/asset/"+project_id+"/",
		type: "POST",
		dataType: "json",
		// data: {"inv_id":currentTag.id,"stage":s},
		data: {"inv_id":id,"stage":s},
		async: false,
	}).responseText;
	// console.log(asset_attribute);
		
	asset_attribute = $.parseJSON(asset_attribute);
	
	$.each(asset_attribute, function (key, value) {
		key = (p) ? key+p : key;
		value = (value) ? value : '';
		// console.log(key);
		// append prefix if set
		// if (p)
		// {
		// 	key = key+p;
		// 	// console.log(key);
		// }
		// console.log(valueType, key, value);
		valueType = typeof(value);
		
		if (valueType == "string")
		{
			if (!value)
			{
				if (key == "status_tag" || key == "aramis_tag")
				{
					$("#"+key).val("0");
				}
				else
				{
					$("#"+key).val("null");
				}
			}
			else 
			{
				$("#"+key).val(value);
			}
		}
		else if (valueType == "boolean")
		{
			if (value)
			{
				$("#"+key).attr("checked", true);
			}
			else
			{
				$("#"+key).attr("checked", false);
			}
		}
		else if (valueType == "object")
		{
			// Drawings
			$.each(value, function (label, value) {
				if (p)
				{
					label = label+p;
					// console.log(label);
				}
				group = key.toLowerCase();
				if (!value)
				{
					$("input#"+label).val('null');
				}
				else
				{
					$("input#"+label).val(value);
				}
				// console.log(label, value);
			})
		}
		else
		{
			// catch-all 
			console.log("CATCH ALL vT:"+valueType+" K:"+key+" V:"+value);
		}
	});

	// update sidebar label
	$("#currentTag"+p).val(asset_attribute.tag);
	
	// set all form's asset_id
	$(".ams-overlay"+p).fadeToggle(400, "linear");
}

// ------------------------------------------------------------------------

/**
 * AMS criticality page, load asset attribute onSelectRow
 */

function criticality_load_attribute(tbl_name, project_id, id, p, s) {
	console.log('criticality_load_attribute');

	// clear current value
    $.each($('.ams-entry'), function (key, val) 
    { 
        $(this).val('');
        $(this).attr("checked", false);
    });
    
	if (!p) { p = '' }
	if (!s) { s = '' }
	
	// console.log(tbl_name, id, p);
	// turn on overlay
	//$(".ams-overlay"+p).fadeToggle(400, "linear");
	
	
	criticality_attribute = $.ajax({
		url: "/ajax/inv_attribute/criticality_asset/"+project_id+"/",
		type: "POST",
		dataType: "json",
		// data: {"inv_id":currentTag.id,"stage":s},
		data: {"inv_id":id,"stage":s},
		async: false,
	}).responseText;

	// retrieve currentTag attributes
	asset_attribute = $.ajax({
		url: "/ajax/inv_attribute/asset/"+project_id+"/",
		type: "POST",
		dataType: "json",
		// data: {"inv_id":currentTag.id,"stage":s},
		data: {"inv_id":id,"stage":s},
		async: false,
	}).responseText;

	asset_attribute = $.parseJSON(asset_attribute);
	//console.log(asset_attribute);
	
	//reset radio
	$("input[type=radio]").attr("checked", false);

	//reset textarea comment	
	$("textarea").val("");

	var status = asset_attribute.CritStatus;

	if(status)		
	{		
		$("#Status"+status).attr("checked", true);
	}

	var criticality = asset_attribute.criticality;
	if(criticality)
	{		
		$("#CritNo").val(criticality);
	}

	

	criticality_attribute = $.parseJSON(criticality_attribute);
	//console.log(asset_attribute);
	$.each(criticality_attribute, function (key, value) {
		key = (p) ? key+p : key;
		value = (value) ? value : '';
		
		valueType = typeof(value);
		/*
		console.log(valueType);
		console.log(key);
		console.log(value);
		*/
		if (valueType == "string")
		{
			if (!value)
			{
				if (key == "status_tag" || key == "aramis_tag")
				{
					$("#"+key).val("0");
				}
				else
				{					
					switch(key)
					{
						case "CritE":
						case "CritS":
						case "CritP":
						case "CritD":
							$("."+key).attr("checked", false);
						break;
						case "criticality":
							$("#CritNo").val('');
						break;
						case "CritStatus":
							$(".status").attr("checked", false);
						break;
						default :
							$("#"+key).val("");
						break;
					}
				}
			}
			else 
			{
				switch(key)
				{
					case "CritE":
					case "CritS":
					case "CritP":
					case "CritD":
						$("#"+key+"_"+value).attr("checked", true);
					break;
					case "criticality":
						$("#CritNo").val(value);
					break;
					case "CritStatus":
						$("#Status"+value).attr("checked", true);
					break;
					default :
						$("#"+key).val(value);
					break;
				}
				
			}
		}
		else if (valueType == "boolean")
		{
			if (value)
			{
				$("#"+key).attr("checked", true);
			}
			else
			{
				$("#"+key).attr("checked", false);
			}
		}
		else if (valueType == "object")
		{
			$("#"+value.name+"_"+value.value).attr("checked", true);
		}
		else
		{
			// catch-all 
			console.log("CATCH ALL vT:"+valueType+" K:"+key+" V:"+value);
		}
	});

	criticality_asset_comment = $.ajax({
		url: "/ajax/inv_attribute/criticality_asset_comment/"+project_id+"/",
		type: "POST",
		dataType: "json",
		// data: {"inv_id":currentTag.id,"stage":s},
		data: {"inv_id":id,"stage":s},
		async: false,
	}).responseText;

	criticality_asset_comment = $.parseJSON(criticality_asset_comment);

	$.each(criticality_asset_comment, function (key, value) {
		key = (p) ? key+p : key;
		value = (value) ? value : '';

		valueType = typeof(value);

		$("#"+value.name+"_comment").val(value.comment);
		
	});

	$(".ams-overlay"+p).fadeToggle(400, "linear");

	calculate_criticality(project_id);
	//$("#CritCriticality").val();
	//alert(default_formula);
	//alert(eval(default_formula));
	
	// update sidebar label
	$("#currentTag"+p).val(asset_attribute.tag);
	$("#currentTagId"+p).val(asset_attribute.asset_id);

	// set all form's asset_id
	
}

/**
 * AMS user page, load user project onSelectRow
 */

function ams_user_load_attribute(tbl_name, user_id, id, p, s) {

	// clear current value
    $.each($('.user-entry'), function (key, val) 
    { 
        $(this).val('');
        $(this).attr("checked", false);
    });
    
	if (!p) { p = '' }
	if (!s) { s = '' }
	
	// console.log(tbl_name, id, p);
	// turn on overlay
	$(".ams-overlay"+p).fadeToggle(400, "linear");
	
	// get current row data
	// currentTag = $(tbl_name).getRowData(id);
	//     if ($.isEmptyObject(currentTag))
	//     {
	//         currentTag.id = id;
	//     }
	
	// retrieve currentTag attributes
	user_attribute = $.ajax({
		url: "/admin/users/inv_projects/"+user_id+"/",
		type: "POST",
		dataType: "json",
		// data: {"inv_id":currentTag.id,"stage":s},
		data: {"inv_id":id,"stage":s},
		async: false,
	}).responseText;
	// console.log(asset_attribute);
		
	user_attribute = $.parseJSON(user_attribute);
	
	$.each(user_attribute, function (key, value) {
		key = (p) ? key+p : key;
		value = (value) ? value : '';
		// console.log(key);
		// append prefix if set
		// if (p)
		// {
		// 	key = key+p;
		// 	// console.log(key);
		// }
		// console.log(valueType, key, value);
		valueType = typeof(value);
		
		if (valueType == "string")
		{
			$("#"+key).val(value);
		}		
		else if (valueType == "object")
		{			
			// Projects
			console.log(value);
			$.each(value, function (label, value) {
				
				if (value)
				{
					$("#project_"+value).attr("checked", true);					
				}
				else
				{
					$("#project_"+value).attr("checked", false);					
				}
				// console.log(label, value);
			})
		}
		else
		{
			// catch-all 
			console.log("CATCH ALL vT:"+valueType+" K:"+key+" V:"+value);
		}
	});

	// update sidebar label
	$("#currentUsername"+p).val(user_attribute.username);

	//update for hidden user_id
	$(".currentUserId"+p).val(user_attribute.user_id);
	
	// set all form's asset_id
	$(".ams-overlay"+p).fadeToggle(400, "linear");
}

function calculate_criticality(project_id)
{
	//get the formula
	default_formula = "( P + E + ( S * S * 1.5 ) ) * D";
	default_formula2 = $.ajax({
		url : "/admin/criticality/get_selected_formula",
		type: "GET",
		dataType: "json",
		async: false,/*
		success: function(k,v){
			default_formula = $.parseJSON(k);
			console.log(default_formula);
			console.log(default_formula.master_desc);
			default_formula = default_formula.master_desc;

		}
		*/
	}).responseText;
	
	default_formula2 = $.parseJSON(default_formula2);	
	default_formula = default_formula2.master_desc;
	//get subgroup
	criticality_subgroup = $.ajax({
		url: "/criticality/get_subgroup",
		type: "GET",
		dataType: "json",
		// data: {"inv_id":currentTag.id,"stage":s},		
		async: false,
	}).responseText;
	criticality_subgroup = $.parseJSON(criticality_subgroup);	

	new_criticality = 0;

	if(project_id == 2)
	{
		c_counter = 1;
		max_counter =criticality_subgroup.length;
		var pearl_category = new Array();

		$.each(criticality_subgroup, function (k , v){

			var subgroup_name = $(this).attr('subgroup_name');
			subgroup_name = subgroup_name.replace(/ /g,"_");
			
			var value = $("."+subgroup_name+":checked").val();

			var short_name = $(this).attr('subgroup_short_name');
			
			var regex = new RegExp(short_name, "g");
			
			
			default_formula =	default_formula.replace(regex,parseInt(value));	
			pearl_category[short_name] = value;

			/*
			console.log(subgroup_name);
			console.log(short_name);
			console.log(regex);
			console.log(default_formula);
			*/
			if(c_counter == max_counter)
			{
				console.log(pearl_category);
				console.log(pearl_category.S);
				console.log(pearl_category['E']);
				console.log(pearl_category.C);								
				console.log(pearl_category.P);

				if(
					(typeof pearl_category.S === 'undefined') ||
					(typeof pearl_category.E === 'undefined') ||
					(typeof pearl_category.C === 'undefined') ||
					(typeof pearl_category.P === 'undefined')
				)
				{
					new_criticality = '';
				}
				else
				{
					new_criticality = criticality_pearl(pearl_category.S, pearl_category['E'], pearl_category.C, pearl_category.P);
				}
				
				console.log(new_criticality);
			}

			c_counter++;
		})
		$("#CritCriticality").val(new_criticality);

	}
	else
	{
		//get the checked value
		$.each(criticality_subgroup, function (k , v){

			var subgroup_name = $(this).attr('subgroup_name');
			subgroup_name = subgroup_name.replace(/ /g,"_");
			
			var value = $("."+subgroup_name+":checked").val();

			var short_name = $(this).attr('subgroup_short_name');
			
			var regex = new RegExp(short_name, "g");
			
			
			default_formula =	default_formula.replace(regex,parseInt(value));	

			/*
			console.log(subgroup_name);
			console.log(short_name);
			console.log(regex);
			console.log(default_formula);
			*/
		})

		new_criticality = eval(default_formula);

		//var total = parseInt(e) + parseInt(p) + parseInt(d) + parseInt(s);
		//alert(total);

		

		//alert(default_formula);
		/*
		var default_formula =	default_formula.replace(/E/g,parseInt(e));
		var default_formula =	default_formula.replace(/P/g,parseInt(p));
		var default_formula =	default_formula.replace(/D/g,parseInt(d));
		var default_formula =	default_formula.replace(/S/g,parseInt(s));
		*/
		$("#CritScore").val();

		//get the limit
		criticality_limit = $.ajax({
			url: "/criticality/get_limit/",
			type: "POST",
			dataType: "json",
			// data: {"inv_id":currentTag.id,"stage":s},
			//data: {"inv_id":id,"stage":s},
			async: false,
		}).responseText;
		//console.log(criticality_limit);
		criticality_limit = $.parseJSON(criticality_limit);
		console.log(criticality_limit);

		number = eval(default_formula);
		first_time = true;
		final_number = 0;

		$.each(criticality_limit.standard, function(key , val){
			
			if(first_time == true)
			{
				ceiling = val;
				first_time = false;

				if(number >= ceiling)
				{
					final_number = key;						
					return false;
				}
			}
			else
			{

				if(number >= val && number < ceiling)
				{
					final_number = key;
					return false;
				}

				val = ceiling;
			}
		});

		//alert(final_number);
		$("#CritCriticality").val(final_number);
	}
	
	
}

function criticality_pearl(safety, environment, cost, production)
{
	s = safety;
	e = environment;
	c = cost;
	p = production;

	final_criticality = 2;

	if(
			(s == 'NA' || e == 'NA' || c == 'NA' || p == 'NA')
		)
		{
			final_criticality = 'NA';
		}

	//1
	else if(
		(s == 'A' || e == 'A' || c == 'A')			
	)
	{		
		if(p == 'A' || p == 'B')
		{
			final_criticality = 1;
		}
	}
	else if(
		(s == 'B' || e == 'B' || c == 'B')				
	)
	{
		if(p == 'A')
		{
			$final_criticality = 1;
		}
	}
	//3
	else if(

		(s == 'C' || s == 'D') ||
		(e == 'C' || e == 'D') ||
		(c == 'C' || c == 'D')
	)
	{
		if(

			(p == 'C' || p == 'D')
		)
		{
			final_criticality = 3;
		}
	}

	return final_criticality;
}

