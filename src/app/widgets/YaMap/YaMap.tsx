"use client"
import React from 'react';
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps'

export const YaMap = () => {
  const points = [
    [51.674714, 39.184752],
    [51.687758, 39.219317],
    [51.656237, 39.187692],
    [51.681341, 39.124613],
    [51.706265, 39.171727],
    [51.661026, 39.279037],
    [51.634139, 39.233274]
  ]
  const defaultState = {
    center: [51.678443, 39.227207],
    zoom: 12,
  };

  return (
    <YMaps>
      <Map defaultState={defaultState} width={'100%'} height={700}>
        {points.map((point, index) => <Placemark key={index} geometry={point} options={{
          iconLayout: "default#image",
          iconImageSize: [25, 25],
          iconImageHref: 'https://www.web-visibility.be/wp-content/uploads/Pictogramme-localisation.png',
        }}/>)}
      </Map>
    </YMaps>
  )
}