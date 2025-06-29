import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Select,
  Stack,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconCalendar,
  IconContract,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
  IconTypeface,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
type Contract = {
  id: string;
  name: string;
  contractType: "Thu" | "Mua";
  summary: string;
  items: string[]; // tên các vật tư / thuốc / máy móc / thành phẩm
  quantity: number;
  unit: string;
  value: number;
  currency: string;
  status: "Đang hiệu lực" | "Đã kết thúc" | "Chờ duyệt";
  startDate: string;
  endDate: string;
  partner: string; // Tên đối tác / khách hàng
  fileUrl?: string;
};
const contractData: Contract[] = [
  {
    id: "HD001",
    name: "Hợp đồng thu mua sầu riêng 2024",
    contractType: "Thu",
    summary: "Thu mua sản phẩm sầu riêng từ vùng trồng A",
    items: ["Sầu riêng Ri6", "Thùng vận chuyển"],
    quantity: 5000,
    unit: "Kg",
    value: 250_000_000,
    currency: "VND",
    status: "Đang hiệu lực",
    startDate: "2024-07-01",
    endDate: "2024-12-31",
    partner: "Công ty Nông sản ABC",
    fileUrl: "/contracts/hd001.pdf",
  },
  {
    id: "HD002",
    name: "Hợp đồng mua máy móc đợt 1",
    contractType: "Mua",
    summary: "Mua thiết bị phục vụ sản xuất",
    items: ["Máy cày Kubota", "Thuốc trừ sâu B58"],
    quantity: 20,
    unit: "Cái",
    value: 120_000_000,
    currency: "VND",
    status: "Chờ duyệt",
    startDate: "2024-08-01",
    endDate: "2024-09-30",
    partner: "Công ty Thiết bị Nông nghiệp DEF",
    fileUrl: "",
  },
];

const ContractManagementPage = () => {
  const navigate = useNavigate();
  const onAddContract = () => {
    navigate(PATH.CONTRACT_ADD_MANAGEMENT);
  };
  const onDetailContract = () => {
    navigate(PATH.CONTRACT_MANAGEMENT_DETAIL);
  };
  const contractColumns: MRT_ColumnDef<Contract>[] = [
    { accessorKey: "id", header: "Mã hợp đồng" },
    { accessorKey: "name", header: "Tên hợp đồng" },
    { accessorKey: "partner", header: "Đối tác" },
    { accessorKey: "contractType", header: "Loại" },
    { accessorKey: "summary", header: "Tóm tắt nội dung" },
    {
      accessorKey: "items",
      header: "Danh sách vật tư",
      Cell: ({ row }) => row.original.items.join(", "),
    },
    { accessorKey: "quantity", header: "Sản lượng" },
    { accessorKey: "unit", header: "Đơn vị" },
    {
      accessorKey: "value",
      header: "Giá trị",
      Cell: ({ row }) =>
        `${row.original.value.toLocaleString()} ${row.original.currency}`,
    },
    { accessorKey: "status", header: "Trạng thái" },
    { accessorKey: "startDate", header: "Ngày hiệu lực" },
    { accessorKey: "endDate", header: "Ngày kết thúc" },

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
          Quản lý hợp đồng
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
      <Group>
        <DateInput
          leftSection={<IconCalendar size={18} />}
          placeholder="Ngày bắt đầu"
          radius={4}
        />
        <DateInput
          leftSection={<IconCalendar size={18} />}
          placeholder="Ngày kết thúc"
          radius={4}
        />
        <Select
          radius={4}
          leftSection={<IconContract size={18} />}
          placeholder="Loại hoại đồng"
          data={["Thu", "Mua"]}
        />
        <Select
          radius={4}
          leftSection={<IconTypeface size={18} />}
          placeholder="Loại hoại đồng"
          data={["Thu", "Mua"]}
        />
      </Group>
      <Table columns={contractColumns} data={contractData} />
    </Stack>
  );
};

export default ContractManagementPage;
