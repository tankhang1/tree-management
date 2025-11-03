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
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useDisclosure } from "@mantine/hooks";
import AddGroupForm from "./components/AddGroupForm";
type CropType = {
  id: string; // Mã loại cây
  name: string; // Tên loại cây
  note: string;
};
export const cropTypes: CropType[] = [
  {
    id: "rice",
    name: "Lúa",
    note: "Cây lương thực chính tại Việt Nam, thường trồng vào vụ Đông Xuân và Hè Thu.",
  },
  {
    id: "corn",
    name: "Bắp (Ngô)",
    note: "Cây lương thực phổ biến, dễ trồng, thích hợp khí hậu ấm, năng suất cao.",
  },
  {
    id: "soybean",
    name: "Đậu nành",
    note: "Cây họ đậu ngắn ngày, giàu đạm, giúp cải tạo đất và phù hợp nhiều vùng khí hậu.",
  },
  {
    id: "cassava",
    name: "Khoai mì",
    note: "Cây dễ trồng, chịu hạn tốt, thường dùng làm nguyên liệu chế biến công nghiệp.",
  },
  {
    id: "sweet_potato",
    name: "Khoai lang",
    note: "Cây trồng ngắn ngày, thích hợp với đất cát pha, cho năng suất cao.",
  },
  {
    id: "sugarcane",
    name: "Mía",
    note: "Nguồn nguyên liệu chính cho ngành sản xuất đường.",
  },
  {
    id: "coffee",
    name: "Cà phê",
    note: "Cây công nghiệp dài ngày, chủ yếu trồng ở Tây Nguyên.",
  },
  {
    id: "rubber",
    name: "Cao su",
    note: "Cây công nghiệp lâu năm, cho mủ dùng trong công nghiệp chế biến.",
  },
  {
    id: "tea",
    name: "Chè",
    note: "Cây công nghiệp và dược liệu, thường trồng ở vùng trung du và miền núi.",
  },
  {
    id: "pepper",
    name: "Hồ tiêu",
    note: "Gia vị quan trọng, được xuất khẩu nhiều, chủ yếu trồng ở Tây Nguyên.",
  },
  {
    id: "dragon_fruit",
    name: "Thanh long",
    note: "Cây ăn quả đặc sản của miền Nam Trung Bộ.",
  },
];

const PlantManagementGroupPage = () => {
  const [
    openedAddGroupForm,
    { open: openAddGroupForm, close: closeAddGroupForm },
  ] = useDisclosure(false);
  const cropTypeColumns: MRT_ColumnDef<CropType>[] = [
    {
      accessorKey: "id",
      header: "Mã loại cây",
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên loại cây",
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
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
          Quản lý nhóm cây trồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddGroupForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={cropTypeColumns} data={cropTypes} />
      <Modal
        opened={openedAddGroupForm}
        onClose={closeAddGroupForm}
        title={<Text fw={500}>Tạo mới loại cây</Text>}
      >
        <AddGroupForm />
      </Modal>
    </Stack>
  );
};

export default PlantManagementGroupPage;
