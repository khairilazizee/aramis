$(document).ready(function() {
	$('input[name=username]').focus();
	
	// $('.autoClear').focusin(function() {
	// 	if ( $(this).val() == "Username" || $(this).val() == "Password")
	// 	{
	// 		$(this).val('');
	// 	}
	// });
	$('#form_login').submit(function () {
		// $('.login_status').addClass('login_process');
		// $.ajax({
		// 	url: '/login/validate_credentials',
		// 	type: 'POST',
		// 	data: $(this).serialize(),
		// 	success: function(data) {
		// 		var obj = jQuery.parseJSON(data);
		// 		// status true
		// 		if (obj.status)
		// 		{
		// 			//window.open("<?php echo base_url(); ?>index.php/asset", "ams", "resizable=yes,scrollbars=no,status=no,location=no");
		// 			window.location.href='/asset/';
		// 		}
		// 		// status false
		// 		else
		// 		{
		// 			$('#login_error').html('<p>' + obj.message + '</p>').slideDown('slow');
		// 		}
		// 	}
		// });
		// $('.login_status').removeClass('login_process');
		// return false;
	});
});
