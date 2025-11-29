import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
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
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react"; // Import thêm hooks
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import { PATH } from "../../../constants/path.constants";
import { type Seed, useSeedStore } from "../../zustand/seedStore";
import SeedDetailView from "./components/SeedDetailView";

const PlantManagementSeedPage = () => {
  const { seeds, deleteSeed } = useSeedStore(); // Lấy thêm hàm delete nếu cần
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ MODAL CHI TIẾT ---
  const [openedSeedForm, { open: openSeedForm, close: closeSeedForm }] =
    useDisclosure(false);
  const [selectedSeed, setSelectedSeed] = useState<Seed | null>(null);

  // --- STATE QUẢN LÝ INPUT LỌC ---
  // State lưu giá trị đang nhập trên form
  const [keyword, setKeyword] = useState("");
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);

  // State lưu giá trị ĐÃ KÍCH HOẠT để lọc (dùng khi nhấn nút "Lọc thông tin")
  // Nếu bạn muốn lọc Real-time (nhập tới đâu lọc tới đó) thì bỏ phần Active này và dùng trực tiếp state ở trên.
  const [activeFilter, setActiveFilter] = useState({
    keyword: "",
    suppliers: [] as string[],
    origins: [] as string[],
  });

  const onAddSeed = () => {
    navigate(PATH.PLANT_ADD_SEED);
  };

  // --- LOGIC TẠO DỮ LIỆU DROPDOWN ĐỘNG ---
  // Tự động lấy danh sách unique từ dữ liệu seeds có sẵn
  const supplierOptions = useMemo(() => {
    return Array.from(new Set(seeds.map((s) => s.supplier))).filter(Boolean);
  }, [seeds]);

  const originOptions = useMemo(() => {
    return Array.from(new Set(seeds.map((s) => s.origin))).filter(Boolean);
  }, [seeds]);

  // --- LOGIC FILTER ---
  const handleApplyFilter = () => {
    setActiveFilter({
      keyword,
      suppliers: selectedSuppliers,
      origins: selectedOrigins,
    });
  };

  const handleResetFilter = () => {
    setKeyword("");
    setSelectedSuppliers([]);
    setSelectedOrigins([]);
    setActiveFilter({
      keyword: "",
      suppliers: [],
      origins: [],
    });
  };

  const filteredSeeds = useMemo(() => {
    return seeds.filter((seed) => {
      // 1. Lọc theo từ khóa (Mã hoặc Tên)
      const matchKeyword =
        activeFilter.keyword === "" ||
        seed.name.toLowerCase().includes(activeFilter.keyword.toLowerCase()) ||
        seed.id.toLowerCase().includes(activeFilter.keyword.toLowerCase());

      // 2. Lọc theo Nhà cung cấp
      const matchSupplier =
        activeFilter.suppliers.length === 0 ||
        activeFilter.suppliers.includes(seed.supplier);

      // 3. Lọc theo Xuất xứ
      const matchOrigin =
        activeFilter.origins.length === 0 ||
        activeFilter.origins.includes(seed.origin);

      return matchKeyword && matchSupplier && matchOrigin;
    });
  }, [seeds, activeFilter]);

  // --- XỬ LÝ ACTION ---
  const handleViewDetail = (seed: Seed) => {
    setSelectedSeed(seed);
    openSeedForm();
  };

  const handleEdit = (id: string) => {};

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giống cây này?")) {
      // Gọi hàm xóa từ store
      // deleteSeed(id);
      console.log("Delete id:", id);
    }
  };

  // --- CẤU HÌNH CỘT ---
  const seedColumns: MRT_ColumnDef<Seed>[] = [
    {
      accessorKey: "imgUrl",
      header: "Hình ảnh",
      size: 80,
      Cell: ({ cell }) => {
        const url = cell.getValue<string>();
        return url ? (
          <Image
            src={url}
            alt="Ảnh giống cây"
            style={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <Text size="xs" c="dimmed">
            Không có ảnh
          </Text>
        );
      },
    },
    { accessorKey: "id", header: "Mã giống" },
    { accessorKey: "name", header: "Tên giống" },
    { accessorKey: "supplier", header: "Nhà cung cấp" },
    { accessorKey: "origin", header: "Xuất xứ" },
    {
      accessorKey: "germinationRate",
      header: "Tỷ lệ nảy mầm",
      Cell: ({ cell }) => `${cell.getValue()}%`,
    },
    {
      accessorKey: "uniformity",
      header: "Độ đồng đều",
      Cell: ({ cell }) => `${cell.getValue()}%`,
    },
    { accessorKey: "yield", header: "Năng suất" },
    {
      accessorKey: "note",
      header: "Mô tả",
      Cell: ({ cell }) => (
        <Text lineClamp={2} size="sm">
          <div
            dangerouslySetInnerHTML={{ __html: cell.getValue() as string }}
          />
        </Text>
      ),
    },
    {
      accessorKey: "technicalDoc",
      header: "Tài liệu kỹ thuật",
      Cell: ({ cell }) =>
        cell.getValue() ? (
          <a
            href={`/${cell.getValue()}`} // Cần logic xử lý URL file thực tế
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#228be6" }}
          >
            Xem tài liệu
          </a>
        ) : (
          <Text c="dimmed" size="sm">
            Không có
          </Text>
        ),
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => handleViewDetail(row.original)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => handleEdit(row.original.id)}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} />}
              color="red"
              onClick={() => handleDelete(row.original.id)}
            >
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
          Quản lý hạt giống cây
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button onClick={onAddSeed} radius={4}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      {/* FILTER CARD */}
      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm hạt giống cây</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc nhà cung cấp, xuất xứ
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={handleResetFilter}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button
              radius={4}
              leftSection={<IconSearch size={16} />}
              onClick={handleApplyFilter}
            >
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        {/* Filter Inputs */}
        <Stack gap="sm">
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Tìm theo tên giống hoặc mã giống"
            placeholder="Nhập thông tin..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
            // Cho phép nhấn Enter để lọc luôn
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApplyFilter();
            }}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Nhà cung cấp"
              placeholder="Chọn nhà cung cấp"
              data={supplierOptions}
              value={selectedSuppliers}
              onChange={setSelectedSuppliers}
              searchable
              clearable
            />
            <MultiSelect
              radius={4}
              label="Xuất xứ"
              placeholder="Chọn quốc gia"
              data={originOptions}
              value={selectedOrigins}
              onChange={setSelectedOrigins}
              searchable
              clearable
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {/* TABLE */}
      {/* Hiển thị số lượng kết quả tìm thấy */}
      <Text size="sm" fs="italic" c="dimmed">
        Tìm thấy {filteredSeeds.length} kết quả
      </Text>

      <Table columns={seedColumns} data={filteredSeeds} />

      {/* MODAL CHI TIẾT */}
      <Modal
        opened={openedSeedForm}
        onClose={closeSeedForm}
        title={<Text fw={500}>Thông tin chi tiết giống hạt</Text>}
        size="lg"
      >
        {selectedSeed ? (
          <SeedDetailView seed={selectedSeed} />
        ) : (
          <Text>Đang tải...</Text>
        )}
      </Modal>
    </Stack>
  );
};

export default PlantManagementSeedPage;
