import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopUp, setShowPopUp] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.665,
    zoom: 3
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
    console.log(logEntries);
  }

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;

    setAddEntryLocation({
      latitude,
      longitude
    })
  }

  useEffect(() => {
    (async () => {
      getEntries();
    })();
  }, [])

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
      mapStyle="mapbox://styles/jays29/ckcl36kko09vt1hp4xn6ruwj7"
      viewport={viewport}
    >
      {
        logEntries.map(entry => (
          <div key={entry._id}>
            <Marker
              key={entry._id}
              latitude={entry.latitude}
              longitude={entry.longitude}
            >
              <div onClick={() => setShowPopUp({
                [entry._id]: true
              })}>
                <svg
                  className="marker yellow"
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                  viewBox="0 0 485.213 485.212">

                  <g>
                    <path d="M242.606,0C142.124,0,60.651,81.473,60.651,181.955s151.631,303.257,181.956,303.257
                 c30.326,0,181.955-202.775,181.955-303.257S343.089,0,242.606,0z M242.606,303.257c-66.9,0-121.302-54.433-121.302-121.302
                 S175.706,60.651,242.606,60.651c66.902,0,121.302,54.435,121.302,121.304S309.509,303.257,242.606,303.257z"/>
                  </g>
                </svg>
              </div>
            </Marker>
            {
              showPopUp[entry._id] ? (
                <Popup
                  latitude={entry.latitude}
                  longitude={entry.longitude}
                  closeButton={true}
                  closeOnClick={false}
                  dynamicPosition={true}
                  onClose={() => setShowPopUp({})}
                  anchor="top"
                >
                  <div className="popup">
                    <h3>{entry.title}</h3>
                    <p>{entry.comments}</p>
                    <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                    {entry.image && <img className="logImage" src={entry.image} alt={entry.title} />}
                  </div>
                </Popup>
              ) : null
            }
          </div>
        ))
      }

      {
        addEntryLocation ? (
          <div>
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <div>
                <svg
                  className="marker red"
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                  viewBox="0 0 485.213 485.212">

                  <g>
                    <path d="M242.606,0C142.124,0,60.651,81.473,60.651,181.955s151.631,303.257,181.956,303.257
                 c30.326,0,181.955-202.775,181.955-303.257S343.089,0,242.606,0z M242.606,303.257c-66.9,0-121.302-54.433-121.302-121.302
                 S175.706,60.651,242.606,60.651c66.902,0,121.302,54.435,121.302,121.304S309.509,303.257,242.606,303.257z"/>
                  </g>
                </svg>
              </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setAddEntryLocation(null)}
              anchor="top"
            >
              <div className="popup">
                <h3>Enter your new log entry!</h3>
                <LogEntryForm
                  onClose={() => {
                    setAddEntryLocation(null);
                    getEntries();
                  }}
                  location={addEntryLocation}
                />
              </div>
            </Popup>
          </div>
        ) : null
      }
    </ReactMapGL>
  );
}

export default App;