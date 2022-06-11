import React from "react";
import { GoogleMap, InfoWindow, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import mapStyles from "../../src/mapStyles";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const libraries = ["places"];
const center = { lat: 40.7616731, lng: -73.8155219 };
const mapContainerStyle = { width: "100vw", height: "100vh" };
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Explore() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  // Set marker where user clicks
  const onMapClick = React.useCallback((event) => {
    let marker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date()
    };
    setMarkers(current => [...current, marker])
  }, []);

  // Storing map reference
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, [])

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "loading maps";

  return (
    <div>
      <h1>Explore Map:</h1>
      
      <Search setMarkers={setMarkers} setSelected={setSelected} />
      {/*<Autocomplete>
        <input type="text" placeholder="Enter Location" />
      </Autocomplete>*/}

      <GoogleMap
        zoom={12}
        mapContainerStyle={mapContainerStyle}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map(marker => (
          <Marker 
            key={ marker.time.toISOString() } 
            position={ {lat: marker.lat, lng: marker.lng} } 
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {selected && <Marker position={selected} />}

        {selected ? (
          <InfoWindow 
            position={selected} 
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>Explore Event!</h2>
              <p>Here's some information.</p>
            </div>
          </InfoWindow>) : null}

          
      </GoogleMap>
    </div>
  );
}

const Search = ({ setMarkers, setSelected }) => {
  const { ready, value, setValue, suggestions: {status, data}, clearSuggestions } = usePlacesAutocomplete(
    // {
    // requestOptions: {
    //   location: { lat: () => center.lat, lng: () => center.lng },
    //   radius: 200 * 1000,
    // }
    // }
  );

  const handleSelect = async(address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({lat, lng});

    let marker = {
      lat,
      lng,
      time: new Date()
    };
    setMarkers(current => [...current, marker])
  }

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput 
          className="search-input"
          value={value} 
          onChange={(event) => setValue(event.target.value)}
          disabled={!ready}
          placeholder="Enter an address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {
              status === "OK" && data.map(({place_id, description}) => ( // data is an array of location descriptions
                <ComboboxOption key={place_id} value={description} />
              ))
            }
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}