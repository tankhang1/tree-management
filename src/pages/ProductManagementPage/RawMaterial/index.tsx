import {
  ActionIcon,
  Button,
  Card,
  Group,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";

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
const ProductManagementRawMaterialPage = () => {
  const navigate = useNavigate();
  const materialColumns: MRT_ColumnDef<Material>[] = [
    { accessorKey: "code", header: "Mã vật liệu" },
    { accessorKey: "name", header: "Tên vật liệu" },
    { accessorKey: "unit", header: "Đơn vị" },
    { accessorKey: "supplier", header: "Nhà cung cấp" },
    {
      accessorKey: "stock",
      header: "Số lượng",
      Cell: ({ row }) => row.original.stock.toLocaleString(),
    },
    { accessorKey: "description", header: "Mô tả" },
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
  const onAddRawMaterial = () => {
    navigate(PATH.PRODUCT_RAW_MATERIAL_ADD);
  };
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
          <Button radius={4} onClick={onAddRawMaterial}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm nguyên vật liệu</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc loại nguyên vật liệu, nhà cung cấp
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={() => {}}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        {/* Form */}
        <Stack gap="sm">
          {/* Khung tìm kiếm (keyword) */}
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Ví dụ: Sầu riêng Ri6, Hộp thiếc"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Loại nguyên vật liệu"
              placeholder="Chọn loại"
              data={["Nguyên liệu", "Bao bì", "Phụ kiện"]}
              description="Ví dụ: Nguyên liệu, Bao bì, Phụ kiện"
              searchable
              clearable
            />
            <MultiSelect
              radius={4}
              label="Nhà cung cấp"
              placeholder="Chọn nhà cung cấp"
              data={["Công ty A", "Công ty B", "Công ty C"]}
              description="Ví dụ: Công ty A, Công ty B, Công ty C"
              searchable
              clearable
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={materialColumns} data={materialsData} />
    </Stack>
  );
};
export default ProductManagementRawMaterialPage;
