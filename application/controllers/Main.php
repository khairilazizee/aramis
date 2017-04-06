<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Main extends CI_Controller {

	public function __construct(){

		parent::__construct();
		$this->load->helper("url");
		$this->load->model("asset_model");

	}

	public function index(){

		$data["all_asset"] = $this->asset_model->allAsset(0);

		$this->load->view("main_view", $data);

	}

	public function new_asset(){

		$data["all_item"] = $this->asset_model->allAsset(999999999);

		$data["class"] = $this->asset_model->allClass();
		$data["subclass"] = $this->asset_model->allClass();

		$this->load->view("new_asset_view", $data);

	}

	public function process_asset(){

		$iditem = $this->input->post("hdnID");
		$query = $this->asset_model->process($iditem);

		if($query==1){
			redirect("main");
		}

	}

	public function edit($id){

		$data["all_item"] = $this->asset_model->allAsset($id);

		$data["class"] = $this->asset_model->allClass();
		$data["subclass"] = $this->asset_model->allClass();

		$this->load->view("new_asset_view", $data);

	}

	public function delete($delete){

		$this->db->where("asset_id", $delete);
		$query = $this->db->delete("lib_asset");

		if($query==1){
			redirect("main");
		}

	}

}