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
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconEye,
  IconFileExcel,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useState } from "react";
import AddFertilizerForm from "./components/AddFertilizerForm";
type FertilizerTransactionType = "nhập" | "xuất";
type FertilizerTransactionStatus = "chờ duyệt" | "đã duyệt" | "đã hủy";

interface FertilizerItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  batchCode?: string;
  expiryDate?: string;
  note?: string;
}

interface FertilizerTransaction {
  id: string;
  type: FertilizerTransactionType;
  date: string;
  createdBy: string;
  approvedBy?: string;
  status: FertilizerTransactionStatus;
  warehouseFrom?: string;
  warehouseTo?: string;
  areaName?: string;
  note?: string;
  items: FertilizerItem[];
}

const fertilizerTransactionData: FertilizerTransaction[] = [
  {
    id: "PX001",
    type: "xuất",
    date: "2025-07-16",
    createdBy: "Nguyễn Văn A",
    approvedBy: "Trần B",
    status: "đã duyệt",
    warehouseFrom: "Kho trung tâm",
    areaName: "Khu A1",
    note: "Xuất theo kế hoạch K1",
    items: [
      {
        id: "1",
        productId: "PB001",
        productName: "Phân NPK 16-16-8",
        quantity: 500,
        unit: "kg",
        batchCode: "LO001",
        expiryDate: "2025-12-31",
      },
      {
        id: "2",
        productId: "PB002",
        productName: "Phân Ure",
        quantity: 300,
        unit: "kg",
        note: "Cho lô phía Bắc",
      },
    ],
  },
  {
    id: "PN002",
    type: "nhập",
    date: "2025-07-10",
    createdBy: "Nguyễn Văn C",
    status: "chờ duyệt",
    warehouseTo: "Kho 2",
    note: "Nhập từ nhà cung cấp ABC",
    items: [
      {
        id: "1",
        productId: "PB003",
        productName: "Phân Kali",
        quantity: 200,
        unit: "kg",
      },
    ],
  },
];

const StockManagementFertilizerPage = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState("");

  const [
    openedStockMachine,
    { open: openStockMachine, close: closeStockMachine },
  ] = useDisclosure(false);
  const fertilizerTransactionColumns: MRT_ColumnDef<FertilizerTransaction>[] = [
    { accessorKey: "id", header: "Mã phiếu" },
    {
      accessorKey: "type",
      header: "Loại phiếu",
      Cell: ({ cell }) => {
        const value = cell.getValue<FertilizerTransactionType>();
        const color =
          value === "nhập" ? "green" : value === "xuất" ? "blue" : "red";
        return <Badge color={color}>{value.toUpperCase()}</Badge>;
      },
    },
    { accessorKey: "date", header: "Ngày giao dịch" },
    { accessorKey: "createdBy", header: "Người tạo" },
    { accessorKey: "approvedBy", header: "Người duyệt" },
    { accessorKey: "warehouseFrom", header: "Kho nguồn" },
    { accessorKey: "warehouseTo", header: "Kho đích" },
    { accessorKey: "areaName", header: "Khu vực áp dụng" },
    { accessorKey: "note", header: "Ghi chú" },
    {
      accessorKey: "items",
      header: "Số dòng sản phẩm",
      Cell: ({ cell }) => cell.getValue<FertilizerItem[]>().length,
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
          Quản lý xuất nhập phân bón
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openStockMachine}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table
        //@ts-expect-error no check
        columns={fertilizerTransactionColumns}
        //@ts-expect-error no check
        data={fertilizerTransactionData}
      />
      <Modal
        opened={openedStockMachine}
        onClose={closeStockMachine}
        title={<Text fw="bold">Thêm mới phiếu xuất/nhập phân bón</Text>}
      >
        <AddFertilizerForm onFilter={openFilterEmployee} />
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

export default StockManagementFertilizerPage;
