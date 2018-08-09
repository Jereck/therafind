// Select items from the DOM

const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
const menuBranding = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');

// Set Initial State of Menu
let showMenu = false;

menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
    if (!showMenu){
        menuBtn.classList.add('close');
        menu.classList.add('show');
        menuNav.classList.add('show');
        menuBranding.classList.add('show');
        navItems.forEach(item => item.classList.add('show'));

        // Reset Menu State
        showMenu = true;
    } else {
        menuBtn.classList.remove('close');
        menu.classList.remove('show');
        menuNav.classList.remove('show');
        menuBranding.classList.remove('show');
        navItems.forEach(item => item.classList.remove('show'));

        // Reset Menu State
        showMenu = false;
    }
}

window.onload = () => {
    var geocoder = new google.maps.Geocoder
    var output = document.getElementById("search-input");

    if(!navigator.geolocation) {
        output.placeholder = "Enter your location";
        return;
    }

    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        codeLatLng(latitude, longitude);
    }

    function error() {
        output.placeholder = "Unable to retrieve your location";
    }

    function codeLatLng(lat, lng) {
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    for (var i = 0; i < results[0].address_components.length; i++) {
                        for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                            if (results[0].address_components[i].types[b] == "locality") {
                                //this is the object you are looking for
                                city= results[0].address_components[i];
                                output.value= city.long_name;
                                break;
                            }
                        }
                    }
                } else {
                    alert("No results found");
                }
            } else {
                alert("Geocoder failed due to: " + status);
            }
        });
    }  
    navigator.geolocation.getCurrentPosition(success, error);
}