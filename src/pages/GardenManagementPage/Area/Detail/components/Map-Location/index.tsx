import { Stack } from "@mantine/core";
import { MapContainer, TileLayer } from "react-leaflet";

const MapLocation = () => {
  return (
    <Stack pos={"relative"}>
      <MapContainer
        center={[11.553203605968022, 107.12999664743181]}
        zoom={18}
        minZoom={17}
        maxZoom={20}
        zoomControl={true}
        preferCanvas={true}
        style={{
          width: "calc(100dvw - 260px)",
          height: "calc(100dvh - 200px)", // phải có dòng này!
        }}
      >
        <TileLayer
          attribution='Tiles &copy; <a href="https://www.esri.com/">Yis</a> & contributors'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      </MapContainer>
    </Stack>
  );
};

export default MapLocation;
