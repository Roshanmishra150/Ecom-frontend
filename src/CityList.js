// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const CityList = ({ state }) => {
//   const [cities, setCities] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//             `https://maps.googleapis.com/maps/api/place/textsearch/json?query=cities+in+states+USA&key=AIzaSyCYqARWCCfQ6cd9jJ1Kba2AmvXk_l8sWDM`
//         );
//         setCities(response.data.results);
//       } catch (error) {
//         console.error('Error retrieving city data:', error);
//       }
//     };

//     fetchData();
//   }, [state]);

//   return (
//     <div>
//       <h2>Cities in {state}:</h2>
//       <ul>
//         {cities.map(city => (
//           <li key={city.place_id}>{city.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CityList;









import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CountyList = ({ state }) => {
  const [counties, setCounties] = useState([]);

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        let url=`https://maps.googleapis.com/maps/api/place/textsearch/json?query=cities+in+states+USA&key=AIzaSyCYqARWCCfQ6cd9jJ1Kba2AmvXk_l8sWDM`;

      let res = await fetch(url);
      let data = await res.json();
      console.log("data",data);
        // setCounties(response.data);
      } catch (error) {
        console.error('Error retrieving county data:', error);
      }
    };

    fetchCounties();
  }, [state]);

  return (
    <div>
      <h2>Counties in {state}:</h2>
      <ul>
        {counties.map((county) => (
          <li key={county}>{county}</li>
        ))}
      </ul>
    </div>
  );
};

export default CountyList;

