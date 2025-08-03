import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
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
export type CompanyAddressEntity = {
  id: string; // Mã định danh
  name: string; // Tên công ty hoặc đơn vị
  type: "hộ nông dân" | "doanh nghiệp" | "hợp tác xã"; // Loại hình
  recipientName: string; // Người nhận
  phone: string; // Số điện thoại
  email?: string; // Email (tuỳ chọn)
  address: string; // Địa chỉ
  taxCode?: string; // Mã số thuế (tuỳ chọn)
  note?: string; // Ghi chú (tuỳ chọn)
};

const companyAddressDataset: CompanyAddressEntity[] = [
  {
    id: "C001",
    name: "Công ty TNHH ABC",
    type: "doanh nghiệp",
    recipientName: "Nguyễn Văn A",
    phone: "0912345678",
    email: "contact@abc.com",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    taxCode: "0301234567",
    note: "Đối tác chiến lược",
  },
  {
    id: "C002",
    name: "Hộ ông Trần Văn B",
    type: "hộ nông dân",
    recipientName: "Trần Văn B",
    phone: "0987654321",
    email: "tranvanb@example.com",
    address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    note: "Canh tác theo mô hình hữu cơ",
  },
  {
    id: "C003",
    name: "HTX Nông nghiệp Xanh",
    type: "hợp tác xã",
    recipientName: "Lê Thị C",
    phone: "0938123456",
    email: "info@nongnghiepxanh.vn",
    address: "789 Đường Hai Bà Trưng, Quận 3, TP.HCM",
    taxCode: "0407654321",
    note: "Liên kết tiêu thụ sản phẩm với doanh nghiệp Nhật",
  },
];

const CompanyAddressPage = () => {
  const navigate = useNavigate();
  const companyAddressColumns: MRT_ColumnDef<CompanyAddressEntity>[] = [
    { accessorKey: "name", header: "Tên đơn vị" },
    { accessorKey: "type", header: "Loại hình" },
    { accessorKey: "recipientName", header: "Người nhận" },
    { accessorKey: "phone", header: "Số điện thoại" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Địa chỉ" },
    { accessorKey: "taxCode", header: "Mã số thuế" },
    { accessorKey: "note", header: "Ghi chú" },
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
  const onAddAddress = () => {
    navigate(PATH.COMPANY_ADDRESS_ADD);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý địa chỉ doanh nghiệp / nông hộ
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddAddress}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={companyAddressColumns} data={companyAddressDataset} />
    </Stack>
  );
};
export default CompanyAddressPage;
