import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import Table from "../../../components/Table";
import { type MRT_ColumnDef } from "mantine-react-table";
import { useCallback, useMemo } from "react";
import {
  IconDatabaseExport,
  IconEye,
  IconPencil,
  IconPlus,
  IconTableImport,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { numberFormat } from "../../../hooks/numberFormat";
import { useDisclosure } from "@mantine/hooks";
type PlantingArea = {
  name: string; // Tên khu vực trồng (e.g., "Khu vực A")
  code: string; // Mã code phụ (e.g., "A")
  area: number; // Diện tích (m²)
  lots: number; // Tổng số lô
  trees: number; // Tổng số cây
  soilType: string;
  cultivationMethod: string;
  gpsCoordinates: string; // Dạng "[[lng,lat],[lng,lat],...]"
  note?: string;
};
const rawData: PlantingArea[] = [
  {
    name: "Khu vực A",
    code: "A",
    area: 1000,
    lots: 5,
    trees: 2000,
    soilType: "Đất bazan",
    cultivationMethod: "Hữu cơ",
    gpsCoordinates:
      "[[107.13,11.55],[107.14,11.55],[107.14,11.56],[107.13,11.56]]",
    note: "Địa hình dốc nhẹ",
  },
  {
    name: "Khu vực B",
    code: "B",
    area: 1000,
    lots: 5,
    trees: 2000,
    soilType: "Đất phù sa",
    cultivationMethod: "Tự nhiên",
    gpsCoordinates:
      "[[106.75,10.25],[106.76,10.25],[106.76,10.26],[106.75,10.26]]",
    note: "Có mạch nước ngầm",
  },
  {
    name: "Khu vực C",
    code: "C",
    area: 1000,
    lots: 5,
    trees: 2000,
    soilType: "Đất thịt",
    cultivationMethod: "Công nghiệp",
    gpsCoordinates:
      "[[106.3,10.35],[106.31,10.35],[106.31,10.36],[106.3,10.36]]",
    note: "Gần sông Tiền",
  },
  {
    name: "Khu vực D",
    code: "D",
    area: 1000,
    lots: 5,
    trees: 2000,
    soilType: "Đất thịt",
    cultivationMethod: "Công nghiệp",
    gpsCoordinates:
      "[[106.3,10.35],[106.31,10.35],[106.31,10.36],[106.3,10.36]]",
    note: "Gần sông Tiền",
  },
];

const GardenManagementAreaPage = () => {
  const navigate = useNavigate();
  const [openedLocation, { open: openLocaion, close: closeLocation }] =
    useDisclosure(false);
  const handleEdit = (row: PlantingArea) => {
    console.log("Editing", row);
    // open modal or form
  };

  const handleDelete = (row: PlantingArea) => {
    console.log("Deleting", row);
    // show confirmation and delete logic
  };
  const handleDetail = useCallback((row: PlantingArea) => {
    console.log("Detail", row);
    navigate(PATH.GARDEN_MANAGEMENT_AREA_DETAIL);
    // show confirmation and delete logic
  }, []);
  const columns = useMemo<MRT_ColumnDef<PlantingArea>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên Khu vực trồng",
        Cell: ({ row }) => (
          <Stack gap={2}>
            <Text>{row.original.name}</Text>
            <Text style={{ fontSize: 12, color: "#999" }}>
              {row.original.code}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "area",
        header: "Diện tích (m²)",
        Cell: ({ row }) => <Text>{numberFormat(row.original.area)}</Text>,
      },
      {
        accessorKey: "lots",
        header: "Tổng số lô",
        Cell: ({ row }) => <Text>{numberFormat(row.original.lots)}</Text>,
      },
      {
        accessorKey: "trees",
        header: "Tổng số cây",
        Cell: ({ row }) => <Text>{numberFormat(row.original.trees)}</Text>,
      },
      {
        accessorKey: "soilType",
        header: "Loại đất",
      },
      {
        accessorKey: "cultivationMethod",
        header: "PP Canh tác",
      },
      {
        accessorKey: "gpsCoordinates",
        header: "Toạ độ GPS",
        Cell: ({ row }) => (
          <Text lineClamp={1} title={row.original.gpsCoordinates}>
            {row.original.gpsCoordinates}
          </Text>
        ),
      },
      {
        accessorKey: "note",
        header: "Ghi chú",
        Cell: ({ row }) => (
          <Text lineClamp={1} title={row.original.note}>
            {row.original.note}
          </Text>
        ),
      },
      {
        id: "actions", // required when no accessorKey
        header: "",
        size: 120,
        enableColumnActions: false, // ✅ disables vertical dots menu
        enableColumnOrdering: false, // ✅ disables drag-reorder
        enableColumnResizing: false, // optional: disables resize handle
        enableHiding: false,
        Cell: ({ row }) => (
          <Group gap="xs">
            <Tooltip label="Chi tiết">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => handleDetail(row.original)}
              >
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Chỉnh sửa">
              <ActionIcon
                variant="subtle"
                color="green"
                onClick={() => handleEdit(row.original)}
              >
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Xóa">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDelete(row.original)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    [handleDetail]
  );
  return (
    <>
      <Stack w={"100%"}>
        <Group justify="space-between">
          <Text fz={"h3"} fw={"bold"}>
            Quản lý khu vực trồng
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
            <Button variant="transparent" bd={"none"} onClick={openLocaion}>
              <Group align="center" gap={4}>
                <IconPlus size={18} />
                <Text>Thêm mới</Text>
              </Group>
            </Button>
          </Group>
        </Group>
        <Group>
          <Select
            placeholder="Tất cả trạng thái"
            radius={4}
            data={["Vụ 1", "Vụ 2"]}
          />
        </Group>
        <Table columns={columns} data={rawData} />
      </Stack>
      <Modal
        opened={openedLocation}
        onClose={closeLocation}
        title="Vị trí GPS"
        size="lg"
        centered
      >
        <Stack bg={"white"}>
          <Text>121231233</Text>
        </Stack>
      </Modal>
    </>
  );
};

export default GardenManagementAreaPage;
