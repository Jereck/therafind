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

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            geocode();
            
            function geocode() {
                axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}`, {
                    params: {
                        key: 'AIzaSyAgg_uxi9IJH7uwyEyH0sAUgfCqWUsznos'
                    }
                })
                .then(function(response){
                    console.log(response);

                    for (let i = 0; i < response.data.results[0].address_components.length; i++) {
                        for (let b = 0; b < response.data.results[0].address_components[i].types.length; b++){
                            if (response.data.results[0].address_components[i].types[b] == 'locality') {
                                city = response.data.results[0].address_components[i];
                                output.value = city.long_name;
                            }
                        }
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
            }
        });
    }
}