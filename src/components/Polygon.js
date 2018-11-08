import { Component } from 'react'

export default class Polyline extends Component {
  renderPolylines () {
    const { marke, map, maps } = this.props

    /** Example of rendering geodesic polyline */
    let geodesicPolyline = new maps.Polyline({
      path: marke,
      geodesic: true,
      strokeColor: '#00a1e1',
      strokeOpacity: 1.0,
      strokeWeight: 4
    })
    geodesicPolyline.setMap(map)

    /** Example of rendering non geodesic polyline (straight line) */
    let nonGeodesicPolyline = new maps.Polyline({
      path: marke,
      geodesic: false,
      strokeColor: '#e4e4e4',
      strokeOpacity: 0.7,
      strokeWeight: 3
    })
    nonGeodesicPolyline.setMap(map)
  }

  render () {
    this.renderPolylines()
    return null
  }
}


return <Polygon
                          key={i}
                          paths={item.poligon}
                          strokeColor="#0000FF"
                          strokeOpacity={0.8}
                          strokeWeight={2}
                          fillColor="#0000FF"
                          fillOpacity={0.35}
                        />