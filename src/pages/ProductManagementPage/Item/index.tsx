import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Menu,
  Modal,
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
import { useState } from "react";

type Product = {
  id: string; // Mã sản phẩm
  name: string; // Tên sản phẩm
  tree: string; // Cây (chọn từ danh sách II)
  category: string; // Loại sản phẩm (chọn từ XII.2)
  description: string; // Nội dung mô tả chi tiết
  isActive: boolean;
};
const productData: Product[] = [
  {
    id: "SP001",
    name: "Mứt sầu riêng Ri6",
    tree: "Sầu riêng",
    category: "Thực phẩm chế biến",
    description: "Sản phẩm được làm từ sầu riêng Ri6, đóng gói 250g.",
    isActive: true,
  },
  {
    id: "SP002",
    name: "Cafe hạt nguyên chất",
    tree: "Cà phê",
    category: "Đồ uống",
    description: "Cafe Arabica thu hoạch tại Đắk Lắk, rang mộc.",
    isActive: true,
  },
  {
    id: "SP003",
    name: "Chuối sấy dẻo",
    tree: "Chuối",
    category: "Thực phẩm sấy",
    description: "Chuối sấy dẻo đóng gói 100g, không chất bảo quản.",
    isActive: false,
  },
];
const product = {
  imageUrl: "https://traicaytonyteo.com/uploads/source/sau-rieng-ri-6-min.jpg",
  productCode: "SP001",
  productName: "Sầu riêng Ri6 tươi",
  tree: "Sầu riêng",
  category: "Trái cây tươi",
  content: "Sản phẩm sầu riêng Ri6 chất lượng cao, thu hoạch từ khu vực A1.",
};
const ProductManagementItemPage = () => {
  const [openedDetail, setOpenedDetail] = useState(false);
  const navigate = useNavigate();
  const onAddItem = () => {
    navigate(PATH.PRODUCT_ADD_ITEM);
  };

  const productColumns: MRT_ColumnDef<Product>[] = [
    { accessorKey: "id", header: "Mã sản phẩm" },
    { accessorKey: "name", header: "Tên sản phẩm" },
    {
      accessorKey: "isActive",
      header: "Công khai",

      Cell: ({ row }) =>
        row.original.isActive ? (
          <Badge color="green">Công khai</Badge>
        ) : (
          <Badge color="red">Không</Badge>
        ),
    },
    { accessorKey: "tree", header: "Cây" },
    { accessorKey: "category", header: "Loại sản phẩm" },
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
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => setOpenedDetail(true)}
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
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý sản phẩm
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddItem}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm sản phẩm</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc loại sản phẩm, trạng thái
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
            description="Ví dụ: Mứt sầu riêng Ri6"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Loại sản phẩm"
              description="Ví dụ: Thực phẩm chế biến, Đồ uống"
              placeholder="Chọn thông tin"
              data={["Thực phẩm chế biến", "Đồ uống", "Thực phẩm sấy"]}
            />
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Trạng thái"
              description="Ví dụ: Còn hàng, Hết hàng"
              placeholder="Chọn thông tin"
              data={["Còn hàng", "Hết hàng"]}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      <Table columns={productColumns} data={productData} />
      <Modal
        opened={openedDetail}
        onClose={() => setOpenedDetail(false)}
        title={<Text fw={"bold"}>Thông tin sản phẩm</Text>}
      >
        <Stack>
          <Title order={4}>{product.productName}</Title>
          <Text size="sm" c="dimmed">
            Mã sản phẩm: {product.productCode}
          </Text>
          <Group>
            <Badge color="green">Cây: {product.tree}</Badge>
            <Badge color="blue">Loại: {product.category}</Badge>
          </Group>
          <Divider my="sm" />
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt="Ảnh sản phẩm"
              style={{ maxHeight: 200, objectFit: "contain" }}
            />
          )}
          <Text size="sm">{product.content}</Text>
        </Stack>
      </Modal>
    </Stack>
  );
};
export default ProductManagementItemPage;
