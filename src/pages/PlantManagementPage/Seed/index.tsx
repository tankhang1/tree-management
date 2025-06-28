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
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconHome,
  IconTrash,
  IconWorld,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import AddSeedForm from "./components/AddSeedForm";

type SeedInfo = {
  id: string; // Mã giống cây (hệ thống)
  name: string; // Tên giống
  supplier: string; // Nhà cung cấp
  origin: string; // Xuất xứ (quốc gia)
  germinationRate: number; // Tỷ lệ nảy mầm (%)
  yield: string; // Năng suất (ví dụ: "25 tấn/ha")
  note: string; // Mô tả
  technicalDoc: string | null; // Link tài liệu kỹ thuật hoặc tên file
};
const seedDataset: SeedInfo[] = [
  {
    id: "SR-RI6",
    name: "Giống Ri6",
    supplier: "Công ty Nông sản Việt",
    origin: "Việt Nam",
    germinationRate: 85,
    yield: "25 tấn/ha",
    note: "Giống được kiểm định bởi Bộ NN&PTNT.",
    technicalDoc: "ri6-tech-guide.pdf",
  },
  {
    id: "X-MT01",
    name: "Xoài Miền Tây 01",
    supplier: "Công ty Mekong Seed",
    origin: "Việt Nam",
    germinationRate: 90,
    yield: "30 tấn/ha",
    note: "Chống chịu sâu bệnh tốt, phù hợp với khí hậu miền Tây.",
    technicalDoc: "xoai-mt01.pdf",
  },
];

const PlantManagementSeedPage = () => {
  const [openedSeedForm, { open: openSeedForm, close: closeSeedForm }] =
    useDisclosure(false);
  const seedColumns: MRT_ColumnDef<SeedInfo>[] = [
    { accessorKey: "id", header: "Mã giống" },
    { accessorKey: "name", header: "Tên giống" },
    { accessorKey: "supplier", header: "Nhà cung cấp" },
    { accessorKey: "origin", header: "Xuất xứ" },
    {
      accessorKey: "germinationRate",
      header: "Tỷ lệ nảy mầm (%)",
      Cell: ({ cell }) => `${cell.getValue()}%`,
    },
    { accessorKey: "yield", header: "Năng suất" },
    { accessorKey: "note", header: "Mô tả" },
    {
      accessorKey: "technicalDoc",
      header: "Tài liệu kỹ thuật",
      Cell: ({ cell }) =>
        cell.getValue() ? (
          <a
            href={`/${cell.getValue()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tài liệu tham khảo
          </a>
        ) : (
          "Không có"
        ),
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
          <Button onClick={openSeedForm} radius={4}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Autocomplete
          radius={4}
          leftSection={<IconHome size={18} />}
          placeholder="Nhà cung cấp"
          data={["Đại lí A"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconWorld size={18} />}
          placeholder="Xuất xứ"
          data={["Việt nam"]}
        />
      </Group>
      <Table columns={seedColumns} data={seedDataset} />
      <Modal
        opened={openedSeedForm}
        onClose={closeSeedForm}
        title={<Text fw={500}>Tạo mới giống cây</Text>}
      >
        <AddSeedForm />
      </Modal>
    </Stack>
  );
};

export default PlantManagementSeedPage;
