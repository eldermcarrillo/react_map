import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import classnames from 'classnames';

import { Map, InfoWindow, Marker, GoogleApiWrapper, Polygon } from 'google-maps-react';

var inside = require('point-in-polygon');

class mappoly extends React.Component {
    constructor(props) {
        super(props);
    }
    static defaultProps = {
        center: {
            lat: 12.41933674043029,
            lng: -84.94020919557755
        },
        zoom: 8
    };

    render() {
        return (
            <div>
                <div className="row">
                    <Map google={this.props.google}
                        style={{ width: '100%', height: '100vh', position: 'relative' }}
                        className={'map'}
                        initialCenter={this.props.center}
                    >
                    </Map>
                </div>
            </div >
        );
    }
}

export default
GoogleApiWrapper({
    apiKey: 'AIzaSyDpH4E0qQ0qRlpDz3YHscKFU0_I0xo4UKU'
})(mappoly);
