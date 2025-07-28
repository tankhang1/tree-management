import {
  ActionIcon,
  Badge,
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

import Table from "../../components/Table";
import { useState } from "react";
import AddBankModal from "./components/AddBankModal";
type Bank = {
  id: string; // Mã ngân hàng
  name: string; // Tên ngân hàng
  branch: string; // Chi nhánh
  accountName: string; // Tên chủ tài khoản
  accountNumber: string; // Số tài khoản
  phone: string; // Số điện thoại liên hệ
  email: string; // Email liên hệ
  status: string; // Trạng thái (Hoạt động, Không hoạt động)
};

const bankDataset: Bank[] = [
  {
    id: "BANK001",
    name: "Vietcombank",
    branch: "Chi nhánh Hà Nội",
    accountName: "Nguyễn Văn A",
    accountNumber: "0123456789",
    phone: "0912345678",
    email: "contact@vietcombank.vn",
    status: "Hoạt động",
  },
  {
    id: "BANK002",
    name: "ACB",
    branch: "Chi nhánh Sài Gòn",
    accountName: "Trần Thị B",
    accountNumber: "9876543210",
    phone: "0987654321",
    email: "contact@acb.com.vn",
    status: "Hoạt động",
  },
  {
    id: "BANK003",
    name: "TPBank",
    branch: "Chi nhánh Đà Nẵng",
    accountName: "Phạm Văn C",
    accountNumber: "1234567890",
    phone: "0912345678",
    email: "contact@tpbank.vn",
    status: "Không hoạt động",
  },
];

const BankManagementPage = () => {
  const [opened, setOpened] = useState(false);
  const bankColumns: MRT_ColumnDef<Bank>[] = [
    { accessorKey: "id", header: "Mã ngân hàng" },
    { accessorKey: "name", header: "Tên ngân hàng" },
    { accessorKey: "branch", header: "Chi nhánh" },
    { accessorKey: "accountName", header: "Tên chủ tài khoản" },
    { accessorKey: "accountNumber", header: "Số tài khoản" },
    { accessorKey: "phone", header: "Số điện thoại" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ cell }) => {
        const status = cell.getValue<string>();
        const color = status === "Hoạt động" ? "green" : "red";

        return <Badge color={color}>{status}</Badge>;
      },
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
          Quản lý ngân hàng
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

      <Table columns={bankColumns} data={bankDataset} />
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Text fw="500">Thêm mới ngân hàng</Text>}
      >
        <AddBankModal
          onClose={() => setOpened(false)}
          onSubmit={(data) => {
            // Handle form submission logic here
            console.log("Submitted data:", data);
            setOpened(false);
          }}
        />
      </Modal>
    </Stack>
  );
};
export default BankManagementPage;
