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
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
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

      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm hợp đồng</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc đối tác, loại, khoản thời gian
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
            description="Ví dụ: Hợp đồng thu mua sầu riêng"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <DatePickerInput
              leftSection={<IconCalendar size={18} />}
              label="Khoảng thời gian"
              description="Ví dụ: 18/5/2025 - 18/6/2025"
              placeholder="Chọn thông tin"
              radius={4}
              clearable
              locale="vi"
              type="range"
            />
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Đối tác"
              description="Ví dụ: Công ty Nông sản ABC"
              placeholder="Chọn thông tin"
              data={["Đối tác 1", "Đối tác 2", "Đối tác 3"]}
            />
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Loại hợp đồng"
              description="Ví dụ: Hợp đồng thu mua"
              placeholder="Chọn thông tin"
              data={["Loại 1", "Loại 2", "Loại 3"]}
            />
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Trạng thái"
              description="Ví dụ: Đang hiệu lực"
              placeholder="Chọn thông tin"
              data={["Chờ duyệt", "Đang hiệu lực", "Hết hiệu lực"]}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={contractColumns} data={contractData} />
    </Stack>
  );
};

export default ContractManagementPage;
