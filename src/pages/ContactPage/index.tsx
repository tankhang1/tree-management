import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
export type Contact = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
  organization?: string;
  address?: string;
  note?: string;
};
export const contactList: Contact[] = [
  {
    id: "CT001",
    name: "Nguyễn Văn A",
    phone: "0909123456",
    email: "nguyenvana@gmail.com",
    role: "Quản lý trang trại",
    organization: "Hợp tác xã Sầu riêng A1",
    address: "Xã Bình Phú, Huyện Cai Lậy, Tiền Giang",
    note: "Chuyên phụ trách kỹ thuật cây trồng.",
  },
  {
    id: "CT002",
    name: "Trần Thị B",
    phone: "0934567890",
    email: "tranthib@yahoo.com",
    role: "Kỹ sư nông nghiệp",
    organization: "Công ty CP Giống cây trồng XYZ",
    address: "Phường Hiệp Bình Chánh, TP. Thủ Đức",
  },
  {
    id: "CT003",
    name: "Lê Văn C",
    phone: "0912345678",
    role: "Chuyên viên tài chính",
    organization: "HTX Nông nghiệp Cửu Long",
  },
  {
    id: "CT004",
    name: "Phạm Thị D",
    phone: "0978123456",
    email: "phamthid@agrivn.com",
    role: "Tư vấn viên",
    organization: "AgriCare",
  },
  {
    id: "CT005",
    name: "Võ Quốc E",
    phone: "0903344556",
    role: "Kỹ thuật viên tưới tiêu",
  },
  {
    id: "CT006",
    name: "Đinh Thị F",
    phone: "0988112233",
    organization: "Trạm BVTV Huyện Trảng Bom",
  },
  {
    id: "CT007",
    name: "Ngô Văn G",
    phone: "0902555666",
    role: "Nhân viên vận hành",
    address: "Long Thành, Đồng Nai",
  },
  {
    id: "CT008",
    name: "Lý Thị H",
    phone: "0944332211",
    role: "Thủ quỹ",
    organization: "HTX Nông sản Hữu cơ",
  },
  {
    id: "CT009",
    name: "Đặng Minh I",
    phone: "0911778899",
    email: "dangminhi@example.com",
  },
  {
    id: "CT010",
    name: "Nguyễn Thị J",
    phone: "0909988776",
    role: "Phụ trách đào tạo",
  },
];

const ContactPage = () => {
  const navigate = useNavigate();
  const onAddContract = () => {
    navigate(PATH.CONTRACT_ADD_MANAGEMENT);
  };
  const onDetailContract = () => {
    navigate(PATH.CONTRACT_MANAGEMENT_DETAIL);
  };
  const contactColumns: MRT_ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: "Họ tên",
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
      accessorKey: "role",
      header: "Chức vụ",
    },
    {
      accessorKey: "organization",
      header: "Tổ chức/Đơn vị",
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
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
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onDetailContract}
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
          Quản lý danh sách liên hệ
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddContract}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={contactColumns} data={contactList} />
    </Stack>
  );
};

export default ContactPage;
