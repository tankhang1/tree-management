import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddSeasonForm from "./components/AddSeasonForm";
type CropSeason = {
  id: string;
  name: string;
  estimatedDuration: number; // in days
  cropId: string;
  cropName: string;
  growthCycleId: string;
  growthCycleName: string;
};
const cropSeasonData: CropSeason[] = [
  {
    id: "MSV001",
    name: "Mùa vụ Hè 2025",
    estimatedDuration: 120,
    cropId: "CR001",
    cropName: "Sầu riêng Dona",
    growthCycleId: "GC001",
    growthCycleName: "Chu kỳ sinh trưởng 120 ngày",
  },
  {
    id: "MSV002",
    name: "Mùa vụ Xuân 2025",
    estimatedDuration: 90,
    cropId: "CR002",
    cropName: "Xoài Cát Chu",
    growthCycleId: "GC002",
    growthCycleName: "Chu kỳ sinh trưởng 90 ngày",
  },
];

const SeasonManagementGrowthPage = () => {
  const [
    openedAddSeasonForm,
    { open: openAddSeasonForm, close: closeAddSeasonForm },
  ] = useDisclosure(false);
  const cropSeasonColumns: MRT_ColumnDef<CropSeason>[] = [
    {
      accessorKey: "id",
      header: "Mã mùa vụ",
    },
    {
      accessorKey: "name",
      header: "Tên mùa vụ",
    },
    {
      accessorKey: "estimatedDuration",
      header: "Thời gian ước tính (ngày)",
      Cell: ({ row }) => `${row.original.estimatedDuration} ngày`,
    },
    {
      accessorKey: "cropName",
      header: "Cây trồng",
    },
    {
      accessorKey: "growthCycleName",
      header: "Chu kỳ sinh trưởng",
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
            <Menu.Item leftSection={<IconEye size={18} color="gray" />}>
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
          Quản lý nhóm cây trồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddSeasonForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={cropSeasonColumns} data={cropSeasonData} />
      <Modal
        opened={openedAddSeasonForm}
        onClose={closeAddSeasonForm}
        title={<Text fw={500}>Tạo mới mùa vụ</Text>}
      >
        <AddSeasonForm />
      </Modal>
    </Stack>
  );
};
export default SeasonManagementGrowthPage;
