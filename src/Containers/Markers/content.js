import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import classnames from 'classnames';
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import TextFieldGroup from '../../components/TextFieldGroup';
import Markermap from '../../components/Marker';

import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

import GoogleMapReact from 'google-map-react';

import { Map, InfoWindow, Marker, GoogleApiWrapper, Polygon } from 'google-maps-react';

import { postRequest, getRequest, getlistRequest } from '../../actions/httpActions';
import { addFlashMessageModal } from '../../actions/flashMessages';
import Table from '../../components/Table'

import { createBottonAndRefresh } from '../../utils/functions'


import "react-table/react-table.css";

var inside = require('point-in-polygon');

import map from 'lodash/map'

class Markers extends React.Component {

  static defaultProps = {
    center: {
      lat: 12.41933674043029,
      lng: -84.94020919557755
    },
    zoom: 8,
    key: 'AIzaSyDpH4E0qQ0qRlpDz3YHscKFU0_I0xo4UKU'
  };

  constructor(props) {
    super(props);

    this.state = {
      lat: '',
      lng: '',
      marker: '',
      errors: {},
      typeOption: '',
      isLoading: false,
      markerdt: [],
      datadt: [],
      polygonCoords: [],
      nom_poly :[]
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.validateInput = this.validateInput.bind(this);
    this.isValid = this.isValid.bind(this);

    this.onClick = this.onClick.bind(this);

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);

    this.datamarkers = this.datamarkers.bind(this);

    this.refreshTable = this.refreshTable.bind(this);
    this.pointpolygon = this.pointpolygon.bind(this);

  }
  componentDidMount() {
    this.state.datadt = this.childTablePhrases.dt();
    this.setState({
      datadt: this.childTablePhrases.dt()
    });
    this.SHOW();
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      this.POST('new_marker', 'markers');
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
    console.log(this.state.polygonCoords);
    var array_polys = this.state.polygonCoords;
    var array_pol =[];
    var poin_state = ' ';
    this.state.nom_poly.map(function (item,i) {
      array_pol =[];
      console.log("----------")
      array_polys[0][item].map(function (item,i) {
        array_pol.push( [item.lat ,item.lng]);
      })
      console.log(array_pol);
      console.log(inside([e.lat, e.lng], array_pol ));
    })

  }
  onMarkerClick(props, marker, e) {
    // ..
  }

  onMapClicked(props, map, e) {
    let location = this.state.position;
    location.lat = e.latLng.lat();
    location.lng = e.latLng.lng();

    this.setState({
      position: location
    })
    console.log(this.state.position);
  }
  refreshTable(e) {
    this.childTablePhrases.filterAll(e);
  }
  POST(type, controller) {
    this.state.typeOption = type;
    this.setState({ isLoading: true });
    this.props.postRequest(this.state, controller).then(
      (response) => {

        this.setState({ isLoading: false });
        createBottonAndRefresh(this.refreshTable);
      },
      (err) => {
        if (err.response.status == 422) {
          this.setState({ errors: err.response.data.errors, isLoading: false })
        }
        if (err.response.status == 401) {
          logout();
          this.setState({ isLoading: false });
        }
        if (err.response.status == 412) {
          this.props.addFlashMessage({
            type: 'warning',
            text: err.response.data.errors.message
          });
          this.setState({ isLoading: false });
        }
      }
    );
  }

  SHOW() {
    this.state.typeOption = 'get_polygons';
    // this.setState({ isLoading: true, typeOption: 'get_polygons' });
    this.props.getlistRequest(this.state, this.state.id, 'markers').then(
      (response) => {
        var aux ='';
        var dt = [];
        var nmpoly = [];
        response.data.data.forEach(function (key,i) {
          var lt = key.lat;
          var ln = key.lng;
          var nam = key.name;

          if(aux == key.name){
            dt[nam].push({ lat : parseFloat(lt) , lng : parseFloat(ln)});
          }else{
            dt[nam] = [];
            nmpoly.push(nam);
            dt[nam].push({ lat :parseFloat(lt) , lng : parseFloat(ln)});
          }
          aux = key.name;
        });
        this.setState({
          polygonCoords : [dt],
          nom_poly : nmpoly
        }); 
      },
      (err) => {
        if (err.response.status == 401) {
          this.setState({ isLoading: false, key: 2 });
        }
        if (err.response.status == 412) {
          this.props.addFlashMessage({

          });
          this.setState({ isLoading: false, key: 2 });
        }
      }
    );
  }


  datamarkers(data) {
    this.setState({
      datadt: data
    });
  }
  pointpolygon(row) {
    return true
  }
  render() {
    const { errors } = this.state;
    const fig = [],
    poly=this.state.nom_poly,
    polys =this.state.polygonCoords;
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
        Header: () => <b>Lng</b>,
        Cell: row => (
          <center><button type="button" onClick={(e) => this.addSelection(row)} className="btn btn-success"><i className="glyphicon glyphicon-plus"></i></button></center>
        ),
        filterable: false
      },
];


    return (
      <div>
        <div className="row">
        </div>
        <div className="col-md-12">
          <legend>
            <h2><i className="fa fa-sitemap"></i>Markers</h2>
          </legend>
        </div>
        <div className="col-md-12">
          <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="uncontrolled-tab-example" bsStyle="tabs">
            <Tab eventKey={1} title="Markers">
              <div className="container">
                <div className="row">
                  <div className="col-md-4">
                    <div className={classnames("form-group", { 'has-error': errors.marker })}>
                      <TextFieldGroup
                        error={errors.marker}
                        label="Nombre"
                        onChange={this.onChange}
                        value={this.state.marker}
                        field="marker"
                        placeHolder="Ingrese nombre del marcador"
                        required="true"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
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
                  <div className="col-md-4">
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
                  <button disabled={this.state.isLoading} onClick={this.onSubmit} className="btn btn-primary pull-right">Guardar</button>
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
              </div>
            </Tab>
            <Tab eventKey={2} title="Poligonos">
              <div className="row">
                <div className="col-md-6" style={{ height: '30px' }}>
                  <Table
                    columns={columns}
                    controller="Markers"
                    type="get_markers"
                    date="false"
                    excel="false"
                    ref={ref => this.childTablePhrases = ref}
                    datamarkers={this.datamarkers}
                  />
                </div>
                <div className="col-md-6">
                  <Map google={this.props.google}
                    style={{ width: '100%', height: '60vh', position: 'relative' }}
                    className={'map'}
                    initialCenter={this.props.center}
                    zoom={this.props.zoom}>
                    {
                      poly.map(function (item,i) {
                        return <Polygon
                          key={i}
                          paths={polys[0][item]}
                          strokeColor="#0000FF"
                          strokeOpacity={0.8}
                          strokeWeight={2}
                          fillColor="#0000FF"
                          fillOpacity={0.35}
                        />
                      })
                    }
                    {
                      this.state.datadt.map(function (item, i) {
                        return <Marker
                          key={i}
                          title={item.name}
                          name={'punto'}
                          text={item.name}
                          position={{ lat: item.lat, lng: item.lng }} />
                      })
                    }
                  </Map>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div >
    );
  }
}
Markers.propTypes = {
  postRequest: PropTypes.func.isRequired,
  getRequest: PropTypes.func.isRequired,
  addFlashMessageModal: PropTypes.func.isRequired,
  getlistRequest: PropTypes.func.isRequired,
}
const MarkersToRedux = connect(null, { postRequest, getRequest, addFlashMessageModal, getlistRequest }, null, { withRef: true })(Markers);

export default GoogleApiWrapper(
  (props) => ({
    apiKey: props.Key
  }
  ))(MarkersToRedux);
