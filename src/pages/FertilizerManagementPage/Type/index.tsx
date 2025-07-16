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
import AddFertilizerForm from "./components/AddFertilizerForm";

type FertilizerType = {
  id: string;
  name: string;
  nutrientContent: string; // Hàm lượng dinh dưỡng, ví dụ: "NPK 16-16-8"
  description?: string;
};
const mockFertilizerTypes: FertilizerType[] = [
  {
    id: "FT001",
    name: "Phân NPK tổng hợp",
    nutrientContent: "NPK 16-16-8",
    description: "Phù hợp cho cây ăn trái và rau màu",
  },
  {
    id: "FT002",
    name: "Phân hữu cơ vi sinh",
    nutrientContent: "Chất hữu cơ 30%",
    description: "Tăng độ tơi xốp cho đất",
  },
  {
    id: "FT003",
    name: "Phân Urê",
    nutrientContent: "Đạm 46%",
    description: "Cung cấp đạm cho giai đoạn phát triển lá",
  },
];
const FertilizerManagementTypePage = () => {
  const [openedAddForm, { open: openAddForm, close: closeAddForm }] =
    useDisclosure(false);
  const fertilizerColumns: MRT_ColumnDef<FertilizerType>[] = [
    {
      accessorKey: "id",
      header: "Mã loại",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên phân bón",
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "nutrientContent",
      header: "Hàm lượng dinh dưỡng",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "description",
      header: "Ghi chú",
      Cell: ({ cell }) => (
        <Text>{cell.getValue<string>() || "Không có ghi chú"}</Text>
      ),
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
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý loại phân bón
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={fertilizerColumns} data={mockFertilizerTypes} />
      <Modal
        opened={openedAddForm}
        onClose={closeAddForm}
        title={<Text fw={"bold"}>Tạo mới loại phân bón</Text>}
      >
        <AddFertilizerForm onSubmit={() => {}} />
      </Modal>
    </Stack>
  );
};
export default FertilizerManagementTypePage;
