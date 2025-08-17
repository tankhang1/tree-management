import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
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

import { useState } from "react";
type TransactionPurpose = {
  id: string;
  type: "Thu" | "Chi";
  label: string;
  description?: string;
};
export const transactionPurposes: TransactionPurpose[] = [
  { id: "TP01", type: "Thu", label: "Thu tiền bán nông sản" },
  { id: "TP02", type: "Thu", label: "Thu hoàn trả chi phí" },
  { id: "TP03", type: "Thu", label: "Thu tiền đầu tư" },
  { id: "TP04", type: "Thu", label: "Thu vay vốn" },
  { id: "TP05", type: "Thu", label: "Thu từ trợ cấp" },

  { id: "TP06", type: "Chi", label: "Chi mua vật tư" },
  { id: "TP07", type: "Chi", label: "Chi trả lương nhân công" },
  { id: "TP08", type: "Chi", label: "Chi vận chuyển" },
  { id: "TP09", type: "Chi", label: "Chi thuê máy móc" },
  { id: "TP10", type: "Chi", label: "Chi sửa chữa thiết bị" },
  { id: "TP11", type: "Chi", label: "Chi marketing / bán hàng" },
  { id: "TP12", type: "Chi", label: "Chi phí phân tích đất / nước" },
  { id: "TP13", type: "Chi", label: "Chi phí bảo hiểm" },
  { id: "TP14", type: "Chi", label: "Chi trả lãi vay" },
  { id: "TP15", type: "Chi", label: "Chi phí điện nước" },

  { id: "TP16", type: "Chi", label: "Chi đầu tư xây dựng cơ bản" },
  { id: "TP17", type: "Chi", label: "Chi phát sinh đột xuất" },
  { id: "TP18", type: "Chi", label: "Chi thuê đất" },
  { id: "TP19", type: "Chi", label: "Chi đào tạo nhân sự" },
  { id: "TP20", type: "Chi", label: "Chi phí kiểm định chất lượng" },
];

const FinancePurposeManagementPage = () => {
  const [openedAddForm, setOpenedAddForm] = useState(false);
  const transactionPurposeColumns: MRT_ColumnDef<TransactionPurpose>[] = [
    {
      accessorKey: "id",
      header: "Mã",
    },
    {
      accessorKey: "label",
      header: "Mục đích",
    },
    {
      accessorKey: "type",
      header: "Loại",
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

  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Quản lý mục đích thu - chi
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={() => setOpenedAddForm(true)}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={transactionPurposeColumns} data={transactionPurposes} />
      <Modal
        opened={openedAddForm}
        onClose={() => setOpenedAddForm(false)}
        title={<Text fw={"bold"}>Thêm mục đích thu - chi</Text>}
        radius="md"
      >
        <Stack gap="sm">
          <Select
            searchable
            clearable
            radius={4}
            label="Loại"
            placeholder="Chọn loại"
            data={["Thu", "Chi"]}
            required
          />
          <TextInput
            radius={4}
            label="Tên mục đích"
            placeholder="Nhập tên"
            required
          />
          <Textarea
            radius={4}
            label="Ghi chú"
            placeholder="Ghi chú thêm (nếu có)"
          />
          <Group justify="flex-end" mt="md">
            <Button
              radius={4}
              onClick={() => {
                // Handle add purpose logic here
                setOpenedAddForm(false);
              }}
            >
              Thêm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default FinancePurposeManagementPage;
