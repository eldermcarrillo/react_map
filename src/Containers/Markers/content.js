import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import TextFieldGroup from '../../components/TextFieldGroup';


import Markermap from '../../components/Marker';
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

//componente colores
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';

import GoogleMapReact from 'google-map-react';

import { Map, Marker, GoogleApiWrapper, Polygon, Polyline, InfoWindow } from 'google-maps-react';


import { addFlashMessageModal } from '../../actions/flashMessages';


var inside = require('point-in-polygon');
import map from 'lodash/map';
import FlashMessagesListModal from '../../components/flash/FlashMessagesListModal';
import SweetAlert from 'react-bootstrap-sweetalert';
window.SweetAlert = SweetAlert;

import axios from 'axios';
import { API } from '../../utils/constants';
import { tokenCopyPaste } from '../../utils/functions';
import ReactTable from "react-table";


class Markers extends React.Component {

  static defaultProps = {
    center: {
      lat: 12.41933674043029,
      lng: -84.94020919557755
    },
    zoom: 8,
    key: 'AIzaSyAXA_oFfYsUVJDJ-tWallGbtDmJhYk71no'
  };

  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      //variables para markadores
      lat: '',
      lng: '',
      marker: '',
      categoria: '',
      //variables validacion
      errors: {},
      typeOption: '',
      isLoading: false,
      alert: null,
      //variables poligonos
      color: '#9013FE',
      data_points_polygono: [],
      namep: '',
      //variables de mapas
      nom_poly: [],
      data_points_polygons: [],
      data_markers_line_est: [],
      data_markers_line_din: [],
      data_markers_din: [],
      data_markers_est: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      //otros
      parameters: {},
      displayColorPicker: false,
      showInfoWindow: true,
      InfoWindowpolygon: {},
      name_figura: '',
      //////////////////////////
      filtered:[],
      data_markers_din:[],
      data_markers_est:[],
      pages_est: 0,
      pages_din: 0,
      typeOption: '',
      categoria_cns: '',
    }
    //formularios
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.isValid = this.isValid.bind(this);

    //markador lat lng
    this.onClick = this.onClick.bind(this);



    //dialogo de confirmacion
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    //figuras
    this.onMapClicked = this.onMapClicked.bind(this);
    this.onClickpolygon = this.onClickpolygon.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.pointpolygon = this.pointpolygon.bind(this);

    //Consultas al api
    this.table_markers_view = this.table_markers_view.bind(this);
    this.get_polygons = this.get_polygons.bind(this);
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.delete = this.delete.bind(this);

    this.refreshtable = this.refreshtable.bind(this);
  }
  componentDidMount() {
    this.get_polygons();
  }
  get(type, controller, marker) {
    var pages = '';
    var pagesiz = '';
    if (type == 'Estatico') {
      pages = this.state.pages_est;
      pagesiz = this.state.pageSize_est;
    } else {
      pages = this.state.pages_din;
      pagesiz = this.state.pageSize_din;
    }
    axios.get(
      `${API}${controller}`,
      {
        params: {
          pages: pages,
          pageSize: pagesiz,
          typeOption: type,
          categoria: marker,
        },
        headers: { Authorization: tokenCopyPaste() }
      }).then((res) => {
        if (type == 'get_markers') {
       //   this.table_markers_view(res.data.data, marker);
        } else {
          this.maps_polygons_view(res.data.data);
        }
        this.setState({ errors: {}, isLoading: false, parameters: [] });
      });
  }
  post(type, controller) {
    //this.refreshtable();
    axios.post(`${API}${controller}`,
      this.state.parameters,
      {
        headers: { Authorization: tokenCopyPaste() }
      }).then((res) => {
        if (type == 'new_polygon') {
          this.get_polygons();
        } else {
          refreshtable()
        }
        this.setState({ errors: {}, isLoading: false, parameters: [], lat: '', lng: '', marker: '', categoria: '', data_points_polygono: [], namep: '', });
      });
  }
  delete(row, type, controller) {
    axios.delete(`${API}${controller}/` + row.id,
      {
        params: this.state.parameters,
        headers: { Authorization: tokenCopyPaste() }
      }).then((res) => {
        this.get('get_markers', 'Markers', 'Estatico');
        this.get('get_markers', 'Markers', 'Dinamico');
        this.onCancel();
        refreshtable();
        this.setState({ errors: {}, isLoading: false, parameters: [] });
      });
  }

  table_markers_view(data, marker) {
    var array_line = [];
    data.map(function (item, i) {
      array_line.push({ lat: parseFloat(item.lat), lng: parseFloat(item.lng) });
    });
    if (marker == 'Estatico') {
      this.setState({
        data_markers_est: data,
        data_markers_line_est: array_line
      });
    } else {
      this.setState({
        data_markers_din: data,
        data_markers_line_din: array_line
      });
    }
  }
  refreshtable(){
    this.setState({
      filtered:[]
    })
  }
  get_polygons() {
    this.get('get_polygons', 'Markers', '');
  }
  maps_polygons_view(data) {
    var aux = '';
    var dt = [];
    var nmpoly = [];

    data.forEach(function (key, i) {
      var lt = key.lat;
      var ln = key.lng;
      var nam = key.name;

      if (aux == key.name) {
        dt[nam].push({ lat: parseFloat(lt), lng: parseFloat(ln), color: key.color });
      } else {
        dt[nam] = [];
        nmpoly.push(nam);
        dt[nam].push({ lat: parseFloat(lt), lng: parseFloat(ln), color: key.color });
      }
      aux = key.name;
    });

    this.setState({
      data_points_polygons: [dt],
      nom_poly: nmpoly
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    if (e.target.name == "btn-guardar-poligono") {
      this.state.parameters = {
        namep: this.state.namep,
        data_points_polygono: this.state.data_points_polygono,
        color: this.state.color,
        typeOption: 'new_polygon'
      }
      this.post('new_polygon', 'markers');
    } else {
      if (this.isValid()) {
        this.state.parameters = {
          marker: this.state.marker,
          lat: this.state.lat,
          lng: this.state.lng,
          categoria: this.state.categoria,
          typeOption: 'new_marker'
        }
        this.post('new_marker', 'markers');
      }
    }

  }
  validateInput(e) {
    let errors = {};
    if (Validator.isEmpty(String(e.lat))) {
      errors.lat = 'Este campo es requerido';
    }
    if (Validator.isEmpty(e.marker)) {
      errors.marker = 'Este campo es requerido';
    }
    if (Validator.isEmpty(String(e.lng))) {
      errors.lng = 'Este campo es requerido';
    }
    if (Validator.isEmpty(String(e.categoria))) {
      errors.categoria = 'Este campo es requerido';
    }
    /*  if (Validator.isEmpty(String(e.namep))) {
        errors.e.namep = 'Este campo es requerido';
      }*/
    return {
      errors,
      isValid: isEmpty(errors)
    }
  }
  isValid() {
    const { errors, isValid } = this.validateInput(this.state);
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }
  onClick(e) {
    this.lat = e.lat;
    this.lng = e.lng;
    this.setState({
      lat: e.lat,
      lng: e.lng
    });
    var array_polys = this.state.data_points_polygons;
    var array_pol = [];
    var poin_state = ' ';
    this.state.nom_poly.map(function (item, i) {
      array_pol = [];
      array_polys[0][item].map(function (item, i) {
        array_pol.push([item.lat, item.lng]);
      })
    })

  }
  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  onMapClicked(props, map, e) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }

    var arrayp = [];

    this.state.data_points_polygono.push({ lat: e.latLng.lat(), lng: e.latLng.lng() });

    arrayp = this.state.data_points_polygono;

    this.setState({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      data_points_polygono: arrayp
    })
  }
  deletepoint(row) {
    this.setState({
      typeOption: 'delete_point',
      parameters: {
        typeOption: 'delete_point',
        id: row.original.id
      },
      alert:
        (
          <SweetAlert
            warning
            custom
            showCancel
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            confirmBtnBsStyle="primary"
            cancelBtnBsStyle="default"
            title="Desea Eliminar este Markador?"
            onConfirm={this.onConfirm}
            onCancel={this.onCancel}
          />
        )
    });
  }
  onConfirm() {
    if (this.state.typeOption == 'delete_point') {
      this.delete(this.state.parameters, 'delete_point', 'markers');
    }
  }
  onCancel() {
    this.setState({
      alert: null,
      typeOption: '',
      rowSelected: [],
    });
  }
  pointpolygon(row) {
    var array_polys = this.state.data_points_polygons;
    var array_pol = [];
    var figura = '';
    var estado = '';
    this.state.nom_poly.map(function (item, i) {
      array_pol = [];
      array_polys[0][item].map(function (item, i) {
        array_pol.push([item.lat, item.lng]);
      })
      estado = inside([parseFloat(row.original.lat), parseFloat(row.original.lng)], array_pol);
      if (estado) {
        figura = item;
      }
    });
    return figura;
  }
  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };
  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };
  handleChange = (color) => {
    this.setState({ color: color.hex })
  };
  onClickpolygon(props, marker, e) {
    this.setState({
      name_figura: props.namefigura,
      showInfoWindow: true,
      InfoWindowpolygon: { lat: props.paths[0].lat, lng: props.paths[0].lng }
    });
  }
  render() {
    const { errors } = this.state;
    const vm = this;
    const columns = [
      {
        Header: () => <b>Name</b>,
        accessor: 'name',
        filterable: false
      },
      {
        Header: () => <b>Lat</b>,
        accessor: 'lat',
        filterable: false
      },
      {
        Header: () => <b>Lng</b>,
        accessor: 'lng',
        filterable: false
      },
      {
        Header: () => <b>Poligono</b>,
        Cell: (row) => (
          this.pointpolygon(row) == "" ?
            "No Contenido"
            :
            this.pointpolygon(row)
        ),
        filterable: false
      },
      {
        Header: () => <b>Estado Point</b>,
        Cell: (row) => (
          <center><a onClick={(e) => this.deletepoint(row)} name="a-delete" style={{ textDecoration: 'none', color: '#e83434', fontSize: 'large', cursor: 'pointer' }}><i className="glyphicon glyphicon-trash"></i></a></center>
        ),
        filterable: false
      },
    ];
    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: this.state.color,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    return (
      <div className="col-md-12">
        <div className="col-md-12">
          <div className="row">
            <legend>
              <h2><i className="fa fa-sitemap"></i>Markers</h2>
              <FlashMessagesListModal />
              {this.state.alert}
            </legend>
          </div>
          <div className="row">
            <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="uncontrolled-tab-example" bsStyle="tabs">
              <Tab eventKey={1} title="Markers">
                <div className="row">
                  <div className="col-md-12" style={{ paddingTop: '10px' }}>
                    <div className="col-md-3">
                      <div className={classnames("form-group", { 'has-error': errors.marker })}>
                        <TextFieldGroup
                          error={errors.marker}
                          label="Nombre"
                          onChange={this.onChange}
                          value={this.state.marker}
                          field="marker"
                          placeHolder=""
                          required="true"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className={classnames("form-group", { 'has-error': errors.lat })}>
                        <TextFieldGroup
                          error={errors.lat}
                          label="Latitud"
                          onChange={this.onChange}
                          value={this.state.lat}
                          field="lat"
                          placeHolder=""
                          required="true"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className={classnames("form-group", { 'has-error': errors.lng })}>
                        <TextFieldGroup
                          error={errors.lng}
                          label="Longitud"
                          onChange={this.onChange}
                          value={this.state.lng}
                          field="lng"
                          placeHolder=""
                          required="true"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className={classnames("form-group", { 'has-error': errors.categoria })}>
                        <label className="control-label">Categoria</label>&nbsp;<span style={{ color: 'red' }}>*</span>
                        <select
                          className="form-control"
                          name="categoria"
                          onChange={this.onChange}
                          value={this.state.categoria}
                        >
                          <option value="" disabled>Seleccione porfavor</option>
                          <option value="Estatico">Estatico</option>
                          <option value="Dinamico">Dinamico</option>
                        </select>
                        {errors.categoria && <span className="help-block">{errors.categoria}</span>}
                      </div>
                    </div>

                    <button disabled={this.state.isLoading} onClick={this.onSubmit} className="btn btn-primary pull-right">Guardar</button>
                  </div>
                </div>
                <div className="row" style={{ paddingTop: '10px' }}>
                  <div className="col-md-12">
                    <div style={{ height: '60vh', width: '100%' }}>
                      <GoogleMapReact
                        bootstrapURLKeys={{ key: this.props.key }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                        onClick={this.onClick}
                      >
                        <Markermap
                          key='1'
                          lat={this.lat}
                          lng={this.lng}
                          text={'new point'}
                        />
                      </GoogleMapReact>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey={2} title="Poligonos">
                <div className="row" style={{ paddingTop: '10px' }}>
                  <div className="col-md-4" >
                    <div className={classnames("form-group", { 'has-error': errors.namep })}>
                      <TextFieldGroup
                        error={errors.namep}
                        label="Nombre Figura"
                        onChange={this.onChange}
                        value={this.state.namep}
                        field="namep"
                        placeHolder=""
                        required="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div>
                      <div style={styles.swatch} onClick={this.handleClick}>
                        <div style={styles.color} />
                      </div>
                      {this.state.displayColorPicker ? <div style={styles.popover}>
                        <div style={styles.cover} onClick={this.handleClose} />
                        <SketchPicker color={this.state.color} onChange={this.handleChange} />
                      </div> : null}
                    </div>
                  </div>
                  <div className="col-md-4">
          
                  </div>
                  <button name="btn-guardar-poligono" disabled={this.state.isLoading} onClick={this.onSubmit} className="btn btn-primary pull-right">Guardar</button>
                </div>
                <div className="row" style={{ paddingTop: '10px' }}>
                  <div className="col-md-12">
                    <Map google={this.props.google}
                      style={{ width: '100%', height: '60vh', position: 'relative' }}
                      className={'map'}
                      initialCenter={this.props.center}
                      zoom={this.props.zoom}
                      onClick={this.onMapClicked}
                    >
                      {
                        this.state.data_points_polygono.map(function (item, i) {
                          return <Polyline
                            key={i}
                            path={vm.state.data_points_polygono}
                            strokeColor="#0000FF"
                            strokeOpacity={0.8}
                            strokeWeight={2} />
                        })
                      }
                    </Map>
                  </div>
                </div>
              </Tab>
              <Tab eventKey={3} title="Estaticos">
                <div className="row" style={{ paddingTop: '10px' }}>
                  <div className="col-md-12">
                  <ReactTable
                      filtered={this.state.filtered}
                      defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value
                      }
                      columns={columns}
                      ref={r => (this.selectTable = r)}
                      className="-striped -highlight"
                      defaultPageSize={10}
                      data={this.state.data_markers_est}
                      pages={this.state.pages_est}
                      loading={this.state.loading}
                      manual
                      resizable={true}
                      filterable
                      filterAll={true}
                      onFetchData={(state, instance) => {
                        this.setState({ loading: true })
                        axios.get(`${API}${'Markers'}`, {
                          params: {
                            pages: state.page,
                            pageSize: state.pageSize,
                            filtered: state.filtered,
                            typeOption: 'get_markers',
                            categoria:'Estatico'
                          },
                          headers: {  Authorization: tokenCopyPaste() }
                        })
                          .then((res) => {
                            this.setState({
                              data_markers_est: res.data.data,
                              //fulldata: res.data,
                              pages_est: Math.ceil(res.data.pages / state.pageSize),
                              loading: false
                            });
                            this.table_markers_view(res.data.data, 'Estatico');
                          })
                      }
                      }
                    />
                  </div>
                  <div className="col-md-12">
                    <Map google={this.props.google}
                      style={{ width: '100%', height: '60vh', position: 'relative' }}
                      className={'map'}
                      initialCenter={this.props.center}
                      zoom={this.props.zoom}
                      onClick={this.onMapClicked}

                    >
                      {
                        this.state.nom_poly.map(function (item, i) {
                          return <Polygon
                            key={i}
                            paths={vm.state.data_points_polygons[0][item]}
                            namefigura={item}
                            strokeColor='#000000'
                            strokeOpacity={0.8}
                            strokeWeight={2}
                            fillColor={vm.state.data_points_polygons[0][item][0]['color']}
                            fillOpacity={0.35}
                            onClick={vm.onClickpolygon}
                          />
                        })
                      }
                      <InfoWindow
                        position={this.state.InfoWindowpolygon}
                        visible={this.state.showInfoWindow}>
                        <div>
                          <p>{this.state.name_figura}</p>
                        </div>
                      </InfoWindow>

                      {
                        this.state.data_markers_est.map(function (item, i) {
                          return <Marker
                            key={i}
                            title={item.name}
                            name={'punto'}
                            text={item.name}
                            position={{ lat: item.lat, lng: item.lng }}
                            onClick={vm.onMarkerClick}
                            icon={{
                              url: "../../react_map/src/img/marker3.png",
                              scaledSize: new google.maps.Size(40, 40)
                            }}
                          />
                        })
                      }
                      {
                        this.state.data_markers_line_est.map(function (item, i) {
                          return <Polyline
                            key={i}
                            path={vm.state.data_markers_line_est}
                            strokeColor="#F8E71C"
                            strokeOpacity={0.8}
                            strokeWeight={2} />
                        })
                      }
                      <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}>
                        <div>
                          <h1>{this.state.selectedPlace.text}</h1>
                          <p>Esta es la descripcion del markador</p>
                        </div>
                      </InfoWindow>
                    </Map>
                  </div>
                </div>
              </Tab>
              <Tab eventKey={4} title="Dinamicos">
                <div className="row" style={{ paddingTop: '10px' }}>
                  <div className="col-md-12">
                    <ReactTable
                      filtered={this.state.filtered}
                      defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value
                      }
                      columns={columns}
                      ref={r => (this.selectTable = r)}
                      className="-striped -highlight"
                      defaultPageSize={10}
                      data={this.state.data_markers_din}
                      pages={this.state.pages_din}
                      loading={this.state.loading}
                      manual
                      resizable={true}
                      filterable
                      filterAll={true}
                      onFetchData={(state, instance) => {
                        this.setState({ loading: true })
                        axios.get(`${API}${'Markers'}`, {
                          params: {
                            pages: state.page,
                            pageSize: state.pageSize,
                            filtered: state.filtered,
                            typeOption: 'get_markers',
                            categoria:'Dinamico'
                          },
                          headers: {  Authorization: tokenCopyPaste() }
                        })
                          .then((res) => {
                            this.table_markers_view(res.data.data, 'Dinamico');
                            this.setState({
                              data_markers_din: res.data.data,
                              pages_din: Math.ceil(res.data.pages / state.pageSize),
                              loading: false
                            })
                          })
                      }
                      }
                    />
                  </div>
                  <div className="col-md-12">
                    <Map google={this.props.google}
                      style={{ width: '100%', height: '60vh', position: 'relative' }}
                      className={'map'}
                      initialCenter={this.props.center}
                      zoom={this.props.zoom}
                      onClick={this.onMapClicked}
                    >
                      {
                        this.state.nom_poly.map(function (item, i) {
                          return <Polygon
                            key={i}
                            paths={vm.state.data_points_polygons[0][item]}
                            strokeColor='#000000'
                            name={item}
                            strokeOpacity={0.8}
                            strokeWeight={2}
                            fillColor={vm.state.data_points_polygons[0][item][0]['color']}
                            fillOpacity={0.35}
                          />
                        })
                      }
                      <InfoWindow
                        position={this.state.InfoWindowpolygon}
                        visible={this.state.showInfoWindow}>
                        <div>
                          <p>{this.state.name_figura}</p>
                        </div>
                      </InfoWindow>
                      {
                        this.state.data_markers_din.map(function (item, i) {
                          return <Marker
                            key={i}
                            title={item.name}
                            name={'punto'}
                            text={item.name}
                            position={{ lat: item.lat, lng: item.lng }}
                            onClick={vm.onMarkerClick}
                            icon={{
                              url: "../../react_map/src/img/marker3.png",
                              scaledSize: new google.maps.Size(40, 40)
                            }}
                          />
                        })
                      }
                      {
                        this.state.data_markers_line_din.map(function (item, i) {
                          return <Polyline
                            key={i}
                            path={vm.state.data_markers_line_din}
                            strokeColor="#F8E71C"
                            strokeOpacity={0.8}
                            strokeWeight={2}
                          />
                        })
                      }
                      <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}>
                        <div>
                          <h1>{this.state.selectedPlace.text}</h1>
                          <p>Esta es la descripcion del markador</p>
                        </div>
                      </InfoWindow>
                    </Map>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div > </div >
    );
  }
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: props.Key,
  }
  ))(Markers);
