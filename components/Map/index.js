import L from 'leaflet';
import style from './map.module.scss';
import { useQuery } from 'react-query';
import fb from '../../utils/firebase-config';

const Map = () => {
  const db = fb.firestore();

  const [map, setMap] = React.useState();
  const [isMapAdded, setIsMapAdded] = React.useState(false);
  const [isSpotAdded, setIsSpotAdded] = React.useState(false);
  const getBoarLocations = async () => {
    setIsSpotAdded(false);
    const response = await db.collection('boarLocations').get();
    const arr = [];
    response.forEach((doc) => {
      arr.push(doc.data());
    });
    return arr;
  };
  const { isLoading, isError, data, error } = useQuery(
    'boarLocations',
    getBoarLocations
  );
  React.useLayoutEffect(() => {
    const isMapInitialized = L.DomUtil.get('map');

    if (isMapInitialized === null) {
      setMap(L.map('mapid', { center: [51.9194, 19.1451], zoom: 7 }));
    }
  }, []);
  React.useEffect(() => {
    if (!isMapAdded && map) {
      setIsMapAdded(true);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      map.invalidateSize();
    }
  }, [map]);
  React.useEffect(() => {
    if (data && !isSpotAdded) {
      data.forEach((item) => {
        const lat = item.lat;
        const long = item.long;
        L.circle([lat, long], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 500,
        }).addTo(map);
        setIsSpotAdded(true);
      });
    }
  }, [data, isSpotAdded]);

  return (
    <div className={style.container}>
      {console.log(data, isSpotAdded)}
      <div
        id="mapid"
        style={{
          height: '100%',
          width: '100%',
        }}
        className={style.map}
      ></div>
    </div>
  );
};
export default Map;
