import {
  Stack,
  Card,
  Group,
  Text,
  Title,
  Divider,
  Badge,
  SegmentedControl,
  Autocomplete,
  ScrollAreaAutosize,
  Menu,
  ThemeIcon,
  Tooltip,
  ActionIcon,
  Select,
  Button,
  Accordion,
} from "@mantine/core";
import { useState } from "react";

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
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import { IconExchange, IconSearch, IconTree } from "@tabler/icons-react";

type GPS = { lat: number; lng: number };

type TreeInfo = {
  type: string;
  variety: string;
  seed: string;
};

type ConfirmPlantingProps = {
  area: string;
  zone: string;
  block: string;
  row?: string;
  plantingDate?: string;
  farmingMethod: string;
  irrigation: string;
  tree: TreeInfo;
  locations: GPS[];
  imageUrls: string[];
  type: number;
};
export const treeDataList = [
  {
    type: "Sầu riêng",
    variety: "Ri6",
    seed: "Hạt giống F1",
    locations: [
      [10.762622, 106.660172],
      [10.7628, 106.6603],
      [10.76295, 106.66005],
      [10.76272, 106.6599],
    ],
  },
  {
    type: "Xoài",
    variety: "Cát Chu",
    seed: "Hạt giống lai",
    locations: [
      [10.7635, 106.661],
      [10.7637, 106.6612],
      [10.7638, 106.6609],
      [10.7636, 106.6607],
    ],
  },
  {
    type: "Chôm chôm",
    variety: "Java",
    seed: "Hạt giống sạch",
    locations: [
      [10.761, 106.662],
      [10.7612, 106.6622],
      [10.7613, 106.6619],
      [10.7611, 106.6617],
    ],
  },
];

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
const ConfirmStep = ({
  area,
  zone,
  block,
  row,
  plantingDate,
}: ConfirmPlantingProps) => {
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);

  const [trees, setTrees] = useState<Tree[]>([
    {
      id: "T01",
      code: "Cây-001",
      plantedAt: "2023-01-01",
      species: "Cây sầu riêng Ri6",
      status: "alive",
      gps: [107.1301, 11.5562],
    },
    {
      id: "T02",
      code: "Cây-002",
      plantedAt: "2023-01-10",
      species: "Cây sầu riêng Ri6",
      status: "alive",
      gps: [107.1302, 11.5562],
    },
    {
      id: "T03",
      code: "Cây-003",
      plantedAt: "2023-01-20",
      species: "Cây sầu riêng Ri6",
      status: "alive",
      gps: [107.1303, 11.5562],
    },
    {
      id: "T04",
      code: "Cây-004",
      plantedAt: "2023-02-01",
      species: "Cây sầu riêng Ri6",
      status: "alive",
      gps: [107.1304, 11.5562],
    },
    {
      id: "T05",
      code: "Cây-005",
      plantedAt: "2023-02-10",
      species: "Cây xoài cát",
      status: "dead",
      gps: [107.1305, 11.5562],
    },
    {
      id: "T06",
      code: "Cây-006",
      plantedAt: "2023-02-20",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1306, 11.5562],
    },
    {
      id: "T07",
      code: "Cây-007",
      plantedAt: "2023-03-01",
      species: "Cây xoài cát",
      status: "removed",
      gps: [107.1307, 11.5562],
    },
    {
      id: "T08",
      code: "Cây-008",
      plantedAt: "2023-03-10",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1308, 11.5562],
    },
    {
      id: "T09",
      code: "Cây-009",
      plantedAt: "2023-03-20",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1309, 11.5562],
    },
    {
      id: "T10",
      code: "Cây-010",
      plantedAt: "2023-04-01",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.131, 11.5562],
    },
    {
      id: "T11",
      code: "Cây-011",
      plantedAt: "2023-04-10",
      species: "Cây xoài cát",
      status: "dead",
      gps: [107.1311, 11.5562],
    },
    {
      id: "T12",
      code: "Cây-012",
      plantedAt: "2023-04-20",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1312, 11.5562],
    },
    {
      id: "T13",
      code: "Cây-013",
      plantedAt: "2023-05-01",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1313, 11.5562],
    },
    {
      id: "T14",
      code: "Cây-014",
      plantedAt: "2023-05-10",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1314, 11.5562],
    },
    {
      id: "T15",
      code: "Cây-015",
      plantedAt: "2023-05-20",
      species: "Cây xoài cát",
      status: "removed",
      gps: [107.1315, 11.5562],
    },
    {
      id: "T16",
      code: "Cây-016",
      plantedAt: "2023-06-01",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1316, 11.5562],
    },
    {
      id: "T17",
      code: "Cây-017",
      plantedAt: "2023-06-10",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1317, 11.5562],
    },
    {
      id: "T18",
      code: "Cây-018",
      plantedAt: "2023-06-20",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1318, 11.5562],
    },
    {
      id: "T19",
      code: "Cây-019",
      plantedAt: "2023-07-01",
      species: "Cây xoài cát",
      status: "alive",
      gps: [107.1319, 11.5562],
    },
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  const [selectedCrop, setSelectedCrop] = useState<string>("Cây sầu riêng Ri6");
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = trees.findIndex((t) => t.id === active.id);
      const newIndex = trees.findIndex((t) => t.id === over?.id);
      setTrees(arrayMove(trees, oldIndex, newIndex));
    }
  };
  const position: [number, number] = [trees[0].gps[1], trees[0].gps[0]]; // [lat, lng]
  const rowPoints: [number, number][] = trees
    .filter((item) => item.species === selectedCrop)
    .map((t) => [t.gps[1], t.gps[0]]);

  return (
    <Stack gap="xl" mt={"md"}>
      <Title order={3}>Xác nhận thông tin trồng cây</Title>
      <Card withBorder radius="md" shadow="xs" p="md">
        <Group grow align="flex-start" justify="space-between">
          <Group align="flex-start" grow>
            <Stack gap="xs" flex={1}>
              <Group justify="apart">
                <Text fw={500}>Vùng trồng:</Text>
                <Badge>{area}</Badge>
              </Group>
              <Group justify="apart">
                <Text fw={500}>Khu vực:</Text>
                <Badge>{zone}</Badge>
              </Group>
              <Group justify="apart">
                <Text fw={500}>Lô:</Text>
                <Badge>{block}</Badge>
              </Group>
              {row && (
                <Group justify="apart">
                  <Text fw={500}>Hàng:</Text>
                  <Badge>{row}</Badge>
                </Group>
              )}
              {plantingDate && (
                <Group justify="apart">
                  <Text fw={500}>Ngày trồng:</Text>
                  <Text>{plantingDate}</Text>
                </Group>
              )}
            </Stack>
          </Group>
        </Group>
      </Card>
      <Divider label="Danh sách cây trồng" labelPosition="center" />

      <Accordion variant="contained" radius={4}>
        <Accordion.Item value="tree-list-1">
          <Accordion.Control>
            <Text fw={"bold"}>Hàng 1</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <SegmentedControl
                data={["Cây sầu riêng Ri6", "Cây xoài cát"]}
                value={selectedCrop}
                onChange={setSelectedCrop}
                fullWidth
                size="md"
                radius={4}
              />
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
                      items={trees
                        .filter((item) => item.species === selectedCrop)
                        .map((t) => t.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <ScrollAreaAutosize mah={300}>
                        <Stack justify="center" mt="xl">
                          {trees
                            .filter((item) => item.species === selectedCrop)
                            .map((tree, index) => (
                              <SortableItem key={tree.id} id={tree.id}>
                                <Group
                                  justify="space-between"
                                  gap={"xs"}
                                  pr="md"
                                >
                                  <Group gap={"xs"}>
                                    <Text>{index}.</Text>
                                    <Tooltip label={tree.code}>
                                      <ThemeIcon
                                        size={50}
                                        radius="xl"
                                        color={
                                          selectedTreeId === tree.id
                                            ? "blue"
                                            : "gray"
                                        }
                                      >
                                        <IconTree />
                                      </ThemeIcon>
                                    </Tooltip>
                                    <Stack gap={0}>
                                      <Text fw={"bold"}>{tree.code}</Text>
                                      <Text c={"gray"}>{tree.species}</Text>
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
                                        onPointerDown={(e) =>
                                          e.stopPropagation()
                                        }
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
                                          placeholder="Cây trồng"
                                          label="Cây trồng"
                                          data={trees.map((tree) => tree.code)}
                                          radius={4}
                                          searchable
                                          scrollAreaProps={{ mah: 300 }}
                                        />
                                        <Button
                                          variant="outline"
                                          fullWidth
                                          radius={4}
                                        >
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
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <Polyline positions={rowPoints} color="blue" />
                  {trees
                    .filter((item) => item.species === selectedCrop)
                    .map((tree, index) => {
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
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="tree-list-2">
          <Accordion.Control>
            <Text fw={"bold"}>Hàng 2</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <SegmentedControl
                data={["Cây sầu riêng Ri6", "Cây xoài cát"]}
                value={selectedCrop}
                onChange={setSelectedCrop}
                fullWidth
                size="md"
                radius={4}
              />
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
                      items={trees
                        .filter((item) => item.species === selectedCrop)
                        .map((t) => t.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <ScrollAreaAutosize mah={300}>
                        <Stack justify="center" mt="xl">
                          {trees
                            .filter((item) => item.species === selectedCrop)
                            .map((tree, index) => (
                              <SortableItem key={tree.id} id={tree.id}>
                                <Group
                                  justify="space-between"
                                  gap={"xs"}
                                  pr="md"
                                >
                                  <Group gap={"xs"}>
                                    <Text>{index}.</Text>
                                    <Tooltip label={tree.code}>
                                      <ThemeIcon
                                        size={50}
                                        radius="xl"
                                        color={
                                          selectedTreeId === tree.id
                                            ? "blue"
                                            : "gray"
                                        }
                                      >
                                        <IconTree />
                                      </ThemeIcon>
                                    </Tooltip>
                                    <Stack gap={0}>
                                      <Text fw={"bold"}>{tree.code}</Text>
                                      <Text c={"gray"}>{tree.species}</Text>
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
                                        onPointerDown={(e) =>
                                          e.stopPropagation()
                                        }
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
                                          placeholder="Cây trồng"
                                          label="Cây trồng"
                                          data={trees.map((tree) => tree.code)}
                                          radius={4}
                                          searchable
                                          scrollAreaProps={{ mah: 300 }}
                                        />
                                        <Button
                                          variant="outline"
                                          fullWidth
                                          radius={4}
                                        >
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
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <Polyline positions={rowPoints} color="blue" />
                  {trees
                    .filter((item) => item.species === selectedCrop)
                    .map((tree, index) => {
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
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default ConfirmStep;
