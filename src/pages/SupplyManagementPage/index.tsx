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
type SupplyType = {
  id: string; // Mã vật tư
  name: string; // Tên vật tư
  supplier: string; // Nhà cung cấp
};
export const supplyTypes: SupplyType[] = [
  {
    id: "VT001",
    name: "Phân NPK 16-16-8",
    supplier: "Công ty Phân bón Miền Nam",
  },
  {
    id: "VT002",
    name: "Thuốc trừ sâu SuperKiller",
    supplier: "Công ty Nông dược Việt Á",
  },
  {
    id: "VT003",
    name: "Bạt phủ nilon đen",
    supplier: "Cửa hàng Vật tư nông nghiệp Tân Phú",
  },
  {
    id: "VT004",
    name: "Chai nhựa 500ml",
    supplier: "CTCP Bao bì An Phát",
  },
];

const SupplyManagementPage = () => {
  const navigate = useNavigate();

  const supplyTypeColumns: MRT_ColumnDef<SupplyType>[] = [
    {
      accessorKey: "id",
      header: "Mã vật tư",
    },
    {
      accessorKey: "name",
      header: "Tên vật tư",
    },
    {
      accessorKey: "supplier",
      header: "Nhà cung cấp",
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
  const onAddSupply = () => {
    navigate(PATH.SUPPLY_ADD_MAIN);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý vật tư
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddSupply}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={supplyTypeColumns} data={supplyTypes} />
    </Stack>
  );
};
export default SupplyManagementPage;
