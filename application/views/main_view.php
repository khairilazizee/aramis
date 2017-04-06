<button onclick="location.href='<?php echo base_url();?>main/new_asset'">New Asset</button>
<table width="100%" border="1">
	<thead>
		<tr>
			<th>Tag</th>
			<th>Description</th>
			<th>Class</th>
			<th>Sub class</th>
			<th>PG</th>
			<th colspan="2">Action</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach($all_asset as $asset):?>
			<tr>
				<td><?php echo $asset->tag;?></td>
				<td><?php echo $asset->description;?></td>
				<td><?php echo $asset->class_code;?></td>
				<td><?php echo $asset->subclass_code;?></td>
				<td><?php echo $asset->discipline;?></td>
				<td><a href="<?php echo base_url();?>main/edit/<?php echo $asset->asset_id;?>">Edit</a></td>
				<td><a href="<?php echo base_url();?>main/delete/<?php echo $asset->asset_id;?>" onclick="return confirm('Delete item?');">Delete</a></td>
			</tr>
		<?php endforeach;?>
	</tbody>
</table>