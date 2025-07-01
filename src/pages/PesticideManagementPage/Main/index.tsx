import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
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

type UnitType = "lit" | "ml" | "g" | "kg";

type Pesticide = {
  id: string; // mã thuốc (mã hệ thống)
  name: string; // tên thuốc
  typeId: string; // loại thuốc (từ V.1)
  unit: UnitType; // đơn vị
  info: string; // thông tin thuốc
  ingredients: string; // thành phần công thức
  usage: string; // hướng dẫn sử dụng
};
const pesticides: Pesticide[] = [
  {
    id: "TH001",
    name: "Thuốc trừ sâu SuperKiller",
    typeId: "TYPE01",
    unit: "ml",
    info: "Diệt trừ sâu cuốn lá, rầy nâu hiệu quả cao",
    ingredients: "Chlorpyrifos Ethyl 500g/l + Cypermethrin 50g/l",
    usage: "Pha 25ml cho bình 16L, phun đều mặt lá vào sáng sớm",
  },
  {
    id: "TH002",
    name: "Thuốc trừ bệnh BioShield",
    typeId: "TYPE02",
    unit: "g",
    info: "Đặc trị nấm hại trên cây ăn quả",
    ingredients: "Copper Hydroxide 77%",
    usage: "Pha 20g với 8L nước, phun ướt đều thân và lá",
  },
  {
    id: "TH003",
    name: "Phân bón lá GrowUp",
    typeId: "TYPE03",
    unit: "lit",
    info: "Cung cấp dinh dưỡng vi lượng cho cây trong giai đoạn sinh trưởng",
    ingredients: "NPK + Bo + Zn + Mn",
    usage: "Pha 30ml với 10L nước, phun định kỳ 7 ngày/lần",
  },
];

const PesticideManagementMainPage = () => {
  const navigate = useNavigate();
  const onAddPesticide = () => {
    navigate(PATH.PESTICIDE_ADD_MAIN);
  };
  const onPesticideDetail = () => {
    navigate(PATH.PESTICIDE_MAIN_DETAIL);
  };
  const pesticideColumns: MRT_ColumnDef<Pesticide>[] = [
    { accessorKey: "id", header: "Mã thuốc" },
    { accessorKey: "name", header: "Tên thuốc" },
    { accessorKey: "typeId", header: "Loại thuốc" }, // bạn có thể map từ ID sang tên nếu có danh sách
    { accessorKey: "unit", header: "Đơn vị" },
    { accessorKey: "info", header: "Thông tin thuốc" },
    { accessorKey: "ingredients", header: "Thành phần" },
    { accessorKey: "usage", header: "Hướng dẫn sử dụng" },
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
              onClick={onPesticideDetail}
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
          Quản lý thuốc bảo vệ thực vật
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddPesticide}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={pesticideColumns} data={pesticides} />
    </Stack>
  );
};
export default PesticideManagementMainPage;
