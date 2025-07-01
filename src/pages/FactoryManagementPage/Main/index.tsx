import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type Factory = {
  factoryId: string;
  name: string;
  location: string;
  areaSize: number; // diện tích (m²)
  manager: string; // tên người quản lý
  departments: string[]; // danh sách phòng ban
  establishedDate: string; // YYYY-MM-DD
  status: string;
};
const factoryDataset: Factory[] = [
  {
    factoryId: "FAC001",
    name: "Nhà máy chế biến A",
    location: "KCN Tân Bình, TP.HCM",
    areaSize: 12000,
    manager: "Nguyễn Văn A",
    departments: ["Sản xuất", "Kho", "QA/QC"],
    establishedDate: "2015-04-10",
    status: "Ngưng hoạt động",
  },
  {
    factoryId: "FAC002",
    name: "Xưởng đóng gói B",
    location: "Biên Hòa, Đồng Nai",
    areaSize: 8500,
    manager: "Trần Thị B",
    departments: ["Đóng gói", "Kho", "Kỹ thuật"],
    establishedDate: "2018-07-22",
    status: "Bảo trì",
  },
  {
    factoryId: "FAC003",
    name: "Nhà máy phân phối C",
    location: "KCN VSIP, Bình Dương",
    areaSize: 15000,
    manager: "Phạm Văn C",
    departments: ["Kho", "Vận chuyển", "Kế toán"],
    establishedDate: "2020-01-15",
    status: "Đang Hoạt động",
  },
];

const FactoryManagementMainPage = () => {
  const navigate = useNavigate();
  const onAddFactoryMain = () => {
    navigate(PATH.FACTORY_ADD_MAIN);
  };
  const onAddFactoryDetail = () => {
    navigate(PATH.FACTORY_MAIN_DETAIL);
  };
  const factoryColumns: MRT_ColumnDef<Factory>[] = [
    { accessorKey: "factoryId", header: "Mã nhà máy" },
    { accessorKey: "name", header: "Tên nhà máy" },
    { accessorKey: "location", header: "Địa chỉ" },
    { accessorKey: "areaSize", header: "Diện tích (m²)" },
    { accessorKey: "manager", header: "Quản lý" },
    {
      accessorKey: "departments",
      header: "Phòng ban",
      Cell: ({ row }) => (
        <Stack gap={"xs"}>
          {row.original.departments.map((department) => (
            <Text>- {department}</Text>
          ))}
        </Stack>
      ),
    },
    { accessorKey: "establishedDate", header: "Ngày thành lập" },
    { accessorKey: "status", header: "Trạng thái" },
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
              onClick={onAddFactoryDetail}
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
          Quản lý nhà máy
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddFactoryMain}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Autocomplete
          leftSection={<IconSearch size={18} />}
          placeholder="Tìm kiếm vùng trồng"
          radius={4}
        />
      </Group>
      <Table columns={factoryColumns} data={factoryDataset} />
    </Stack>
  );
};
export default FactoryManagementMainPage;
