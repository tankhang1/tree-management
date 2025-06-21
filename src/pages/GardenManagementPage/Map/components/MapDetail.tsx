import {
  MapContainer,
  Pane,
  TileLayer,
  GeoJSON,
  Marker,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import type { GeoJsonObject, Feature, Point } from "geojson";
import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Group,
  Input,
  MultiSelect,
  ScrollAreaAutosize,
  Select,
  Stack,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

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
type TZoomListener = {
  onChange: (value: number) => void;
};
const ZoomListener = ({ onChange }: TZoomListener) => {
  useMapEvent("zoomend", (e) => {
    onChange(e.target.getZoom());
    console.log("Zoom level changed:", e.target.getZoom());
  });

  return null;
};
const MapDetail = () => {
  const isSmall = useMediaQuery("(max-width: 48em)");
  const mapRef = useRef<LeafletMap>(null);
  const [data, setData] = useState<Record<string, GeoJsonObject>>({});
  const [plantFeatures, setPlantFeatures] = useState<Feature<Point>[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    zone: false,
    area: true,
    plot: false,
    row: false,
    plant: false,
  });
  const [area, setArea] = useState<string[] | undefined>(["Khu A", "Khu B"]);
  const [lots, setLots] = useState<string[] | undefined>(["Lô A01", "Lô B02"]);
  const [rows, setRows] = useState<string[] | undefined>([
    "Hàng A01-01",
    "Hàng B02-01",
  ]);
  const [status, setStatus] = useState<string | null>("Đã chăm sóc");
  const [plantType, setPlantType] = useState<string | null>("Sầu riêng");
  const [plantGroup, setPlantGroup] = useState<string | null>("Sầu riêng Ri6");

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
    <Stack pos={"relative"}>
      <MapContainer
        ref={mapRef}
        preferCanvas
        center={[11.553203605968022, 107.12999664743181]}
        maxZoom={20}
        zoom={18}
        minZoom={17}
        zoomControl={true}
        zoomSnap={1}
        boxZoom={false}
        style={{
          height: "calc(100dvh - 150px)",
          width: !isSmall ? "calc(100dvw - 30px)" : "calc(100dvw - 280px)",
        }}
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
                return L.circleMarker(latlng, {
                  radius: 4,
                  color,
                  fillColor: color,
                  fillOpacity: 0.8,
                  weight: 1,
                  interactive: true,
                });
              }}
            />
          </Pane>
        )}
      </MapContainer>
      <Stack
        align="flex-end"
        pos={"absolute"}
        top={10}
        right={10}
        visibleFrom="md"
        style={{ zIndex: 999 }}
      >
        <Box p="md" bg="white" style={{ borderRadius: "4px", width: 300 }}>
          <Stack>
            <ScrollAreaAutosize h={"100%"} mah={500}>
              <Stack>
                <Input.Wrapper>
                  <Input.Label>Mã cây trồng</Input.Label>
                  <Input
                    leftSection={<IconSearch size={18} />}
                    placeholder="Mã cây trồng"
                    radius={4}
                  />
                </Input.Wrapper>
                <MultiSelect
                  label="Khu vực trồng"
                  data={["Khu A", "Khu B", "Khu C"]}
                  value={area}
                  onChange={setArea}
                  searchable
                  radius={4}
                />
                <MultiSelect
                  label="Lô trồng"
                  data={["Lô A01", "Lô B02", "Lô C03"]}
                  value={lots}
                  onChange={setLots}
                  searchable
                  radius={4}
                />
                <MultiSelect
                  label="Hàng trồng"
                  data={["Hàng A01-01", "Hàng B02-01", "Hàng C03-01"]}
                  value={rows}
                  onChange={setRows}
                  searchable
                  radius={4}
                />
                <Select
                  label="Trạng thái cây trồng"
                  data={["Đã chăm sóc", "Chưa chăm sóc", "Đang kiểm tra"]}
                  value={status}
                  onChange={setStatus}
                  radius={4}
                />
                <Select
                  label="Loại cây trồng"
                  data={["Sầu riêng", "Mít", "Xoài"]}
                  value={plantType}
                  onChange={setPlantType}
                  radius={4}
                />
                <Select
                  label="Nhóm cây trồng"
                  data={[
                    "Sầu riêng Ri6",
                    "Sầu riêng Monthong",
                    "Sầu riêng Khác",
                  ]}
                  value={plantGroup}
                  onChange={setPlantGroup}
                  radius={4}
                />
              </Stack>
            </ScrollAreaAutosize>
            <Group gap={5}>
              <Button variant="default" radius={4} flex={1}>
                Mặc định
              </Button>
              <Button color="green" radius={4} flex={1}>
                Áp dụng
              </Button>
            </Group>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};
export default MapDetail;
