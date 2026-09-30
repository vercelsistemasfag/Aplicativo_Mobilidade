'use strict';
const places=[
{id:'bourbon',name:'Bourbon Shopping Novo Hamburgo',address:'Av. Nações Unidas, 2001 — Novo Hamburgo/RS',lat:-29.685917792,lng:-51.133966161,icon:'▦'},
{id:'estacao',name:'Estação Novo Hamburgo',address:'Av. Nações Unidas, 2040 — Novo Hamburgo/RS',lat:-29.68676,lng:-51.1329,icon:'▤'},
{id:'atacadao',name:'Atacadão Novo Hamburgo',address:'Av. Primeiro de Março, 2711 — Novo Hamburgo/RS',lat:-29.707721702,lng:-51.136446555,icon:'▱'}
];
const $=id=>document.getElementById(id);
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let map,originMarker,accuracyCircle,destinationMarker,selected=null,origin=null,picking=false,locating=false,locationRequest=0;
const status=message=>{$('location-status').textContent=message};
function initMap(){
 if(map){setTimeout(()=>map.invalidateSize(),50);return}
 if(!window.L){$('map-error').hidden=false;return}
 map=L.map('map',{zoomControl:false}).setView([-29.695,-51.134],14);
 L.control.zoom({position:'bottomleft'}).addTo(map);
 const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
 tiles.on('tileerror',()=>{$('map-error').hidden=false});
 tiles.on('tileload',()=>{$('map-error').hidden=true});
 for(const p of places){L.circleMarker([p.lat,p.lng],{radius:5,color:'#fff',weight:2,fillColor:'#244f38',fillOpacity:1}).addTo(map).bindTooltip(p.name)}
 map.on('click',e=>{if(!picking)return;picking=false;setOrigin(e.latlng.lat,e.latlng.lng,'Embarque escolhido no mapa');status('Embarque definido. Você pode escolher um destino.');$('pick-origin').textContent='Escolher embarque no mapa';$('map-label').textContent='Embarque definido'});
}
function setOrigin(lat,lng,label,accuracy){
 origin={lat,lng,label};$('origin').textContent='●  '+label;
 if(map){if(originMarker)map.removeLayer(originMarker);if(accuracyCircle)map.removeLayer(accuracyCircle);
 originMarker=L.marker([lat,lng],{icon:L.divIcon({className:'',html:'<div class="user-pin"></div>',iconSize:[20,20],iconAnchor:[10,10]})}).addTo(map).bindTooltip(label);
 if(accuracy)accuracyCircle=L.circle([lat,lng],{radius:accuracy,color:'#377bdf',weight:1,fillOpacity:.08}).addTo(map);
 map.setView([lat,lng],16)}
}
function locate(){
 if(locating)return;
 if(!window.isSecureContext){status('Para usar sua localização, abra o app por um link HTTPS.');return}
 if(!navigator.geolocation){status('Este navegador não oferece localização. Escolha o embarque no mapa.');return}
 locating=true;const request=++locationRequest;$('locate').disabled=true;status('Buscando sua localização… permita o acesso no navegador.');
 navigator.geolocation.getCurrentPosition(position=>{
 if(request!==locationRequest)return;
 locating=false;$('locate').disabled=false;picking=false;$('pick-origin').textContent='Escolher embarque no mapa';
 const {latitude,longitude,accuracy}=position.coords;
 setOrigin(latitude,longitude,'Minha localização atual',accuracy);status('Localização recebida. Precisão aproximada: '+Math.round(accuracy)+' m.');$('map-label').textContent='Sua localização';
 },error=>{if(request!==locationRequest)return;locating=false;$('locate').disabled=false;status(({1:'Acesso à localização negado. Você pode liberar nas permissões do navegador ou escolher no mapa.',2:'Localização indisponível. Verifique se a localização do celular está ativada.',3:'O celular demorou para localizar. Tente novamente em um local aberto.'})[error.code]||'Não foi possível obter sua localização.');},{enableHighAccuracy:true,timeout:15000,maximumAge:0});
}
function renderPlaces(){
 const query=normalize($('search').value);const matches=places.filter(p=>normalize(p.name+' '+p.address).includes(query));$('results').replaceChildren();
 if(!matches.length){const msg=document.createElement('p');msg.className='fine';msg.textContent='Nenhum destino encontrado. Nesta amostra, busque Bourbon, Estação ou Atacadão.';$('results').append(msg)}
 for(const p of matches){const button=document.createElement('button');button.className='place';button.innerHTML='<span class="place-icon" aria-hidden="true">'+p.icon+'</span><span><strong>'+p.name+'</strong><small>'+p.address+'</small></span><span class="arrow" aria-hidden="true">›</span>';button.onclick=()=>choose(p);$('results').append(button)}
}
function choose(p){selected=p;$('selected').hidden=false;$('destination-name').textContent=p.name;$('destination-address').textContent=p.address;$('confirmation').textContent='';
 if(map){if(destinationMarker)map.removeLayer(destinationMarker);destinationMarker=L.marker([p.lat,p.lng],{icon:L.divIcon({className:'',html:'<div class="pin"></div>',iconSize:[30,30],iconAnchor:[15,30]})}).addTo(map).bindTooltip(p.name);if(origin)map.fitBounds([[origin.lat,origin.lng],[p.lat,p.lng]],{padding:[55,55],maxZoom:16});else map.setView([p.lat,p.lng],16)}
 $('selected').scrollIntoView({behavior:'smooth',block:'nearest'});
}
$('login-form').onsubmit=e=>{e.preventDefault();const name=$('name').value.trim()||'passageiro';$('greeting').textContent='OLÁ, '+name.toLocaleUpperCase('pt-BR');$('login').hidden=true;$('passenger').hidden=false;initMap();renderPlaces();window.scrollTo(0,0)};
$('logout').onclick=()=>{locationRequest++;locating=false;$('locate').disabled=false;$('passenger').hidden=true;$('login').hidden=false;$('name').value='';origin=null;selected=null;picking=false;if(originMarker){map.removeLayer(originMarker);originMarker=null}if(accuracyCircle){map.removeLayer(accuracyCircle);accuracyCircle=null}if(destinationMarker){map.removeLayer(destinationMarker);destinationMarker=null}$('selected').hidden=true;$('search').value='';$('confirmation').textContent='';$('origin').textContent='●  Embarque ainda não definido';$('map-label').textContent='Explore a cidade';$('pick-origin').textContent='Escolher embarque no mapa';status('Ative a localização ou escolha o embarque no mapa.');if(map)map.setView([-29.695,-51.134],14);window.scrollTo(0,0)};
$('locate').onclick=locate;$('locate-map').onclick=locate;
$('pick-origin').onclick=()=>{if(!map){status('O mapa não carregou. Verifique sua conexão e recarregue a página.');return}locationRequest++;locating=false;$('locate').disabled=false;picking=!picking;$('pick-origin').textContent=picking?'Cancelar escolha no mapa':'Escolher embarque no mapa';$('map-label').textContent=picking?'Toque no ponto de embarque':'Explore a cidade';status(picking?'Toque no mapa para definir o ponto de embarque.':'Escolha como definir seu embarque.');if(picking)$('map').scrollIntoView({behavior:'smooth',block:'center'})};
$('search').oninput=renderPlaces;
$('clear').onclick=()=>{selected=null;$('selected').hidden=true;$('confirmation').textContent='';if(destinationMarker){map.removeLayer(destinationMarker);destinationMarker=null}};
$('confirm').onclick=()=>{if(!origin){$('confirmation').textContent='Defina primeiro seu embarque usando a localização ou o mapa.';return}$('confirmation').textContent='Destino confirmado: '+selected.name+'. Esta é uma demonstração; nenhuma corrida foi solicitada.'};
let installPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install').hidden=false});$('install').onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('install').hidden=true};window.addEventListener('appinstalled',()=>{$('install').hidden=true});
if('serviceWorker' in navigator&&window.isSecureContext)navigator.serviceWorker.register('./sw.js').catch(()=>{});
