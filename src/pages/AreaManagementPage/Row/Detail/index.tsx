import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Menu,
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconArrowLeft,
  IconExchange,
  IconSearch,
  IconTree,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";

interface Tree {
  id: string;
  code: string; // Mã cây
  plantedAt: string; // Ngày trồng (ISO string)
  ageInMonths?: number; // Tuổi cây (có thể tính runtime)
  species?: string; // (tuỳ chọn) giống cây
  status?: "alive" | "dead" | "removed"; // (tuỳ chọn) trạng thái
  gps: [number, number];
}

const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {children}
    </div>
  );
};
const AreaManagementRowDetailPage = () => {
  const navigate = useNavigate();
  const [trees, setTrees] = useState<Tree[]>([
    {
      id: "T01",
      code: "Cây-001",
      plantedAt: "2023-01-01",
      species: "Sầu riêng Monthong",
      status: "alive",
      gps: [107.1301, 11.5562],
    },
    {
      id: "T02",
      code: "Cây-002",
      plantedAt: "2023-01-10",
      species: "Sầu riêng Ri6",
      status: "alive",
      gps: [107.1302, 11.5562],
    },
    {
      id: "T03",
      code: "Cây-003",
      plantedAt: "2023-01-20",
      species: "Sầu riêng Monthong",
      status: "alive",
      gps: [107.1303, 11.5562],
    },
    {
      id: "T04",
      code: "Cây-004",
      plantedAt: "2023-02-01",
      species: "Sầu riêng Ri6",
      status: "alive",
      gps: [107.1304, 11.5562],
    },
    {
      id: "T05",
      code: "Cây-005",
      plantedAt: "2023-02-10",
      species: "Xoài cát Hòa Lộc",
      status: "dead",
      gps: [107.1305, 11.5562],
    },
    {
      id: "T06",
      code: "Cây-006",
      plantedAt: "2023-02-20",
      species: "Xoài cát Chu",
      status: "alive",
      gps: [107.1306, 11.5562],
    },
    {
      id: "T07",
      code: "Cây-007",
      plantedAt: "2023-03-01",
      species: "Sầu riêng Monthong",
      status: "removed",
      gps: [107.1307, 11.5562],
    },
    {
      id: "T08",
      code: "Cây-008",
      plantedAt: "2023-03-10",
      species: "Sầu riêng Ri6",
      status: "alive",
      gps: [107.1308, 11.5562],
    },
    {
      id: "T09",
      code: "Cây-009",
      plantedAt: "2023-03-20",
      species: "Sầu riêng Monthong",
      status: "alive",
      gps: [107.1309, 11.5562],
    },
    {
      id: "T10",
      code: "Cây-010",
      plantedAt: "2023-04-01",
      species: "Xoài tượng da xanh",
      status: "alive",
      gps: [107.131, 11.5562],
    },
    {
      id: "T11",
      code: "Cây-011",
      plantedAt: "2023-04-10",
      species: "Sầu riêng Ri6",
      status: "dead",
      gps: [107.1311, 11.5562],
    },
    {
      id: "T12",
      code: "Cây-012",
      plantedAt: "2023-04-20",
      species: "Sầu riêng Monthong",
      status: "alive",
      gps: [107.1312, 11.5562],
    },
    {
      id: "T13",
      code: "Cây-013",
      plantedAt: "2023-05-01",
      species: "Sầu riêng Ri6",
      status: "alive",
      gps: [107.1313, 11.5562],
    },
    {
      id: "T14",
      code: "Cây-014",
      plantedAt: "2023-05-10",
      species: "Xoài cát Hòa Lộc",
      status: "alive",
      gps: [107.1314, 11.5562],
    },
    {
      id: "T15",
      code: "Cây-015",
      plantedAt: "2023-05-20",
      species: "Sầu riêng Monthong",
      status: "removed",
      gps: [107.1315, 11.5562],
    },
    {
      id: "T16",
      code: "Cây-016",
      plantedAt: "2023-06-01",
      species: "Sầu riêng Ri6",
      status: "alive",
      gps: [107.1316, 11.5562],
    },
    {
      id: "T17",
      code: "Cây-017",
      plantedAt: "2023-06-10",
      species: "Xoài keo",
      status: "alive",
      gps: [107.1317, 11.5562],
    },
    {
      id: "T18",
      code: "Cây-018",
      plantedAt: "2023-06-20",
      species: "Sầu riêng Monthong",
      status: "alive",
      gps: [107.1318, 11.5562],
    },
    {
      id: "T19",
      code: "Cây-019",
      plantedAt: "2023-07-01",
      species: "Sầu riêng Ri6",
      status: "alive",
      gps: [107.1319, 11.5562],
    },
    {
      id: "T20",
      code: "Cây-020",
      plantedAt: "2023-07-10",
      species: "Xoài tượng da xanh",
      status: "dead",
      gps: [107.132, 11.5562],
    },
    {
      id: "T21",
      code: "Cây-021",
      plantedAt: "2023-07-20",
      species: "Sầu riêng Monthong",
      status: "alive",
      gps: [107.1321, 11.5562],
    },
    {
      id: "T22",
      code: "Cây-022",
      plantedAt: "2023-08-01",
      species: "Sầu riêng Ri6",
      status: "alive",
      gps: [107.1322, 11.5562],
    },
    {
      id: "T23",
      code: "Cây-023",
      plantedAt: "2023-08-10",
      species: "Xoài keo",
      status: "alive",
      gps: [107.1323, 11.5562],
    },
    {
      id: "T24",
      code: "Cây-024",
      plantedAt: "2023-08-20",
      species: "Sầu riêng Monthong",
      status: "alive",
      gps: [107.1324, 11.5562],
    },
    {
      id: "T25",
      code: "Cây-025",
      plantedAt: "2023-09-01",
      species: "Sầu riêng Ri6",
      status: "alive",
      gps: [107.1325, 11.5562],
    },
  ]);

  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = trees.findIndex((t) => t.id === active.id);
      const newIndex = trees.findIndex((t) => t.id === over?.id);
      setTrees(arrayMove(trees, oldIndex, newIndex));
    }
  };
  const treeColumns: MRT_ColumnDef<Tree>[] = [
    {
      accessorKey: "code",
      header: "Mã cây",
    },
    {
      accessorKey: "plantedAt",
      header: "Ngày trồng",
      Cell: ({ row }) => dayjs(row.original.plantedAt).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "ageInMonths",
      header: "Tuổi (tháng)",
      Cell: ({ row }) => dayjs().diff(row.original.plantedAt, "month"),
    },
    {
      accessorKey: "species",
      header: "Giống cây",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ row }) => {
        const val = row.original.status;
        if (val === "alive") return "Đang phát triển";
        if (val === "dead") return "Đã chết";
        if (val === "removed") return "Đã loại bỏ";
        return "-";
      },
    },
  ];
  if (trees.length === 0) return null;

  const position: [number, number] = [trees[0].gps[1], trees[0].gps[0]]; // [lat, lng]
  const rowPoints: [number, number][] = trees.map((t) => [t.gps[1], t.gps[0]]);
  return (
    <Stack>
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>📍 Chi tiết hàng A01</Title>
      </Group>
      <Group justify="space-between" align="flex-start">
        <Stack flex={1}>
          <Text fw={"bold"} fz={"h4"}>
            Danh sách cây trồng
          </Text>
          <Autocomplete
            radius={4}
            placeholder="Tìm kiếm cây trồng"
            leftSection={<IconSearch size={18} />}
          />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={trees.map((t) => t.id)}
              strategy={horizontalListSortingStrategy}
            >
              <ScrollAreaAutosize mah={300}>
                <Stack justify="center" mt="xl">
                  {trees.map((tree, index) => (
                    <SortableItem key={tree.id} id={tree.id}>
                      <Group justify="space-between" gap={"xs"} pr="md">
                        <Group gap={"xs"}>
                          <Text>{index}.</Text>
                          <Tooltip label={tree.code}>
                            <ThemeIcon
                              size={50}
                              radius="xl"
                              color={
                                selectedTreeId === tree.id ? "blue" : "gray"
                              }
                            >
                              <IconTree />
                            </ThemeIcon>
                          </Tooltip>
                          <Stack gap={0}>
                            <Text fw={"bold"}>{tree.code}</Text>
                            <Text c={"gray"}>Cây ngô </Text>
                          </Stack>
                        </Group>
                        <Menu
                          width={200}
                          withinPortal
                          withArrow
                          position="bottom-end"
                        >
                          <Menu.Target>
                            <ActionIcon
                              onPointerDown={(e) => e.stopPropagation()}
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <IconExchange size={18} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Stack gap="xs">
                              <Select
                                searchable
                                clearable
                                placeholder="Cây trồng"
                                label="Cây trồng"
                                data={trees.map((tree) => tree.code)}
                                radius={4}
                                scrollAreaProps={{ mah: 300 }}
                              />
                              <Button variant="outline" fullWidth radius={4}>
                                Đổi
                              </Button>
                            </Stack>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </SortableItem>
                  ))}
                </Stack>
              </ScrollAreaAutosize>
            </SortableContext>
          </DndContext>
        </Stack>
        <MapContainer
          center={position}
          zoom={20}
          style={{ height: "400px", width: "80%" }}
          scrollWheelZoom={false}
          attributionControl={false}
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

          <Polyline positions={rowPoints} color="blue" />
          {trees.map((tree, index) => {
            const icon = L.divIcon({
              className: "custom-tree-point",
              html: `<div style="
      width: 14px;
      height: 14px;
      background-color: ${selectedTreeId === tree.id ? "#1c7ed6" : "#74c0fc"};
      border-radius: 4px;
      border: 1px solid #ffffff;
      box-shadow: 0 0 2px rgba(0,0,0,0.3);
    " title="${tree.code}"></div>`,
              iconSize: [14, 14],
              iconAnchor: [7, 7], // center the point
            });

            return (
              <Marker
                key={tree.id}
                draggable
                position={[tree.gps[1], tree.gps[0]]}
                icon={icon}
                eventHandlers={{
                  dragend: (e) => {
                    const latLng = e.target.getLatLng();
                    const newTrees = [...trees];
                    newTrees[index].gps = [latLng.lng, latLng.lat];
                    setTrees(newTrees);
                  },
                  click: () => setSelectedTreeId(tree.id),
                }}
              />
            );
          })}
        </MapContainer>
      </Group>
      <Table
        //@ts-expect-error no check
        columns={treeColumns}
        //@ts-expect-error no check
        data={trees}
      />
    </Stack>
  );
};
export default AreaManagementRowDetailPage;
