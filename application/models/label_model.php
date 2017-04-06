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
class Label_model extends CI_Model {

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

	/**
	 * get_label function
	 *
	 * @return void
	 * @author Hassan Abu Bakar
	 **/
	function get_label()
	{
		$this->db->where_not_in('label_id' , array(7,1));
		#$this->db->limit(5);
		$this->db->order_by('label');
		$query = $this->db->get('tpl_label');
		return $query->result_array();
	}
	
	// ------------------------------------------------------------------------

	function get_specific_label($table_name)
	{
		$query = $this->db->select('tpl_label.label_id,tpl_label.label')
		->distinct()
		->from('lib_asset, tpl_label,'.$table_name)
		->where('lib_asset.project_id' , $this->project_id)
		->where('lib_asset.asset_id' , $table_name.'.asset_id' ,false)
		->where($table_name.'.label_id' , 'tpl_label.label_id' , false)
		->order_by('tpl_label.label')
		->get();

		#pr($this->db);die();
		return $query->result_array();

	}

	/**
	 * Retrieve
	 *
	 * @return JSON
	 * @author Hassan Abu Bakar
	 **/
	
	function retrieve($oper, $project_id, $search_q = NULL, $sidx = NULL , $sord = NULL, $start = NULL, $limit = NULL)
	{
	
		$select = "* ";
		$join 	= '';		
		#$join 	.= ' LEFT JOIN lib_asset ON ams_logable.asset_id = lib_asset.asset_id';	
		$search	= ($search_q) ? " WHERE $search_q " : '';
		$where 	= "";
		$query	= "SELECT $select FROM tpl_label $join $where $search";
		
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
			'label' 		=> $data['label']			
		);
		
		// insert data into database6
		$this->db->insert('tpl_label', $insert);
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

			'label'	=> $data['label']
		);
		$this->db->where('label_id', $data['id']);
		$this->db->update('tpl_label', $update);
		
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
		
		$this->db->delete('tpl_label', array('label_id' => $data['id']));		
		
		return $data;
	}	
}
// End File Inventory.php
// File Source /system/application/models/Inventory.php