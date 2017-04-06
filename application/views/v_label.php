<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>AMS: Asset Management System</title>
		
		<?php 
			$this->carabiner->display('ams_def_css');
			$this->carabiner->display('css');
			$this->carabiner->display('ams_def_js');
			$this->carabiner->display('js');
		?>
		
		<script type="text/javascript" charset="utf-8">
			$(document).bind('elastic:initialize', function () {
				ams_resize(tbl_asset, 0, 0);
			});
			$(document).ready(function($){
				var lastSel, currentRow, prevSel;
				var project_id = <?php echo $project_id; ?>;
				tbl_asset = "#asset";
				$(tbl_asset).jqGrid({
					url: 'label/inventory/<?php echo $project_id; ?>',
					datatype: 'JSON',
					mtype: 'POST',
					colNames:['ID', 'Label'],
					colModel: [{
							name: "label_id", 
							index: "tpl_label.label_id", 
							hidden: true,
						},
						{
							name: "label", 
							index: "tpl_label.label", 
							fixed: true,							
							editable: true, 							
							search: true,
							stype: 'text',
							searchoption: { sopt: ['bw', 'bn', 'ew', 'en', 'cn', 'nc'] },
						}						
						],
					rowList: [30,100,150,200],
					rowNum: 29,
					sortname: 'label_id',
					sortorder: 'asc',
					pager: tbl_asset+"-pager",
					gridview: false,
					caption: "Label Library",
					hidegrid : false,
					width: 500,
					height: 500,
					// forceFit: true,
					shrinkToFit: true,
					viewrecords: true,
					scrollOffset: 0,
					// editurl: "/ajax/inv_update/asset/<?php echo $project_id; ?>/",
					editurl: "/label/crudproxy/<?php echo $project_id; ?>/",
					jsonReader: { repeatitems: false, id: 'label_id'},
					gridComplete: function() {
						ams_resize(tbl_asset);
					},
					onSelectRow: function(id) {
					},
					ondblClickRow: function(id) {
						if(id && id !== lastSel) {
							$(tbl_asset).restoreRow(lastSel);
							lastSel = id;
						}
						ams_jqgrid_editRow(tbl_asset, id, "edit", {'project_id': project_id});
					},
					loadError: function (xhr, status, error) {
						
					},
				});
				$(tbl_asset).jqGrid("navGrid", tbl_asset+"-pager", {
						// default options
						refreshstate: "current",
						addfunc: function () {
							currentRow = $(tbl_asset).jqGrid('getGridParam', 'selrow');
							position = (currentRow) ? 'after' : 'last';
						
							var data = { label_id:"", label:""};
							ams_jqgrid_addRowData(tbl_asset, 'newData', data, position, currentRow)
							ams_jqgrid_editRow(tbl_asset, 'newData', 'add');
						},
						editfunc: function (id) {
							ams_jqgrid_editRow(tbl_asset, id, "edit");
						},
					},
					{
						// Edit option
					},
					{
						// Add Option
					},
					{
						// Del Option
					},
					{
						// Search Option
						multipleSearch: true,
					},
					{
					// View Option
					closeOnEscape: true,
				});				
				$(tbl_asset).jqGrid("navSeparatorAdd", tbl_asset+"-pager");
				$(tbl_asset).jqGrid("navButtonAdd", tbl_asset+"-pager", {
					caption: "",
					buttonicon: "ui-icon-triangle-1-w",
					position: "last",
					title: "Prev Row",
					cursor: "pointer",
					id: "prev_row",
					onClickButton: function (id)
					{
						var pvRow = $(tbl_asset).getGridParam('selrow');
						pvRow = $("tr#"+pvRow).prev().attr("id");
						pvRow = parseInt(pvRow);
						$(tbl_asset).jqGrid('setSelection', pvRow);
						return false;
					}
				});
				$(tbl_asset).jqGrid("navButtonAdd", tbl_asset+"-pager", {
					caption: "",
					buttonicon: "ui-icon-triangle-1-e",
					position: "last",
					title: "Next Row",
					cursor: "pointer",
					id: "next_row",
					onClickButton: function (id)
					{
						var nxRow = $(tbl_asset).getGridParam('selrow');
						nxRow = $("tr#"+nxRow).next().attr("id");
						nxRow = parseInt(nxRow);
						$(tbl_asset).jqGrid('setSelection', nxRow);
						return false;
					}
				});

				$(tbl_asset).jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});
			});
		</script>
		
	</head>
	
	<body style="background-color: grey">
	
		<div class="unit layout">
			<div id="ams-dialog"></div>
			
			<div class="unit header">
				<?php #$this->load->view('tpl_header'); ?>
			</div>
			
			<div class="unit navigation">
				<?php #$this->load->view('tpl_navigation'); ?>
			</div>
			
			<div class="unit content elastic-height">
				
				<div class="unit on-2 columns full-height">
					<div id="ams-clone-tool"></div>

					<div id="asset-resize" class="elastic full-height column">
						<table id="asset"></table>
						<div id="asset-pager"></div>
					</div>
		

				</div>
				
			</div>
		</div>
		
	</body>
	
</html>