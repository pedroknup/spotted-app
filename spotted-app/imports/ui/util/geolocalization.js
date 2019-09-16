export const calculateDistanceBetweenTwoCoords = (lat1, lon1, lat2, lon2) => {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  const distance = 12742 * Math.asin(Math.sqrt(a));
//   alert("lat1: " + lat1);
//   alert("lon1: " + lon1);
//   alert("lat2: " + lat2);
//   alert("lon2: " + lon2);
  return distance
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const simplifyDistance = distance => {
  if (distance <= 5) {
    // alert("<=5" + distance);
    return "Less than 5km";
  } else if (distance <= 10) return "Less than 10km";
  else if (distance <= 15) return "Less than 15km";
  else if (distance <= 20) return "Less than 20km";
  else if (distance <= 25) return "Less than 25km";
  else if (distance <= 50) return "Less than 50km";
  else if (distance <= 75) return "Less than 75km";
  else if (distance <= 100) return "Less than 100km";
  else if (distance <= 250) return "Less than 250km";
  else if (distance <= 500) return "Less than 500km";

//   alert(distance);
  return "More than 500km";
};
