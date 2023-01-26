function SaveToLocalStorageByName(city){
    let favorites = GetLocalStorage();
    let sameCity = false;

    favorites.forEach(cityName => {
        if(cityName === city) { sameCity = true; } 
    });

    if(sameCity === false) {
        favorites.push(city);
        localStorage.setItem('Favorites', JSON.stringify(favorites));
    }  
}

function GetLocalStorage(){
    let localStorageData = localStorage.getItem('Favorites');

    if(localStorageData == null){
        return [];
    }

    return JSON.parse(localStorageData);
}

function RemoveFromLocalStorage(city){
    let favorites = GetLocalStorage();

    let cityIndex = favorites.indexOf(city);

    favorites.splice(cityIndex, 1);

    localStorage.setItem('Favorites', JSON.stringify(favorites));
}

export { SaveToLocalStorageByName, GetLocalStorage, RemoveFromLocalStorage };