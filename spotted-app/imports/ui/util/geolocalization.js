export const calculateDistanceBetweenTwoCoords = (lat1, lon1, lat2, lon2) => {
	var R = 6371; // km (change this constant to get miles)
  var dLat = ((lat2 - lat1) * Math.PI) / 180;
  var dLon = ((lon2 - lon1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  const meters = Math.round(d * 1000);
  alert(meters + "m");
  return meters;
};

export const simplifyDistance = distance => {
  if (distance <= 5000) return "Less than 5km";
  else if (distance <= 10000) return "Less than 10km";
  else if (distance <= 15000) return "Less than 15km";
  else if (distance <= 20000) return "Less than 20km";
  else if (distance <= 25000) return "Less than 25km";
  else if (distance <= 50000) return "Less than 50km";
  else if (distance <= 75000) return "Less than 75km";
  else if (distance <= 100000) return "Less than 100km";
  else if (distance <= 250000) return "Less than 250km";
  else if (distance <= 500000) return "Less than 500km";
  else return "More than 500km";
};
