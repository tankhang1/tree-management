import {
  ActionIcon,
  Badge,
  Button,
  Divider,
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
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState } from "react";

type Product = {
  id: string; // Mã sản phẩm
  name: string; // Tên sản phẩm
  tree: string; // Cây (chọn từ danh sách II)
  category: string; // Danh mục sản phẩm (chọn từ XII.2)
  description: string; // Nội dung mô tả chi tiết
};
const productData: Product[] = [
  {
    id: "SP001",
    name: "Mứt sầu riêng Ri6",
    tree: "Sầu riêng",
    category: "Thực phẩm chế biến",
    description: "Sản phẩm được làm từ sầu riêng Ri6, đóng gói 250g.",
  },
  {
    id: "SP002",
    name: "Cafe hạt nguyên chất",
    tree: "Cà phê",
    category: "Đồ uống",
    description: "Cafe Arabica thu hoạch tại Đắk Lắk, rang mộc.",
  },
  {
    id: "SP003",
    name: "Chuối sấy dẻo",
    tree: "Chuối",
    category: "Thực phẩm sấy",
    description: "Chuối sấy dẻo đóng gói 100g, không chất bảo quản.",
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
    { accessorKey: "tree", header: "Cây" },
    { accessorKey: "category", header: "Danh mục sản phẩm" },
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
            <Badge color="blue">Danh mục: {product.category}</Badge>
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
