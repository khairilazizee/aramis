<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Asset_model extends CI_Model {

	public function allAsset($id){

		if($id>0){
			$this->db->where("asset_id", $id);
		} 

		$this->db->select("lib_asset.tag, lib_asset.description, lib_class.class_code, lib_class.subclass_code, lib_class.discipline, lib_asset.asset_id");
		$this->db->from("lib_asset");
		$this->db->join("lib_class","lib_asset.class_id=lib_class.class_id","LEFT");
		$query = $this->db->get();

		return $query->result();

	}

	public function allClass(){

		$this->db->group_by("class_code, subclass_code");
		$this->db->select("lib_class.class_code, lib_class.class_id, lib_class.subclass_code");
		$query = $this->db->get("lib_class");

		return $query->result();
		

	}

	public function process($id){

		$tag = $this->input->post("inpTag");
		$desc = $this->input->post("inpDescription");
		$class = $this->input->post("slxClass");
		$subclass = $this->input->post("slxSubClass");
		$pg = $this->input->post("inpPG");

		$array = array(
			"tag"=>$tag,
			"description"=> $description,
			"class_id" => $class
		);

		if($id>0){
			$this->db->where("class_id", $id);
			$query = $this->db->update("lib_asset", $array);
		} else {
			$query = $this->db->insert("lib_asset", $array);
		}

		if($query){
			return 1;
		} else {
			return 0;
		}

	}

}