<?php

$tag = $desc = $kelas = $subkelas = $pg = "";

foreach($all_item as $item){
	$tag = $item->tag;
	$desc = $item->description;
	$kelas = $item->class_code;
	$subkelas = $item->subclass_code;
	$pg = $item->discipline;
	$id = $item->asset_id;
}



?>
<form action="<?php echo base_url();?>main/process_asset" method="POST">
	<table width="100%" border="1">
		<thead>
			<tr>
				<td>Tag</td>
				<td>:</td>
				<td><input type="text" name="inpTag" value="<?php echo $tag;?>"></td>
			</tr>
			<tr>
				<td>Description</td>
				<td>:</td>
				<td><textarea name="inpDescription" id="" cols="30" rows="10"><?php echo $desc;?></textarea></td>
			</tr>
			<tr>
				<td>Class</td>
				<td>:</td>
				<td><select name="slxClass" id="">
					<option value="">- CLASS -</option>
					<?php foreach($class as $cls):?>
						<option <?php if($kelas==$cls->class_code){echo "SELECTED";}?> value="<?php echo $cls->class_code;?>"><?php echo $cls->class_code;?></option>
					<?php endforeach;?>
				</select></td>
			</tr>
			<tr>
				<td>Sub Class</td>
				<td>:</td>
				<td><select name="slxSubClass" id="">
					<option value="">- SUB CLASS -</option>
					<?php foreach($subclass as $subcls):?>
						<option <?php if($subkelas==$subcls->subclass_code){echo "SELECTED";}?> value="<?php echo $subcls->subclass_code;?>"><?php echo $subcls->subclass_code;?></option>
					<?php endforeach;?>
				</select></td>
			</tr>
			<tr>
				<td>PG</td>
				<td>:</td>
				<td><input type="text" name="inpPG" value="<?php echo $pg;?>"></td>
			</tr>
			<tr>
				<td colspan="3"><input type="submit" value="Submit" name="btnSubmit"></td>
			</tr>
		</thead>
	</table>
</form>