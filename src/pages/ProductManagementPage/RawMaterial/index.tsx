import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
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
import { useState } from "react";

type Material = {
  id: string;
  code: string;
  name: string;
  unit: string;
  supplier: string;
  stock: number;
  description?: string;
};
const materialsData: Material[] = [
  {
    id: "M001",
    code: "NL001",
    name: "Sầu riêng Ri6",
    unit: "Kg",
    supplier: "Nông trại A",
    stock: 1200,
    description: "Loại Ri6 tuyển chọn, chín cây.",
  },
  {
    id: "M002",
    code: "NL002",
    name: "Hộp thiếc",
    unit: "Cái",
    supplier: "CTY Bao Bì Bảo Long",
    stock: 500,
    description: "Loại hộp thiếc đựng sầu riêng 500g.",
  },
  {
    id: "M003",
    code: "NL003",
    name: "Túi hút chân không",
    unit: "Cái",
    supplier: "Công ty Bao Bì Đông Á",
    stock: 2000,
  },
];
const units = ["Kg", "Lít", "Cái", "Thùng"];
const ProductManagementRawMaterialPage = () => {
  const [opened, setOpened] = useState(false);
  const materialColumns: MRT_ColumnDef<Material>[] = [
    { accessorKey: "code", header: "Mã vật liệu" },
    { accessorKey: "name", header: "Tên vật liệu" },
    { accessorKey: "unit", header: "Đơn vị" },
    { accessorKey: "supplier", header: "Nhà cung cấp" },
    {
      accessorKey: "stock",
      header: "Tồn kho",
      Cell: ({ row }) => row.original.stock.toLocaleString(),
    },
    { accessorKey: "description", header: "Mô tả" },
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
          Quản lý nguyên vật liệu
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={() => setOpened(true)}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={materialColumns} data={materialsData} />
      <Modal
        title={<Text fw={500}>Tạo mới nguyên vật liệu</Text>}
        opened={opened}
        onClose={() => setOpened(false)}
        radius={4}
      >
        <Stack>
          <TextInput
            label="Mã nguyên vật liệu"
            placeholder="VD: NL001"
            radius={4}
          />
          <TextInput
            label="Tên nguyên vật liệu"
            placeholder="VD: Sầu riêng Ri6"
            radius={4}
          />
          <Group grow>
            <Select
              label="Đơn vị tính"
              placeholder="Chọn đơn vị"
              data={units}
              radius={4}
            />
            <Select
              label="Nhà cung cấp"
              placeholder="VD: Cty Nông sản A"
              radius={4}
            />
          </Group>
          <NumberInput label="Số lượng tồn kho" min={0} radius={4} />
          <Textarea
            label="Mô tả"
            placeholder="Thông tin thêm về nguyên vật liệu"
            radius={4}
          />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button radius={4}>Lưu</Button>
        </Group>
      </Modal>
    </Stack>
  );
};
export default ProductManagementRawMaterialPage;
