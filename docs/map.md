---
title: 旅行地图
description: 在地图上标注走过的地方
---

# 旅行地图

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div id="travel-map"></div>

<script>
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('travel-map')._leaflet_id) return;

  var map = L.map('travel-map', { zoomControl: true }).setView([33, 125], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  /* 自定义图标 */
  function icon(emoji) {
    return L.divIcon({
      html: '<div class="mdx-map-pin">' + emoji + '</div>',
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -42]
    });
  }

  var places = [
    {
      lat: 35.0116, lng: 135.7681,
      emoji: '🌸',
      title: '京都',
      desc: '五月的京都，比想象中更安静。',
      url: '../blog/2026/05/28/kyoto/'
    },
    {
      lat: 27.5, lng: 120.0,
      emoji: '🌊',
      title: '海边',
      desc: '夕阳把海面染成金色，浪声是最好的白噪音。',
      url: '../note1/page3/'
    },
    {
      lat: 29.5, lng: 103.5,
      emoji: '🌿',
      title: '山间',
      desc: '清晨的山谷，薄雾如纱，一切都安静而美好。',
      url: '../note1/page1/'
    }
  ];

  places.forEach(function (p) {
    L.marker([p.lat, p.lng], { icon: icon(p.emoji) })
      .addTo(map)
      .bindPopup(
        '<div class="mdx-map-popup">' +
        '<strong>' + p.title + '</strong>' +
        '<p>' + p.desc + '</p>' +
        '<a href="' + p.url + '">阅读文章 →</a>' +
        '</div>'
      );
  });
});
</script>

!!! tip "添加新地点"
    在上面 `places` 数组里添加一个对象，填入经纬度、emoji、标题、描述和文章链接即可。
    可以在 [latlong.net](https://www.latlong.net) 查询任意地点的经纬度。
