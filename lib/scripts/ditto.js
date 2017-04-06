// copy value
function ams_clone_copy_button(id)
{
	var src_val = $("input#src_"+id).val();
	$("input#dst_"+id).val(src_val);
}
// empty value
function ams_clone_empty_button(id)
{
	$("input#dst_"+id).val('');
}
// ams save values
function ams_clone_save(id, ex)
{
	$("#ams-clone-status").addClass("ams-saving-img");
	
	var dst_data = $(".ams-clone-dst-entry").serializeArray();
	$.each(dst_data, function (key,val) {
		$.ajax({
			url: '/ajax/inv_update/engineering/'+project_id,
			type: 'POST',
			data: {"id":val.name, "value":val.value, "oper":"edit"},
			success: function (data)
			{
				$("#ams-clone-status").removeClass("ams-saving-img").addClass("ams-saved-img");
				// $("#"+elem).addClass("ams-saved-img");
				setTimeout(function () {
					$("#ams-clone-status").removeClass("ams-saved-img");
				}, 1000);
			}
		})
	})
	
	if (ex)
	{
		window.close('_self');
	}
}