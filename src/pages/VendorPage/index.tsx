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
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import CreateSupplierForm from "./components/CreateSupplierForm";
export type SupplierEntity = {
  id: string;
  name: string;
  type: "cá nhân" | "doanh nghiệp";
  representative: string;
  phone: string;
  email?: string;
  address: string;
  taxCode?: string;
  supplyCategories: string[]; // danh sách ngành hàng cung cấp
  note?: string;
};
const mockSuppliers: SupplierEntity[] = [
  {
    id: "SUP001",
    name: "Công ty TNHH Nông Nghiệp Xanh",
    type: "doanh nghiệp",
    representative: "Nguyễn Văn A",
    phone: "0912345678",
    email: "contact@nongnghiepxanh.vn",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    taxCode: "0312345678",
    supplyCategories: ["Phân bón", "Thuốc BVTV"],
    note: "Đối tác lâu năm",
  },
  {
    id: "SUP002",
    name: "Trần Thị B",
    type: "cá nhân",
    representative: "Trần Thị B",
    phone: "0987654321",
    email: undefined,
    address: "Ấp 3, Xã Tân Phú, Huyện Châu Thành, Long An",
    taxCode: undefined,
    supplyCategories: ["Vật tư nông nghiệp"],
    note: "",
  },
];
const VendorPage = () => {
  const [openedSupplier, { open: openSupplier, close: closeSupplier }] =
    useDisclosure(false);
  const supplierColumns: MRT_ColumnDef<SupplierEntity>[] = [
    {
      accessorKey: "id",
      header: "Mã nhà cung cấp",
    },
    {
      accessorKey: "name",
      header: "Tên nhà cung cấp",
    },
    {
      accessorKey: "type",
      header: "Loại",
      Cell: ({ cell }) =>
        cell.getValue() === "doanh nghiệp" ? "Doanh nghiệp" : "Cá nhân",
    },
    {
      accessorKey: "representative",
      header: "Người đại diện",
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
    },
    {
      accessorKey: "taxCode",
      header: "Mã số thuế",
    },
    {
      accessorKey: "supplyCategories",
      header: "Ngành hàng cung cấp",
      Cell: ({ cell }) => (cell.getValue() as string[]).join(", "),
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
          Quản lý nhà cung cấp
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openSupplier}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={supplierColumns} data={mockSuppliers} />
      <Modal
        opened={openedSupplier}
        onClose={closeSupplier}
        title={<Text fw={"bold"}>Thêm mới nhà cung cấp</Text>}
      >
        <CreateSupplierForm />
      </Modal>
    </Stack>
  );
};
export default VendorPage;
