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
import AddPesticideForm from "./components/AddPesicideForm";
import { useState } from "react";

type PesticideTransactionType = "nhập" | "xuất" | "huỷ";
type PesticideTransaction = {
  id: string; // Mã phiếu (nếu cần)
  typeId: string; // Mã loại thuốc (V.1)
  pesticideId: string; // Mã thuốc (V.2), được lọc theo loại
  quantity: number; // Số lượng
  unit: string; // Đơn vị tính (ml, g, ...), tự quy đổi nếu cần
  type: PesticideTransactionType; // Nhập, Xuất, Huỷ
  date: string; // Ngày thực hiện
  staffId: string; // Nhân viên thực hiện (XI)
  note?: string; // Ghi chú
};

const pesticideTransactions: PesticideTransaction[] = [
  {
    id: "PTX001",
    typeId: "TYPE01", // Thuốc trừ sâu
    pesticideId: "TH001",
    quantity: 1000,
    unit: "ml",
    type: "nhập",
    date: "2024-06-20",
    staffId: "EMP001",
    note: "Nhập từ Công ty Nông Dược A",
  },
  {
    id: "PTX002",
    typeId: "TYPE01",
    pesticideId: "TH001",
    quantity: 500,
    unit: "ml",
    type: "xuất",
    date: "2024-06-22",
    staffId: "EMP002",
    note: "Phun lô cây số 4",
  },
  {
    id: "PTX003",
    typeId: "TYPE02", // Thuốc trừ bệnh
    pesticideId: "TH002",
    quantity: 200,
    unit: "g",
    type: "huỷ",
    date: "2024-06-25",
    staffId: "EMP003",
    note: "Thuốc hỏng, đổi màu",
  },
];
const StockManagementPesticidePage = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState("");

  const [
    openedStockPesticide,
    { open: openStockPesticide, close: closeStockPesticide },
  ] = useDisclosure(false);
  const pesticideTransactionColumns: MRT_ColumnDef<PesticideTransaction>[] = [
    { accessorKey: "id", header: "Mã phiếu" },
    { accessorKey: "typeId", header: "Loại thuốc" }, // bạn có thể map sang tên
    { accessorKey: "pesticideId", header: "Tên thuốc" }, // map sang tên nếu có
    { accessorKey: "quantity", header: "Số lượng" },
    { accessorKey: "unit", header: "Đơn vị" },
    {
      accessorKey: "type",
      header: "Loại phiếu",
      Cell: ({ cell }) => {
        const value = cell.getValue<PesticideTransactionType>();
        const color =
          value === "nhập" ? "green" : value === "xuất" ? "blue" : "red";
        return <Badge color={color}>{value.toUpperCase()}</Badge>;
      },
    },
    {
      accessorKey: "date",
      header: "Ngày thực hiện",
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
          Quản lý phiếu xuất nhập thuốc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openStockPesticide}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table
        columns={pesticideTransactionColumns}
        data={pesticideTransactions}
      />
      <Modal
        opened={openedStockPesticide}
        onClose={closeStockPesticide}
        title={<Text fw="bold">Thêm mới phiếu xuất/nhập thuốc</Text>}
      >
        <AddPesticideForm onFilter={openFilterEmployee} />
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

export default StockManagementPesticidePage;
