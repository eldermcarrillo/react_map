import React from 'react';

import classnames from 'classnames';
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import TextFieldGroup from '../../components/TextFieldGroup';
import Markermap from '../../components/Marker';



import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

import GoogleMapReact from 'google-map-react';

import { Map, InfoWindow, Marker, GoogleApiWrapper, Polygon } from 'google-maps-react';

var inside = require('point-in-polygon');

const AnyReactComponent = ({ text }) => <div>{text}</div>;

interface IMapState {
  position: LatLng;
}

interface LatLng {
  lat: number;
  lng: number;
}

class Markers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: '',
      lng: '',
      marker: '',
      errors: {},
      isLoading: false,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      polygonCoords: [
        {
          "poligon": [
            {
              "lat": 12.51588198541839,
              "lng": -86.8985221838588
            },
            {
              "lat": 11.71563887658825,
              "lng": -86.4645622229213
            },
            {
              "lat": 12.338854981681099,
              "lng": -85.8767936682338
            }
          ]
        }],
        position: {
          lat: 12.41933674043029,
          lng: -84.94020919557755
        }
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.validateInput = this.validateInput.bind(this);
    this.isValid = this.isValid.bind(this);

    this.onClick = this.onClick.bind(this);

    this.onMarkerClick = this.onMarkerClick.bind(this);


    this.onMapClicked = this.onMapClicked.bind(this);
  }
  static defaultProps = {
    center: {
      lat: 12.41933674043029,
      lng: -84.94020919557755
    },
    zoom: 8
  };
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      console.log(e)
    }
  }
  validateInput(e) {
    let errors = {};
    if (Validator.isEmpty(e.lat)) {
      errors.lat = 'Este campo es requerido';
    }
    if (Validator.isEmpty(e.marker)) {
      errors.marker = 'Este campo es requerido';
    }
    if (Validator.isEmpty(e.lng)) {
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

    var polygon = [
      [12.51588198541839, -86.8985221838588],
      [11.71563887658825, -86.4645622229213],
      [12.338854981681099, -85.8767936682338],
    ];

    console.log(this.state.polygonCoords[0].poligon);

    console.log(inside([e.lat, e.lng], polygon));


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
  render() {
    const { errors } = this.state;
    const polygonCoords = [
      /*  {
          "poligon": [
            {
              "lat": 13.84760729829456,
              "lng": -84.8880241369838
            },
            {
              "lat": 13.383133594755206,
              "lng": -84.8880241369838
            },
            {
              "lat": 13.308306104946121,
              "lng": -84.2123649572963
            },
            {
              "lat": 13.842273727760817,
              "lng": -84.2123649572963
            }
          ],
        },*/
      {
        "poligon": [
          {
            "lat": 12.51588198541839,
            "lng": -86.8985221838588
          },
          {
            "lat": 11.71563887658825,
            "lng": -86.4645622229213
          },
          {
            "lat": 12.338854981681099,
            "lng": -85.8767936682338
          }
        ]
      }
    ];
    this
    return (
      <div>
        <div className="col-md-12">
          <legend>
            <h2><i className="fa fa-sitemap"></i>Markers</h2>
          </legend>
        </div>
        <div className="col-md-12">
          <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="uncontrolled-tab-example" bsStyle="tabs">
            <Tab eventKey={1} title="Markers">
              <div className="row">
                <div className="col-md-4">
                  <div className={classnames("form-group", { 'has-error': errors.marker })}>
                    <TextFieldGroup
                      error={errors.marker}
                      label="Nombre"
                      onChange={this.onChange}
                      value={this.marker}
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
                      value={this.lat}
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
                      value={this.lng}
                      field="lng"
                      placeHolder=""
                      required="true"
                    />
                  </div>
                </div>
                <button disabled={this.state.isLoading} onClick={this.onSubmit} className="btn btn-primary pull-right">Guardar</button>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div style={{ height: '100vh', width: '100%' }}>
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: 'AIzaSyDpH4E0qQ0qRlpDz3YHscKFU0_I0xo4UKU' }}
                      defaultCenter={this.props.center}
                      defaultZoom={this.props.zoom}
                      onClick={this.onClick}
                    >
                      <AnyReactComponent
                        lat={12.41933674043029}
                        lng={-84.94020919557755}
                        text={'NICARAGUA'}
                      />
                      <Markermap
                        key='1'
                        text='nicaragua'
                        lat={this.lat}
                        lng={this.lng}
                      />
                    </GoogleMapReact>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey={2} title="Poligonos">
              <div className="row">
                <Map google={this.props.google}
                  style={{ width: '100%', height: '100vh', position: 'relative' }}
                  className={'map'}
                  initialCenter={{
                    lat: 12.41933674043029,
                    lng: -84.94020919557755
                  }}
                  zoom={8}
                >
                  {
                    polygonCoords.map(function (item, i) {
                      return <Polygon
                        key={i}
                        paths={item.poligon}
                        strokeColor="#0000FF"
                        strokeOpacity={0.8}
                        strokeWeight={2}
                        fillColor="#0000FF"
                        fillOpacity={0.35}
                      />
                    })
                  }

                  <Marker
                    title={'nuevo punto'}
                    name={'punto'}
                    position={{ lat: this.lat, lng: this.lng }} />
                </Map>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div >
    );
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDpH4E0qQ0qRlpDz3YHscKFU0_I0xo4UKU'
})(Markers)
