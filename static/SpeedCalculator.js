
function updateStorage(key, value) {
    localStorage[key] = value
}

let speed = 0
let previousPosition = null
let previousTime = null

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const currentTime = new Date().getTime();

            if (previousPosition && previousTime) {
                const distance = getDistance(
                    previousPosition.coords.latitude,
                    previousPosition.coords.longitude,
                    position.coords.latitude,
                    position.coords.longitude,
                );

                const timeDifference =
                    (currentTime - previousTime) / 1000; // Time in seconds
                speed = (distance / timeDifference) * 2.23694; // Convert m/s to mph
                updateStorage("speed", speed)
            }

            previousPosition = position;
            previousTime = currentTime;
        },
        (error) => {
            console.error("Error getting position:", error);
        },
        {
            enableHighAccuracy: true,
        },
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // In meters
    return distance;
}