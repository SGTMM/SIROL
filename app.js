// The target location (latitude and longitude)
const targetLat = 44.49503322584486;
const targetLng = 11.325262489434534;

let userLat, userLng, targetBearing;
const offset = -130

// Get the user's current location
window.addEventListener('load', function () {
    navigator.geolocation.getCurrentPosition(success, error);
})

function success(position) {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;

    // Calculate the bearing to the target location
    targetBearing = calculateBearing(userLat, userLng, targetLat, targetLng);

    // Handle device orientation events
    window.addEventListener('deviceorientation', handleOrientation);
}

function error() {
    alert('Unable to retrieve your location');
}

// Calculate bearing between two points
function calculateBearing(lat1, lng1, lat2, lng2) {
    const toRadians = degrees => degrees * Math.PI / 180;
    const toDegrees = radians => radians * 180 / Math.PI;

    const dLng = toRadians(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(toRadians(lat2));
    const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
        Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLng);
    let brng = toDegrees(Math.atan2(y, x));
    brng = (brng + 360) % 360; // Normalize to 0-360 degrees
    return brng;
}

function handleOrientation(event) {
    if (typeof targetBearing === 'undefined') return;

    const alpha = event.alpha; // The rotation around the z-axis (in degrees)
    const webkitCompassHeading = event.webkitCompassHeading; // For iOS
    const deviceAngle = webkitCompassHeading || alpha;

    // Adjust the needle rotation considering the device orientation
    const bearing = (targetBearing - deviceAngle + offset + 360) % 360;
    const needle = document.getElementById('needle');
    needle.style.transform = `translateX(-50%) rotate(${bearing}deg)`;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(new URL('sw.js', import.meta.url),
        { type: 'module' })
        .then(reg => console.log('service worker registered'))
        .catch(err => console.log('service worker not registered', err));
}