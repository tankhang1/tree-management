import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMemo, useState } from "react";

type PlantTree = {
  id: string;
  name: string;
  code: string;
  batch: string;
  year: number;
  status: "Đã chăm sóc" | "Đang chăm sóc" | "Đang bị bệnh";
  age: number; // in months
  locationFile: string; // CSV filename or URL
};
const plantTreeData: PlantTree[] = [
  {
    id: "A01-02-01-MK",
    name: "Cây A01-02-01-MK",
    code: "A01-02-01-MK",
    batch: "Đợt 1",
    year: 2000,
    status: "Đã chăm sóc",
    age: 360,
    locationFile: "Import.csv",
  },
  {
    id: "A01-02-02-MK",
    name: "Cây A01-02-02-MK",
    code: "A01-02-02-MK",
    batch: "Đợt 1",
    year: 2000,
    status: "Đang chăm sóc",
    age: 360,
    locationFile: "Import.csv",
  },
  {
    id: "A01-02-03-MK",
    name: "Cây A01-02-03-MK",
    code: "A01-02-03-MK",
    batch: "Đợt 1",
    year: 2000,
    status: "Đang chăm sóc",
    age: 360,
    locationFile: "Import.csv",
  },
  {
    id: "A01-02-04-MK",
    name: "Cây A01-02-04-MK",
    code: "A01-02-04-MK",
    batch: "Đợt 1",
    year: 2000,
    status: "Đang bị bệnh",
    age: 360,
    locationFile: "Import.csv",
  },
];

import {
  IconDatabaseExport,
  IconPencil,
  IconPlus,
  IconTableImport,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import MapDetail from "./components/MapDetail";

const GardenManagementMapPage = () => {
  const [type, setType] = useState<"map" | "list" | string>("map");
  const columns = useMemo<MRT_ColumnDef<PlantTree>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên cây trồng",
        Cell: ({ row }) => (
          <Stack gap={4}>
            <Text>{row.original.name}</Text>
            <Text style={{ fontSize: 12, color: "#888" }}>
              {row.original.code}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "batch",
        header: "Đợt trồng",
        Cell: ({ row }) => (
          <Stack gap={4}>
            <Text>{row.original.batch}</Text>
            <Text style={{ fontSize: 12, color: "#888" }}>
              {row.original.year}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái cây trồng",
      },
      {
        accessorKey: "age",
        header: "Tuổi cây (Tháng)",
      },
      {
        accessorKey: "location",
        header: "Định vị",
        Cell: ({ cell }) => (
          <Anchor href="#" style={{ color: "green" }}>
            📎 {cell.getValue<string>()}
          </Anchor>
        ),
      },
      {
        id: "actions",
        header: "",
        size: 80,
        enableColumnActions: false,
        enableColumnOrdering: false,
        enableColumnResizing: false,
        enableHiding: false,
        Cell: () => (
          <Group gap="xs">
            <Tooltip label="Chỉnh sửa">
              <ActionIcon variant="subtle" color="green" onClick={() => {}}>
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Xóa">
              <ActionIcon variant="subtle" color="red" onClick={() => {}}>
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    []
  );

  return (
    <Stack>
      <Group justify="space-between">
        <Text fz={"h3"} fw={"bold"}>
          Bản đồ nông nghiệp
        </Text>
        <SegmentedControl
          defaultValue={type}
          onChange={setType}
          radius={4}
          data={[
            { label: "Bản đồ", value: "map" },
            { label: "Danh sách", value: "list" },
          ]}
        />
      </Group>
      {type === "map" && <MapDetail />}
      {type === "list" && (
        <Stack>
          <Divider />
          <Group justify="space-between">
            <Text fz={"h3"} fw={"bold"}>
              Lô trồng
            </Text>
            <Group>
              <Button variant="transparent" c={"black"} bd={"none"}>
                <Group align="center" gap={4}>
                  <IconTableImport size={18} />
                  <Text>Nhập file</Text>
                </Group>
              </Button>
              <Divider orientation="vertical" />
              <Button variant="transparent" c={"black"} bd={"none"}>
                <Group align="center" gap={4}>
                  <IconDatabaseExport size={18} />
                  <Text>Xuất file</Text>
                </Group>
              </Button>
              <Divider orientation="vertical" />
              <Button variant="transparent" bd={"none"}>
                <Group align="center" gap={4}>
                  <IconPlus size={18} />
                  <Text>Thêm mới</Text>
                </Group>
              </Button>
            </Group>
          </Group>
          <Table columns={columns} data={plantTreeData} />
        </Stack>
      )}
    </Stack>
  );
};
export default GardenManagementMapPage;
