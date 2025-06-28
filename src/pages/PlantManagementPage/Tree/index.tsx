import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Menu,
  Stack,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconGrowth,
  IconSeedling,
  IconTractor,
  IconTrash,
} from "@tabler/icons-react";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type TreeCrop = {
  id: string;
  name: string;
  seedType: string; // chọn II.2
  harvestMethod: string; // chọn II.5
  growthCycle: string; // chọn II.4
  note?: string;
};
const treeCropData: TreeCrop[] = [
  {
    id: "TREE001",
    name: "Sầu riêng",
    seedType: "Hạt lai F1",
    harvestMethod: "Thu hoạch thủ công",
    growthCycle: "Chu kỳ dài (5-7 năm)",
    note: "Yêu cầu đất thịt và thoát nước tốt",
  },
  {
    id: "TREE002",
    name: "Xoài",
    seedType: "Ghép cành",
    harvestMethod: "Thu hoạch bằng sào",
    growthCycle: "Chu kỳ trung bình (3-5 năm)",
    note: "",
  },
  {
    id: "TREE003",
    name: "Chuối",
    seedType: "Chồi cây",
    harvestMethod: "Thu hoạch cuống",
    growthCycle: "Chu kỳ ngắn (9-12 tháng)",
  },
];

const PlantManagementTreePage = () => {
  const navigate = useNavigate();
  const onAddTree = () => {
    navigate(PATH.PLANT_ADD_TREE);
  };
  const onTreeDetail = () => {
    navigate(PATH.PLANT_TREE_DETAIL);
  };
  const treeCropColumns: MRT_ColumnDef<TreeCrop>[] = [
    { accessorKey: "id", header: "Mã cây" },
    { accessorKey: "name", header: "Tên cây" },
    { accessorKey: "seedType", header: "Hạt giống" },
    { accessorKey: "harvestMethod", header: "Hình thức thu hoạch" },
    { accessorKey: "growthCycle", header: "Chu kỳ sinh trưởng" },
    {
      accessorKey: "note",
      header: "Ghi chú",
      Cell: ({ row }) => row.original.note || "—",
    },
    {
      accessorKey: "actions",
      header: "",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onTreeDetail}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Quản lý cây trồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddTree}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Autocomplete
          radius={4}
          leftSection={<IconSeedling size={18} />}
          placeholder="Hạt giống"
          data={["Thu hoạch thủ công"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconTractor size={18} />}
          placeholder="Hình thức thu hoạch"
          data={["	Thu hoạch thủ công"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconGrowth size={18} />}
          placeholder="Chu kì sinh trưởng"
          data={["	Thu hoạch thủ công"]}
        />
      </Group>
      <Table columns={treeCropColumns} data={treeCropData} />
    </Stack>
  );
};

export default PlantManagementTreePage;
