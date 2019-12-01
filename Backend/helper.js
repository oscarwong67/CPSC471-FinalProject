const geolib = require('geolib');
const moment = require('moment');

const kmPerHour = 60;
const ratePerKm = 2.5;

const calcDistanceKM = (startLat, startLng, destLat, destLng) => {
    return geolib.getDistance(
        { latitude: startLat, longitude: startLng },
        { latitude: destLat, longitude: destLng}
    ) / 1000;
}

const calcFare = (distance) => {
    return distance * ratePerKm;
}

const currentTime = () => {
    return moment(Date.now()).format('HH:mm:ss');
}

const currentDate = () => {
    return moment(Date.now()).format('YYYY-MM-DD');
}

const calcTripEnd = (distanceInKm) => {
    const tripTimeInHours = distanceInKm / kmPerHour;
    return moment(Date.now()).add(tripTimeInHours, 'hours').format('HH:mm:ss');
}

const calcNewPercentage = (chargePercentage, oldPercentage) => {
    const result = parseInt(oldPercentage, 10) + parseInt(chargePercentage, 10);
    if (result >= 100){
        return 100;
    } 
    return result;
}

module.exports = { calcDistanceKM, calcFare, currentTime, currentDate, calcTripEnd, calcNewPercentage }