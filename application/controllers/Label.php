<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Aramis Management System
 *
 * @package		Aramis Management System
 * @author		Hassan Abu Bakar
 * @copyright	Copyright (c) 2012, Aramis Group.
 * @license		
 * @link			
 * @since			Version 1.5
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * Ditto
 *
 * @package Aramis Management System
 * @subpackage Controller
 * @since 1.0
 * @author Hassan Abu Bakar
 **/
class Label extends CI_Controller {

	/**
	 * Constructor Function
	 *
	 * @return void
	 * @author Hassan Abu Bakar
	 **/
	function __construct()
	{
		parent::__construct();
		#$this->ams->in_session();
		#$this->project_id = ($this->session->userdata('project_id')) ? $this->session->userdata('project_id') : NULL;
		#$this->terminology = ($this->session->userdata('terminology')) ? $this->ams->terminology_list($this->session->userdata('terminology')) : NULL;
		#$this->lang->load($this->terminology['tag'], 'english');
		$this->load->model('Label_model', 'label_model');
		log_message('debug', 'Label Controller Initialized');
	}

// ------------------------------------------------------------------------

	/**
	 * CI Default Function
	 *
	 * @return void
	 * @author Amirul Ali
	 **/
	function index()
	{
		$project_id = 2;
		$template = array(
			'project_id' => $project_id
		);
		$this->load->view('v_label', $template);
	}

	
	function inventory($project_id)
	{
		header('Content-type: application/json');
		// current requested page
		$page = $this->input->get_post('page');
		// limit per result/page
		$limit = $this->input->get_post('rows');
		// sorting column
		$sidx = ($this->input->get_post('sidx')) ? $this->input->get_post('sidx') : 1;
		// sorting order
		$sord = $this->input->get_post('sord');
		// Search conditions
		if ($this->input->get_post('_search') === 'true') {			
			$filters = json_decode($this->input->get_post('filters'));
			$search  = $this->ams->jqgrid2sql($filters);
		} else {
			$search = '';			
		}
		// get total records/row of query
		$count = $this->label_model->retrieve('count', $project_id, $search);
		
		/**
		 * Generate total page number base on total row
		 * divided by $limit per page
		 */
		if ($count > 0 && $limit > 0) {
			$total_pages = ceil($count/$limit);
		} else {
			$total_pages = 0;
		}
		
		// if requested page is higher then total pages, revert to last page
		$page = ($page > $total_pages) ? $total_pages : $page;
		
		// calculating starting position of the row (SQL Offset)
		$start = $limit*$page - $limit;
		// revert negative number to 0
		$start = ($start < 0) ? 0 : $start;
		
		/**
		 * total = total page for the query
		 * page = current page of the query
		 * records = total number of records
		 */
		// data query
		$data = $this->label_model->retrieve('list', $project_id, $search, $sidx, $sord, $start, $limit);
		
		// merging all datas for jqGrid
		$response->total 	= $total_pages;
		$response->page 	= $page;
		$response->records 	= $count;
		$response->rows 	= $data;

		// Output in json format
		echo json_encode($response);
	}

	// --------------------------------------------------------------------
	
	/**
	 * CRUD Proxy
	 *
	 * @return JSON
	 * @author Amirul Ali
	 **/
	function crudproxy($project_id)
	{
		// fetch all post into single variable
		$post_data = $this->input->post();
		
		switch($post_data['oper']) {
			
			case 'add':
				$result = $this->label_model->create($project_id, $post_data);
			break;
			
			case 'edit':
				$result = $this->label_model->update($project_id, $post_data);
			break;
			
			case 'del':
				$result = $this->label_model->delete($project_id, $post_data);
			break;
		}
		
		// Error reporting
		if (!@is_null($result['err_id']) || @isset($data['err_id']))
		{
			// there is error, switch to error 500 and return error message
			header("HTTP/1.0 500 Internet Server Error");
		}
		
		echo json_encode($result);
	}
	


}
// End File CI_Controller.php
// File Source /application/controllers/CI_Controller.php