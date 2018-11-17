<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/*
require_once('vendor/autoload.php');
require APPPATH . '/libraries/REST_Controller.php';

use \Firebase\JWT\JWT;
use Restserver\Libraries\REST_Controller;*/

class Markers extends CI_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['index_get']['limit'] = 500; // 500 requests per hour per user/key
        $this->methods['find_get']['limit'] = 500; // 500 requests per hour per user/key
        $this->methods['index_post']['limit'] = 100; // 100 requests per hour per user/key
        $this->methods['index_put']['limit'] = 100; // 100 requests per hour per user/key
        $this->methods['index_delete']['limit'] = 100; // 100 requests per hour per user/key

        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('', '');
        $this->key = $this->config->item('encryption_key');
        $this->decode = "";

        $this->request_body = json_decode(file_get_contents('php://input'),true);
    }

    public function index_get()
    {
            if ($this->input->get_post('typeOption') == 'get_markers') {
                    $obj = $this->db->query("SELECT * FROM markers where categoria ='".$this->input->get_post('categoria')."' order by id desc LIMIT ".$this->input->get_post('pageSize')."  OFFSET ".$this->input->get_post('pageSize')*$this->input->get_post('pages'));

                    $recordsTotal = $this->db->query("SELECT COUNT(*) as count FROM markers where categoria = '".$this->input->get_post('categoria')."'");
                    $recordsTotal = (isset($recordsTotal->result()[0]->count)) ? $recordsTotal->result()[0]->count : 0 ;
                    echo json_encode(array('data' => $obj->result(), 'pages' =>$recordsTotal));
            }else{
                if ($this->input->get_post('typeOption') == 'get_polygons') {

                    $obj = $this->db->query("SELECT p.name,ps.lat,ps.lng ,p.color FROM  polygons p inner join points ps on ps.id_polygons = p.id");
                    echo json_encode(array('data' => $obj->result()));
                }else{

                }
            }
    }

    public function index_post()
    {
            if ($this->input->post('typeOption') == 'new_marker') {
                        $data = array(
                           'name' => $this->input->get_post('marker'),
                           'lat' => $this->input->get_post('lat'),
                           'lng' => $this->input->get_post('lng'),
                           'categoria' => $this->input->get_post('categoria'),
                        );
                        $this->db->insert('markers', $data);
                        echo json_encode(array('data' => ['message' => 'Markador almacenado satifactoriamente.']));
            }else{
                if ($this->input->get_post('typeOption') == 'new_polygon') {
                        $data = array(
                           'name' => $this->input->get_post('namep'),
                           'color' => $this->input->get_post('color'),
                        );
                        $this->db->insert('polygons', $data);
                        $insert_id = $this->db->insert_id();
                        foreach($this->input->get_post('data_points_polygono') as $row)
                        {
                            $data_points = array(
                                'lat' => $row['lat'],
                                'lng' => $row['lng'],
                                'id_polygons' => $insert_id,
                             );
                            $this->db->insert('points', $data_points);
                        }
                        echo json_encode(array('data' => ['message' => 'Polygono almacenado exitosamente' ]));
                        }else{

                        }
            }
    }
    public function index_delete($id)
    {
            if ($this->input->get_post('typeOption') == 'delete_point') {
                $this->db->query("DELETE FROM markers WHERE id =".$this->input->get_post('id'));
                echo json_encode(array('data' => ['message' => 'Markador eliminado satisfactoriamente.']));
            }else{
            }
    }
}
