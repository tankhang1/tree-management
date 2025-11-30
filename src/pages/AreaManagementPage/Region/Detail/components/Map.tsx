import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Pane, Marker } from "react-leaflet";
import type { GeoJsonObject, Feature, Point } from "geojson";
import ZoomListener from "./ZoomListener";
import type { Map } from "leaflet";
const crops = [
  "Sầu riêng Ri6",
  "Sầu riêng Musang King",
  "Sầu riêng Dona",
  "Cà phê Robusta",
  "Cà phê Arabica",
  "Tiêu Vĩnh Linh",
];

const cultivationTypes = [
  "Hữu cơ",
  "Bán hữu cơ",
  "Theo VietGAP",
  "Theo GlobalGAP",
];

const soilTypes = ["Đất đỏ bazan", "Đất pha cát", "Đất thịt nhẹ", "Đất phù sa"];

const terrains = ["Bằng phẳng", "Dốc nhẹ", "Dốc vừa", "Thoai thoải"];

const treeStatusList = [
  "Tốt",
  "Đang phục hồi",
  "Cần kiểm tra",
  "Đang ra hoa",
  "Đang mang trái",
];
interface LayerConfig {
  key: string;
  color?: string;
  fill?: boolean;
  point?: boolean;
  label: string;
}
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const formatArea = (min: number, max: number) => {
  const value = randomInt(min, max) * 100;
  return value.toLocaleString("vi-VN") + " m²";
};
const randomItem = <T,>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

const randomDateString = () => {
  const now = new Date();
  const daysAgo = randomInt(1, 30);
  const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("vi-VN");
};

const LAYERS: LayerConfig[] = [
  { key: "zone", color: "#2b8cbe", fill: true, label: "Vùng" },
  { key: "area", color: "#f03b20", fill: true, label: "Khu vực" },
  { key: "plot", color: "#31a354", fill: true, label: "Lô" },
  { key: "row", color: "#ffff", fill: false, label: "Hàng" },
];
type TMapBox = {
  h?: number;
  zoom?: number;
  zone?: boolean;
  area?: boolean;
  plot?: boolean;
  row?: boolean;
  plant?: boolean;
  marker?: boolean;
};
const MapBox = ({
  h = 400,
  zoom = 15,
  zone = false,
  area = false,
  plot = false,
  row = false,
  plant = false,
  marker = false,
}: TMapBox) => {
  const mapRef = useRef<Map | null>(null);
  const [data, setData] = useState<Record<string, GeoJsonObject>>({});
  const [plantFeatures, setPlantFeatures] = useState<Feature<Point>[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    zone: zone,
    area: area,
    plot: plot,
    row: row,
    plant: plant,
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
      // maxZoom={22}
      attributionControl={false}
      zoom={zoom}
      scrollWheelZoom={true}
      zoomControl={true}
      minZoom={17}
      maxZoom={22}
      style={{ height: `${h}px`, width: "auto", borderRadius: 4 }}
    >
      <ZoomListener onChange={onZoomChange} />
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      {marker && <Marker position={[11.553203605968022, 107.12999664743181]} />}
      {LAYERS.map(
        ({ key, color, fill }) =>
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
                onEachFeature={(feature, layer) => {
                  const props: any = feature.properties || {};
                  const name =
                    props.name || `${key.toUpperCase()}-${randomInt(1, 50)}`;
                  const code = props.code || `Mã-${randomInt(100, 999)}`;
                  const crop = randomItem(crops);
                  const cultivation = randomItem(cultivationTypes);
                  const soil = randomItem(soilTypes);
                  const terrain = randomItem(terrains);
                  const elevation = randomInt(400, 650);
                  const treeCount =
                    key === "zone"
                      ? randomInt(800, 2000)
                      : key === "area"
                      ? randomInt(300, 800)
                      : key === "plot"
                      ? randomInt(80, 200)
                      : randomInt(10, 60);
                  const density = randomInt(180, 280);
                  const areaText =
                    key === "zone"
                      ? formatArea(80, 150)
                      : key === "area"
                      ? formatArea(30, 60)
                      : key === "plot"
                      ? formatArea(10, 30)
                      : formatArea(2, 10);

                  const popupHtml = `
                          <div style="
                            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                            min-width: 230px;
                            padding: 10px 10px 8px 10px;
                          ">
                            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                              <div>
                                <div style="font-weight:600;font-size:14px;margin-bottom:2px;">
                                  ${name}
                                </div>
                                <div style="font-size:11px;color:#6b7280;">
                                  ${
                                    key === "zone"
                                      ? "Vùng"
                                      : key === "area"
                                      ? "Khu vực"
                                      : key === "plot"
                                      ? "Lô"
                                      : "Hàng"
                                  } · Nông trại demo
                                </div>
                              </div>
                              <div style="
                                background:#e5e7eb;
                                border-radius:999px;
                                padding:2px 10px;
                                font-size:11px;
                                font-weight:600;
                                color:#111827;
                                white-space:nowrap;
                              ">
                                ${code}
                              </div>
                            </div>

                            <div style="
                              margin-top:8px;
                              padding-top:8px;
                              border-top:1px solid #e5e7eb;
                              display:grid;
                              row-gap:4px;
                              font-size:12px;
                              color:#111827;
                            ">
                              <div><b>Diện tích:</b> ${areaText}</div>
                              <div><b>Giống chính:</b> ${crop}</div>
                              <div><b>Số cây:</b> ${treeCount.toLocaleString(
                                "vi-VN"
                              )} cây</div>
                              <div><b>Mật độ trồng:</b> ~${density} cây/ha</div>
                              <div><b>Loại đất:</b> ${soil}</div>
                              <div><b>Địa hình:</b> ${terrain} · ${elevation} m</div>
                              <div><b>Hình thức canh tác:</b> ${cultivation}</div>
                            </div>
                          </div>
                        `;

                  layer.on("click", () => {
                    if (mapRef.current) {
                      const map = mapRef.current;
                      const bounds = (layer as any).getBounds?.();
                      if (bounds) {
                        map.fitBounds(bounds, {
                          maxZoom: 19,
                          padding: [24, 24],
                        });
                      }
                    }
                    layer.bindPopup(popupHtml).openPopup();
                  });
                }}
              />

              {data?.[key] &&
                //@ts-expect-error no check
                data?.[key]?.features &&
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
                })}
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
            onEachFeature={(feature, layer) => {
              const props: any = feature.properties || {};
              const name = props.name || `Cây ${randomInt(1, 500)}`;
              const code = props.code || `CT-${randomInt(1000, 9999)}`;
              const crop = randomItem(crops);
              const age = randomInt(2, 8);
              const status = randomItem(treeStatusList);
              const lastCare = randomDateString();

              const popupHtml = `
                      <div style="
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        min-width: 180px;
                        padding: 8px 10px;
                      ">
                        <div style="font-weight:600;font-size:13px;margin-bottom:2px;">
                          ${name}
                        </div>
                        <div style="font-size:11px;color:#6b7280;margin-bottom:4px;">
                          Mã cây: ${code}
                        </div>
                        <div style="font-size:12px;color:#111827;">
                          <div><b>Giống:</b> ${crop}</div>
                          <div><b>Tuổi cây:</b> ${age} năm</div>
                          <div><b>Tình trạng:</b> ${status}</div>
                          <div><b>Chăm sóc gần nhất:</b> ${lastCare}</div>
                        </div>
                      </div>
                    `;

              layer.on("click", () => {
                layer.bindPopup(popupHtml).openPopup();
              });
            }}
          />
        </Pane>
      )}
    </MapContainer>
  );
};
export default MapBox;
