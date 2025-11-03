import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CloseButton,
  Group,
  Menu,
  Modal,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconBrandMetabrainz,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSandbox,
  IconSearch,
  IconTrash,
  IconTree,
  IconX,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import TreeDetailView from "./components/TreeView";
import { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
type Allocation = {
  allocationId: string; // Mã đợt phân bổ
  recordedAt: Date; // Ngày ghi nhận
  crop: string; // Tên cây trồng
  region: string; // Vùng
  area: string; // Khu vực
  plot: string; // Lô
  cultivationZone: string; // Khu vực canh tác
};
const allocationData: Allocation[] = [
  {
    allocationId: "1",
    recordedAt: new Date("2025-08-01"),
    crop: "Sầu riêng Ri6",
    region: "Vùng A",
    area: "Khu vực A1",
    plot: "Lô A1",
    cultivationZone: "Khu vực canh tác Đồng Nai",
  },
  {
    allocationId: "2",
    recordedAt: new Date("2025-08-02"),
    crop: "Sầu riêng Monthong",
    region: "Vùng A",
    area: "Khu vực A2",
    plot: "Lô A2",
    cultivationZone: "Khu vực canh tác Đồng Nai",
  },
  {
    allocationId: "3",
    recordedAt: new Date("2025-08-03"),
    crop: "Mít Thái",
    region: "Vùng B",
    area: "Khu vực B1",
    plot: "Lô B1",
    cultivationZone: "Khu vực canh tác Tây Nguyên",
  },
  {
    allocationId: "4",
    recordedAt: new Date("2025-08-04"),
    crop: "Xoài Cát Hòa Lộc",
    region: "Vùng B",
    area: "Khu vực B2",
    plot: "Lô B2",
    cultivationZone: "Khu vực canh tác Tây Nguyên",
  },
];
type TTree = {
  type: string;
  variety: string;
  img: string;
  seed: string;
  method: string;
  irrigation: string;
  plantedAt: string;
  region: string;
  area: string;
  plot: string;
  row: string;
  coords: [number, number][];
};
const tree: TTree = {
  type: "Cây sầu riêng",
  variety: "Sầu riêng Ri6",
  seed: "Hạt giống Ri6 F1",
  method: "Trồng theo hố, cách 6m",
  img: "https://sinhhocchaua.com/wp-content/uploads/2024/02/gioi-thieu-cay-sau-rieng-1.jpg",
  irrigation: "Tưới nhỏ giọt",
  plantedAt: "2024-07-05",
  region: "Vùng A",
  area: "Khu vực A1",
  plot: "Lô A1",
  row: "Hàng 1",
  coords: [
    [10.123, 106.123],
    [10.124, 106.124],
  ],
};

const AreaManagementTreePage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [openedRowForm, { open: openRowForm, close: closeRowForm }] =
    useDisclosure(false);
  const onClearAll = () => {
    setKeyword("");
  };
  const onAddTree = () => {
    navigate(PATH.AREA_ADD_TREE);
  };
  const allocationColumns: MRT_ColumnDef<Allocation>[] = [
    {
      accessorKey: "cultivationZone",
      header: "Khu vực canh tác",
    },
    {
      accessorKey: "allocationId",
      header: "Đợt phân bổ",
    },
    {
      accessorKey: "recordedAt",
      header: "Ngày ghi nhận",
      Cell: ({ row }) =>
        new Date(row.original.recordedAt).toLocaleDateString("vi-VN"),
    },
    {
      accessorKey: "crop",
      header: "Cây trồng",
    },
    {
      accessorKey: "region",
      header: "Vùng",
    },
    {
      accessorKey: "area",
      header: "Khu vực",
    },
    {
      accessorKey: "plot",
      header: "Lô",
    },
    {
      accessorKey: "actions",
      header: "Tùy chọn",
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
              onClick={openRowForm}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xóa
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
          Danh mục phân bổ
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddTree}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm danh mục phân bổ</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc cây trồng chính, vùng, khu vực, khoảng
              thời gian
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={onClearAll}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        {/* Form */}
        <Stack gap="sm">
          {/* Khung tìm kiếm (keyword) */}
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Ví dụ: KV-AG01, Vùng Trồng Đậu Nành, HTX Vàm Nao, An Giang…"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconTree size={18} />}
              label="Cây trồng chính"
              description="Ví dụ: Đậu Nành, Ngô"
              placeholder="Chọn thông tin"
              data={[
                { value: "rice", label: "Lúa" },
                { value: "corn", label: "Ngô" },
                { value: "potato", label: "Khoai tây" },
              ]}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconSandbox size={18} />}
              label="Khu vực canh tác"
              description="Ví dụ: Đồng bằng sông Cửu Long, Tây Nguyên"
              placeholder="Chọn thông tin"
              multiple
              data={[
                { value: "mekong_delta", label: "Đồng bằng sông Cửu Long" },
                { value: "central_highlands", label: "Tây Nguyên" },
              ]}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              multiple
              leftSection={<IconBrandMetabrainz size={18} />}
              label="Vùng"
              description="Ví dụ: Vùng A, Vùng B"
              placeholder="Chọn thông tin"
              data={[
                { value: "region_a", label: "Vùng A" },
                { value: "region_b", label: "Vùng B" },
              ]}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              multiple
              leftSection={<IconBrandMetabrainz size={18} />}
              label="Khu vực"
              description="Ví dụ: Khu vực A, Khu vực B"
              placeholder="Chọn thông tin"
              data={[
                { value: "area_a", label: "Khu vực A" },
                { value: "area_b", label: "Khu vực B" },
              ]}
            />
            <DatePickerInput
              type="range"
              radius={4}
              label="Khoảng thời gian"
              description="Ví dụ: 01/01/2023 - 31/12/2023"
              placeholder="Chọn thông tin"
              clearable
              locale="vi"
              value={[null, null]}
              onChange={() => {}}
            />
          </SimpleGrid>

          {/* Tóm tắt filter bằng chips (UI) */}
          {keyword && (
            <Group gap={8}>
              {keyword && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setKeyword("")} />}
                >
                  Từ khoá: {keyword}
                </Badge>
              )}

              <ActionIcon
                variant="subtle"
                onClick={onClearAll}
                title="Xoá tất cả"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Card>
      <Table columns={allocationColumns} data={allocationData} />
      <Modal
        opened={openedRowForm}
        onClose={closeRowForm}
        size={"lg"}
        title={<Text fw={"bold"}>Chi tiết phân bổ</Text>}
      >
        <TreeDetailView tree={tree} />
      </Modal>
    </Stack>
  );
};
export default AreaManagementTreePage;
