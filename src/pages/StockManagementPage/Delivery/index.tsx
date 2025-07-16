import {
  ActionIcon,
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
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type WarehouseStockItem = {
  id: string;
  warehouseName: string; // Tên kho
  areaName: string; // Khu vực (tên hiển thị)
  group: "BVTV" | "Vật tư" | "Phân bón" | "Máy móc";
  itemName: string; // Tên vật tư / phân bón / thiết bị
  quantity: number;
  unit: string; // Đơn vị: kg, bao, gói, cái, lít...
  packing: string; // Quy cách đóng gói
  createdAt: string; // Ngày tạo / nhập kho
};
const warehouseStockDataset: WarehouseStockItem[] = [
  {
    id: "W001",
    warehouseName: "Kho Long An",
    areaName: "Long An",
    group: "Phân bón",
    itemName: "Phân NPK 16-16-8",
    quantity: 200,
    unit: "bao",
    packing: "25kg/bao",
    createdAt: "2025-07-16",
  },
  {
    id: "W002",
    warehouseName: "Kho Tiền Giang",
    areaName: "Tiền Giang",
    group: "BVTV",
    itemName: "Thuốc trừ sâu Regent",
    quantity: 50,
    unit: "chai",
    packing: "100ml/chai",
    createdAt: "2025-07-16",
  },
  {
    id: "W003",
    warehouseName: "Kho Đà Nẵng",
    areaName: "Đà Nẵng",
    group: "Máy móc",
    itemName: "Máy cày Kubota",
    quantity: 2,
    unit: "cái",
    packing: "1 máy/đơn vị",
    createdAt: "2025-07-16",
  },
];

const StockManagementDeliveryPage = () => {
  const navigate = useNavigate();

  const onAddDelivery = () => {
    navigate(PATH.STOCK_ADD_DELIVERY);
  };
  const onDeliveryDetail = () => {
    navigate(PATH.STOCK_DELIVERY_DETAIL);
  };
  const warehouseStockColumns: MRT_ColumnDef<WarehouseStockItem>[] = [
    {
      accessorKey: "warehouseName",
      header: "Kho",
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "areaName",
      header: "Khu vực",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "group",
      header: "Nhóm",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "itemName",
      header: "Tên vật tư",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
      Cell: ({ cell }) => <Text>{cell.getValue<number>()}</Text>,
    },
    {
      accessorKey: "unit",
      header: "Đơn vị",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "packing",
      header: "Quy cách",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
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
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onDeliveryDetail}
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
          Quản lý kho vận
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddDelivery}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={warehouseStockColumns} data={warehouseStockDataset} />
    </Stack>
  );
};

export default StockManagementDeliveryPage;
