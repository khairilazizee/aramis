<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Aramis Management System
 *
 * @package		Aramis Management System
 * @author		Hassan Abu Bakar
 * @copyright	Copyright (c) 2009, Amirul Ali.
 * @license		
 * @link			
 * @since			Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * Label
 *
 * @package Aramis Management System
 * @subpackage Controller
 * @since 1.0
 * @author Hassan Abu Bakar
 **/
class Class_Model extends CI_Model {

	/**
	 * Class constructor
	 *
	 **/
	function __construct()
	{
		parent::__construct();
		log_message('debug', 'Inventory Model Initialized');
	}

	// ------------------------------------------------------------------------

	
	function retrieve($oper, $project_id, $search_q = NULL, $sidx = NULL , $sord = NULL, $start = NULL, $limit = NULL)
	{
	
		$select = "lib_asset.*, lib_class.class_code, lib_class.subclass_code, lib_class.discipline ";
		$join 	= 'INNER JOIN lib_class ON lib_asset.class_id = lib_class.class_id';		
		#$join 	.= ' LEFT JOIN lib_asset ON ams_logable.asset_id = lib_asset.asset_id';	
		$search	= ($search_q) ? " WHERE $search_q " : '';
		$where 	= "";
		$query	= "SELECT $select FROM lib_asset $join $where $search";
		
		if ($oper === 'count') {
			#pr($query);
			$q = $this->db->query($query);			
			return $q->num_rows();
		} else {
			
			// Append START and LIMIT query if needed.
			if ($sidx && $sord)
			{
				$query .= " ORDER BY $sidx $sord";
			}
			if ( ($start && $limit) || $limit != 0 )
			{
				$query .= " LIMIT $start, $limit";
			}
			$q = $this->db->query($query);
			
			return $q->result_array();
		}
	}

	function create($project_id, $data)
	{
		
		$insert = array(			
			'project_id' => $project_id,
			'class_code' 		=> $data['class_code'],
			'subclass_code' => $data['subclass_code'],
			'discipline' => $data['discipline']			
		);
		
		// insert data into database6
		$this->db->insert('lib_class', $insert);
		if ($this->db->insert_id()) {
				$data['id'] = $this->db->insert_id();
		}
		// return data to be updated by jqgrid
		return $data;
	}

	/**
	 * Update
	 *
	 * @param int $project_id Project ID
	 * @param int $inv_id Inventory ID
	 * @return boolean
	 * @author Hassan Abu Bakar
	 **/
	function update($project_id, $data)
	{	

		$update = array(

			'project_id' => $project_id,
			'class_code' 		=> $data['class_code'],
			'subclass_code' => $data['subclass_code'],
			'discipline' => $data['discipline']	
		);
		$this->db->where('class_id', $data['class_id']);
		$this->db->update('lib_class', $update);
		
		($this->db->_error_number()) ? $data['err_id'] = $this->db->_error_number() : NULL;
		$data = array_merge($data, $update);
		
		return $data;
	}

	// ------------------------------------------------------------------------
	
	/**
	 * Delete
	 *
	 * @return boolean
	 * @author Hassan Abu Bakar
	 **/
	function delete($project_id, $data)
	{
		
		$this->db->delete('lib_class', array('class_id' => $data['id']));		
		
		return $data;
	}	
}
// End File Inventory.php
// File Source /system/application/models/Inventory.php