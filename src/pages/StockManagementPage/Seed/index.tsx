import {
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Group,
  Menu,
  Modal,
  MultiSelect,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEye,
  IconFileExcel,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddSeedForm from "./components/AddSeedForm";
import { useState } from "react";

type SeedTransactionType = "nhập" | "xuất" | "huỷ";
type SeedTransaction = {
  id: string; // Mã phiếu
  seedId: string; // Mã hạt giống (liên kết hạt giống VI.x)
  quantity: number; // Số lượng
  unit: string; // Đơn vị tính (g, kg, hạt,...)
  type: SeedTransactionType; // Loại phiếu
  date: string; // Ngày giao dịch
  staffId: string; // Nhân viên thực hiện (XI)
  note?: string; // Ghi chú
};
const seedTransactions: SeedTransaction[] = [
  {
    id: "STX001",
    seedId: "HG001",
    quantity: 500,
    unit: "g",
    type: "nhập",
    date: "2024-06-01",
    staffId: "EMP001",
    note: "Nhập từ Viện giống",
  },
  {
    id: "STX002",
    seedId: "HG001",
    quantity: 200,
    unit: "g",
    type: "xuất",
    date: "2024-06-05",
    staffId: "EMP002",
    note: "Xuất cho vùng trồng số 3",
  },
  {
    id: "STX003",
    seedId: "HG002",
    quantity: 100,
    unit: "hạt",
    type: "huỷ",
    date: "2024-06-07",
    staffId: "EMP003",
    note: "Hạt ẩm mốc không sử dụng",
  },
];

const StockManagementSeedPage = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState("");
  const [openedStockSeed, { open: openStockSeed, close: closeStockSeed }] =
    useDisclosure(false);
  const seedUsageColumns: MRT_ColumnDef<SeedTransaction>[] = [
    { accessorKey: "id", header: "Mã phiếu" },
    { accessorKey: "seedId", header: "Mã hạt giống" },
    { accessorKey: "quantity", header: "Số lượng" },
    { accessorKey: "unit", header: "Đơn vị" },
    {
      accessorKey: "type",
      header: "Loại phiếu",
      Cell: ({ cell }) => {
        const value = cell.getValue<SeedTransactionType>();
        const color =
          value === "nhập" ? "green" : value === "xuất" ? "blue" : "red";
        return <Badge color={color}>{value.toUpperCase()}</Badge>;
      },
    },
    {
      accessorKey: "date",
      header: "Ngày",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString("vi-VN"),
    },
    { accessorKey: "staffId", header: "Nhân viên" },
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
          Quản lý phiếu xuất/nhập hạt giống
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openStockSeed}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={seedUsageColumns} data={seedTransactions} />
      <Modal
        opened={openedStockSeed}
        onClose={closeStockSeed}
        title={<Text fw="bold">Thêm mới phiếu xuất/nhập hạt giống</Text>}
      >
        <AddSeedForm onFilter={openFilterEmployee} />
      </Modal>
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Chọn đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <MultiSelect
                label="Chọn phòng ban"
                radius={4}
                data={["Ban tài chính", "Ban kĩ thuật", "Ban kế hoạch"]}
              />
              <MultiSelect
                label="Chọn vai trò"
                radius={4}
                data={["Giám đốc", "Tổ trưởng", "Trưởng phòng"]}
              />
            </>
          )}
          <Autocomplete
            label="Tìm kiếm nhân sự"
            placeholder="Nhập tên hoặc chức vụ..."
            leftSection={<IconSearch size={18} />}
            radius={4}
          />
        </Stack>

        <Group mt="md" justify="flex-end">
          <Button
            radius={4}
            variant="outline"
            color="red"
            onClick={closeFilterEmployee}
          >
            Huỷ
          </Button>
          <Button radius={4}>Xác nhận</Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default StockManagementSeedPage;
