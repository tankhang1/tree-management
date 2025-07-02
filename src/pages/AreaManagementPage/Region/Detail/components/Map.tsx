import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Pane, Marker } from "react-leaflet";
import type { GeoJsonObject, Feature, Point } from "geojson";
import ZoomListener from "./ZoomListener";

interface LayerConfig {
  key: string;
  color?: string;
  fill?: boolean;
  point?: boolean;
  label: string;
}

const LAYERS: LayerConfig[] = [
  { key: "zone", color: "#2b8cbe", fill: true, label: "Vùng" },
  { key: "area", color: "#f03b20", fill: true, label: "Khu vực" },
  { key: "plot", color: "#31a354", fill: true, label: "Lô" },
  { key: "row", color: "#ffff", fill: false, label: "Hàng" },
];

const MapBox = () => {
  const [data, setData] = useState<Record<string, GeoJsonObject>>({});
  const [plantFeatures, setPlantFeatures] = useState<Feature<Point>[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    zone: false,
    area: true,
    plot: false,
    row: false,
    plant: false,
  });
  const onZoomChange = (value: number) => {
    if (value === 17) {
      setVisibleLayers({
        zone: true,
        area: false,
        plot: false,
        row: false,
        plant: false,
      });
      return;
    }
    if (value === 18) {
      setVisibleLayers({
        zone: false,
        area: true,
        plot: false,
        row: false,
        plant: false,
      });
      return;
    }
    if (value === 19) {
      setVisibleLayers({
        zone: false,
        area: false,
        plot: true,
        row: false,
        plant: false,
      });
      return;
    }
    setVisibleLayers({
      zone: false,
      area: false,
      plot: false,
      row: false,
      plant: true,
    });
    setTimeout(() => {
      setVisibleLayers({
        zone: false,
        area: false,
        plot: true,
        row: true,
        plant: true,
      });
    }, 100);
  };
  useEffect(() => {
    Promise.all(
      [...LAYERS, { key: "plant", label: "Tree" }].map((layer) =>
        fetch(`/${layer.key}.geojson`).then((res) => res.json())
      )
    ).then((results) => {
      const all: Record<string, GeoJsonObject> = {};
      LAYERS.forEach((layer, index) => {
        all[layer.key] = results[index];
      });
      setData(all);
      const plantGeo = results[LAYERS.length] as GeoJsonObject;
      if (plantGeo && "features" in plantGeo) {
        //@ts-expect-error no check
        setPlantFeatures(plantGeo.features);
      }
    });
  }, []);
  return (
    <MapContainer
      preferCanvas
      center={[11.553203605968022, 107.12999664743181]}
      maxZoom={20}
      zoom={18}
      zoomControl={false}
      zoomSnap={1}
      minZoom={17}
      boxZoom={false}
      style={{ height: "100dvh", width: "100dvw" }}
    >
      <ZoomListener onChange={onZoomChange} />
      <TileLayer
        attribution='Tiles &copy; <a href="https://www.esri.com/">Yis</a> & contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {LAYERS.map(
        ({ key, color, fill, label }) =>
          visibleLayers[key] &&
          data[key] && (
            <Pane
              key={key}
              name={key}
              style={visibleLayers.plant ? { zIndex: 100 } : {}}
            >
              <GeoJSON
                data={data[key]}
                style={() => ({
                  color,
                  weight: 2,
                  fillOpacity: fill ? 0.2 : 0,
                  fillColor: color,
                  dashArray: key === "row" ? "4" : undefined,
                })}
                onEachFeature={(feature: Feature, layer) => {
                  const props = feature.properties || {};
                  const content = `<b>${label}:</b> ${props.name || "N/A"}`;

                  layer.bindPopup(content);
                }}
              />

              {
                //@ts-expect-error no check
                data[key].features.map((feature: Feature) => {
                  //@ts-expect-error no check
                  const { center, properties } = feature;
                  if (!center) return null;
                  //@ts-expect-error no check
                  const icon = L.divIcon({
                    className: "text-label",
                    html: `<div style="color: #fff;font-size:16px; font-weight: bold;">${
                      properties?.name || ""
                    }</div>`,
                  });

                  return (
                    <Marker
                      key={properties?.id}
                      position={[center[1], center[0]]} // [lat, lng]
                      icon={icon}
                    />
                  );
                })
              }
            </Pane>
          )
      )}

      {visibleLayers.plant && plantFeatures?.length > 0 && (
        <Pane name="plant" style={{ zIndex: 999 }}>
          <GeoJSON
            key="plant-layer"
            data={{
              type: "FeatureCollection",
              // @ts-expect-error no check
              features: plantFeatures as Feature[],
            }}
            pointToLayer={(feature, latlng) => {
              const name = feature.properties?.name || "";
              let color = "#3388ff";
              if (name.includes("Ri6")) color = "#f03b20";
              else if (name.includes("Musang")) color = "#31a354";
              //@ts-expect-error no check
              return L.circleMarker(latlng, {
                radius: 4,
                color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 1,
                interactive: true,
              });
            }}
            onEachFeature={async (_, layer) => {
              layer.on("click", async () => {
                layer.bindPopup("<b>Đang tải thông tin cây...</b>").openPopup();
              });
            }}
          />
        </Pane>
      )}
    </MapContainer>
  );
};
export default MapBox;
