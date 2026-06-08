// =====================
// 新発田市観光マップ
// =====================

// =====================
// 地図初期化
// =====================

// 新発田駅付近を初期表示
const map = L.map('map').setView(
[37.9495, 139.3270],
14
);

// =====================
// OpenStreetMap
// =====================

L.tileLayer(

```
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

{
    attribution:
    '&copy; OpenStreetMap contributors'
}
```

).addTo(map);

// =====================
// HTML要素取得
// =====================

const speedText =
document.getElementById("speed");

const distanceText =
document.getElementById("distance");

const latitudeText =
document.getElementById("latitude");

const longitudeText =
document.getElementById("longitude");

const accuracyText =
document.getElementById("accuracy");

const followBtn =
document.getElementById("followBtn");

const resetBtn =
document.getElementById("resetBtn");

const toggleGpsBtn =
document.getElementById("toggleGpsBtn");

const gpsData =
document.getElementById("gpsData");

// =====================
// 現在地アイコン
// =====================

const gpsIcon = L.icon({

```
iconUrl: 'location.png',

iconSize: [40, 40],

iconAnchor: [20, 20]
```

});

// =====================
// 状態管理
// =====================

let followMode = true;

let gpsVisible = true;

let marker = null;

let path = [];

let totalDistance = 0;

let previousLat = null;

let previousLng = null;

// =====================
// 移動経路
// =====================

let polyline = L.polyline(path, {

```
color: 'blue',

weight: 5
```

}).addTo(map);

// =====================
// 追従ボタン
// =====================

followBtn.addEventListener(
"click",

() => {

```
followMode = !followMode;

followBtn.textContent =

followMode
? "追従: ON"
: "追従: OFF";
```

});

// =====================
// GPS表示切替
// =====================

toggleGpsBtn.addEventListener(
"click",

() => {

```
gpsVisible = !gpsVisible;

gpsData.style.display =

gpsVisible
? "block"
: "none";

toggleGpsBtn.textContent =

gpsVisible
? "GPS情報を隠す"
: "GPS情報を表示";
```

});

// =====================
// リセット
// =====================

resetBtn.addEventListener(
"click",

() => {

```
totalDistance = 0;

path = [];

polyline.setLatLngs([]);

previousLat = null;

previousLng = null;

distanceText.textContent =
"移動距離: 0 m";
```

});

// =====================
// GPS開始
// =====================

navigator.geolocation.watchPosition(

```
success,

error,

{

    enableHighAccuracy: true,

    timeout: 10000,

    maximumAge: 0
}
```

);

// =====================
// GPS成功
// =====================

function success(position) {

```
const lat =
    position.coords.latitude;

const lng =
    position.coords.longitude;

const accuracy =
    position.coords.accuracy;

let speed =
    position.coords.speed;

if(speed === null){

    speed = 0;
}

speed = (speed * 3.6).toFixed(1);

speedText.textContent =
    `速度: ${speed} km/h`;

latitudeText.textContent =
    `緯度: ${lat.toFixed(6)}`;

longitudeText.textContent =
    `経度: ${lng.toFixed(6)}`;

accuracyText.textContent =
    `精度: ${accuracy.toFixed(1)} m`;

if(followMode){

    map.setView([lat,lng],17);
}

path.push([lat,lng]);

polyline.setLatLngs(path);

if(previousLat !== null){

    totalDistance += getDistance(

        previousLat,
        previousLng,

        lat,
        lng
    );
}

previousLat = lat;
previousLng = lng;

distanceText.textContent =

totalDistance < 1000

? `移動距離: ${totalDistance.toFixed(1)} m`

: `移動距離: ${(totalDistance/1000).toFixed(2)} km`;

if(!marker){

    marker = L.marker(

        [lat,lng],

        {icon:gpsIcon}

    ).addTo(map);

} else {

    marker.setLatLng(
        [lat,lng]
    );
}
```

}

// =====================
// GPSエラー
// =====================

function error(err){

```
console.log(err);

alert(
"位置情報を取得できません"
);
```

}

// =====================
// 距離計算
// =====================

function getDistance(

lat1,
lng1,

lat2,
lng2

){

const R = 6371000;

const dLat =

(lat2-lat1)

* Math.PI/180;

const dLng =

(lng2-lng1)

* Math.PI/180;

const a =

Math.sin(dLat/2)
*
Math.sin(dLat/2)

*

Math.cos(
lat1*Math.PI/180
)

*

Math.cos(
lat2*Math.PI/180
)

*

Math.sin(dLng/2)

*

Math.sin(dLng/2);

const c =

2 * Math.atan2(

Math.sqrt(a),

Math.sqrt(1-a)

);

return R*c;

}

