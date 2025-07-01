import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconChartAreaFilled,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconLivePhoto,
  IconSearch,
  IconTableRow,
  IconTrash,
  IconTree,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddVarietyForm from "./components/AddVarietyForm";

type CropVariety = {
  id: string;
  name: string;
  description: string;
  treeName: string;
  areaId: string;
  zoneId: string;
  plotId: string;
};
const cropVarietyDataset: CropVariety[] = [
  {
    id: "CV001",
    name: "Sầu riêng Ri6",
    description: "Giống sầu riêng cơm vàng, hạt lép, năng suất cao",
    treeName: "Sầu riêng",
    areaId: "A01",
    zoneId: "Z01",
    plotId: "P01",
  },
  {
    id: "CV002",
    name: "Xoài Cát Chu",
    description: "Thơm, ngọt, vỏ mỏng, đặc sản miền Tây",
    treeName: "Xoài",
    areaId: "A02",
    zoneId: "Z03",
    plotId: "P04",
  },
  {
    id: "CV003",
    name: "Chuối già Nam Mỹ",
    description: "Giống chuối công nghiệp xuất khẩu",
    treeName: "Chuối",
    areaId: "A01",
    zoneId: "Z02",
    plotId: "P02",
  },
  {
    id: "CV004",
    name: "Cà phê Robusta",
    description: "Năng suất cao, thích hợp vùng đất đỏ bazan",
    treeName: "Cà phê",
    areaId: "A03",
    zoneId: "Z04",
    plotId: "P07",
  },
  {
    id: "CV005",
    name: "Mít Thái siêu sớm",
    description: "Giống mít cho trái nhanh, thơm ngọt",
    treeName: "Mít",
    areaId: "A02",
    zoneId: "Z03",
    plotId: "P05",
  },
];

const PlantManagementVarietyPage = () => {
  const [
    openedVarietyForm,
    { open: openVarietyForm, close: closeVarietyForm },
  ] = useDisclosure(false);
  const cropVarietyColumns: MRT_ColumnDef<CropVariety>[] = [
    {
      accessorKey: "id",
      header: "Mã giống",
    },
    {
      accessorKey: "name",
      header: "Tên giống",
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      size: 250,
    },
    {
      accessorKey: "treeName",
      header: "Tên cây",
    },
    {
      accessorKey: "areaId",
      header: "Mã khu",
    },
    {
      accessorKey: "zoneId",
      header: "Mã vùng",
    },
    {
      accessorKey: "plotId",
      header: "Mã lô",
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
          Quản lý giống cây
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openVarietyForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Autocomplete
          radius={4}
          leftSection={<IconTree size={18} />}
          placeholder="Cây trồng"
          data={["Sầu riêng"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconSearch size={18} />}
          placeholder="Tìm kiếm vùng"
          data={["Vùng trồng sầu riêng Đồng Nai"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconChartAreaFilled size={18} />}
          placeholder="Tìm kiếm khu vực"
          data={["Vùng trồng sầu riêng Đồng Nai"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconLivePhoto size={18} />}
          placeholder="Tìm kiếm lô"
          data={["Vùng trồng sầu riêng Đồng Nai"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconTableRow size={18} />}
          placeholder="Tìm kiếm hàng"
          data={["Vùng trồng sầu riêng Đồng Nai"]}
        />
      </Group>
      <Table columns={cropVarietyColumns} data={cropVarietyDataset} />
      <Modal
        opened={openedVarietyForm}
        onClose={closeVarietyForm}
        title={<Text fw={500}>Tạo mới giống cây</Text>}
      >
        <AddVarietyForm />
      </Modal>
    </Stack>
  );
};

export default PlantManagementVarietyPage;
