import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Stack,
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
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type FundRecord = {
  fundName: string; // Tên quỹ
  documentNumber: string; // Số chứng từ
  title: string; // Tiêu đề nội dung
  paymentMethod: string; // Hình thức thu (tiền mặt, chuyển khoản)
  bankInfo?: {
    bankName: string; // Tên ngân hàng
    accountNumber: string; // Số tài khoản
  } | null; // Thông tin ngân hàng (nếu có)
  amount: number; // Số tiền
  date: string; // Ngày thu
  createdBy: string; // Người tạo
  description: string; // Mô tả chi tiết
  status: string; // Trạng thái (Đã thu, Chờ xử lý, Đã huỷ)
};
const fundRecords: FundRecord[] = [
  {
    fundName: "Quỹ tiền mặt",
    documentNumber: "CT001",
    title: "Thu tiền hợp đồng số 12345",
    paymentMethod: "Tiền mặt",
    bankInfo: null,
    amount: 5000000,
    date: "2025-08-06",
    createdBy: "Nguyễn Văn A",
    description: "Thu tiền hợp đồng số 12345 từ khách hàng.",
    status: "Đã thu",
  },
  {
    fundName: "Quỹ chuyển khoản",
    documentNumber: "CT002",
    title: "Thu tiền hợp đồng số 67890",
    paymentMethod: "Chuyển khoản",
    bankInfo: {
      bankName: "Ngân hàng XYZ",
      accountNumber: "123456789",
    },
    amount: 10000000,
    date: "2025-08-06",
    createdBy: "Trần Thị B",
    description: "Thu tiền hợp đồng số 67890 qua chuyển khoản.",
    status: "Chờ xử lý",
  },
  {
    fundName: "Quỹ tiền mặt",
    documentNumber: "CT003",
    title: "Thu tiền hợp đồng số 54321",
    paymentMethod: "Tiền mặt",
    bankInfo: null,
    amount: 3000000,
    date: "2025-08-07",
    createdBy: "Nguyễn Văn C",
    description: "Thu tiền hợp đồng số 54321 từ khách hàng.",
    status: "Đã huỷ",
  },
];
const FinancePurposeReceivePage = () => {
  const navigate = useNavigate();
  const fundColumns: MRT_ColumnDef<FundRecord>[] = [
    {
      header: "Tên quỹ",
      accessorKey: "fundName",
    },
    {
      header: "Số chứng từ",
      accessorKey: "documentNumber",
    },
    {
      header: "Tiêu đề nội dung",
      accessorKey: "title",
    },
    {
      header: "Hình thức thu",
      accessorKey: "paymentMethod",
    },
    {
      header: "Thông tin ngân hàng",
      accessorKey: "bankInfo",
      Cell: ({ row }) =>
        row.original.bankInfo
          ? `${row.original.bankInfo.bankName} - ${row.original.bankInfo.accountNumber}`
          : "N/A",
    },
    {
      header: "Số tiền",
      accessorKey: "amount",
      Cell: ({ row }) => `${row.original.amount.toLocaleString()} VND`,
    },
    {
      header: "Ngày thu",
      accessorKey: "date",
      Cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("vi-VN"),
    },
    {
      header: "Người tạo",
      accessorKey: "createdBy",
    },
    {
      header: "Mô tả chi tiết",
      accessorKey: "description",
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      Cell: ({ row }) => {
        const status = row.original.status;
        const color =
          status === "Đã thu"
            ? "green"
            : status === "Chờ xử lý"
            ? "orange"
            : "red";
        return (
          <Badge color={color} variant="light">
            {status}
          </Badge>
        );
      },
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
  const onAddPurposeReceive = () => {
    navigate(PATH.FINANCE_PURPOSE_RECEIVE_ADD);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Quản lý thu
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddPurposeReceive}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={fundColumns} data={fundRecords} />
    </Stack>
  );
};

export default FinancePurposeReceivePage;
