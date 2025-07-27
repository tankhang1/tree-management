import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
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
import { useDisclosure } from "@mantine/hooks";
type BOMItem = {
  id: string;
  productCode: string;
  productName: string;
  materialName: string;
  quantity: number;
  unit: string;
  note?: string;
};
const bomDataset: BOMItem[] = [
  {
    id: "BOM001",
    productCode: "SP001",
    productName: "Sầu riêng Ri6 đóng hộp",
    materialName: "Hộp thiếc",
    quantity: 1,
    unit: "Cái",
    note: "Kích thước 500ml",
  },
  {
    id: "BOM002",
    productCode: "SP001",
    productName: "Sầu riêng Ri6 đóng hộp",
    materialName: "Sầu riêng Ri6",
    quantity: 2,
    unit: "Kg",
    note: "",
  },
  {
    id: "BOM003",
    productCode: "SP002",
    productName: "Xoài sấy dẻo",
    materialName: "Xoài cát Hòa Lộc",
    quantity: 1.5,
    unit: "Kg",
    note: "Loại 1",
  },
];

const ProductManagementBOMPage = () => {
  const [openedBOMForm, { open: openBOMForm, close: closeBOMForm }] =
    useDisclosure(false);
  const bomColumns: MRT_ColumnDef<BOMItem>[] = [
    { accessorKey: "productCode", header: "Mã sản phẩm" },
    { accessorKey: "productName", header: "Tên sản phẩm" },
    { accessorKey: "materialName", header: "Nguyên vật liệu" },
    { accessorKey: "quantity", header: "Số lượng" },
    { accessorKey: "unit", header: "Đơn vị" },
    { accessorKey: "note", header: "Ghi chú" },
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
          Quản lý BOM
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openBOMForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={bomColumns} data={bomDataset} />
      <Modal
        title={<Text fw={"bold"}>Tạo BOM mới</Text>}
        opened={openedBOMForm}
        onClose={closeBOMForm}
        radius={4}
      >
        <Stack gap={"xs"}>
          <Select label="Sản phẩm" placeholder="Chọn sản phẩm" radius={4} />
          <Select
            label="Nguyên vật liệu"
            placeholder="Chọn nguyên vật liệu"
            radius={4}
          />
          <Group grow>
            <NumberInput label="Số lượng" min={1} radius={4} />
            <MultiSelect
              label="Quy cách"
              radius={4}
              placeholder="Quy cách"
              data={[
                {
                  value: "PKG001",
                  label: "Hộp giấy nhỏ (50 cái)",
                },
                {
                  value: "PKG002",
                  label: "Túi nilon lớn (100 cái)",
                },
                {
                  value: "PKG003",
                  label: "Bao tải 25kg (25 cái)",
                },
                {
                  value: "PKG004",
                  label: "Bịch nhựa 1kg (10 cái)",
                },
                {
                  value: "PKG005",
                  label: "Thùng carton lớn (20 cái)",
                },
                {
                  value: "PKG006",
                  label: "Hộp nhựa 500ml (30 cái)",
                },
              ]}
            />{" "}
          </Group>
          <TextInput
            label="Ghi chú"
            placeholder="Ghi chú thêm nếu có"
            radius={4}
          />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button radius={4}>Lưu BOM</Button>
        </Group>
      </Modal>
    </Stack>
  );
};
export default ProductManagementBOMPage;
